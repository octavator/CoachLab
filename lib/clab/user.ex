defmodule User do
  use GenServer
  import Plug.Conn
  require Logger

  @table :users
  @path ~c"data/users.ets"
  @password_secret "Pa4z=7lfce2bHh$3W2ma2zlpe6ez!0r"

  def start_link(args \\ []) do
    GenServer.start_link(__MODULE__, args, name: __MODULE__)
  end

  def init(_args) do
    if File.exists?(@path) do
      Logger.info("[ETS] Loading #{@table} from backup")
      {:ok, _ref} = :ets.file2tab(@path)
      Logger.info("[ETS] Success loading #{@table}")
    else
      Logger.info("[ETS] Initing #{@table} from scratch")
      :ets.new(@table, [:named_table, :public])
    end

    Process.flag(:trap_exit, true)
    {:ok, %{}}
  end

  def handle_call({:get_user, email}, _from, state) do
    value =
      @table
      |> :ets.tab2list()
      |> Enum.find(fn {_key, user} -> user.email == email end)
      |> case do
        {_key, value} ->
          value

        _ ->
          nil
      end
    {:reply, value, state}
  end

  def handle_call({:get_user_by_id, id}, _from, state) do
    try do
      [{_key, value}] = :ets.lookup(@table, id)
      {:reply, value, state}
    rescue
      _ ->
        {:reply, nil, state}
    end
  end

  def handle_call({:search_coach_by_name, name}, _from, state) do
    matching_coaches =
      @table
      |> :ets.tab2list()
      |> Enum.map(fn {_key, user} -> User.format_user(user) end)
      |> Enum.filter(& &1.role == "coach" && Utils.contains_string(&1.lastname, name))

    {:reply, matching_coaches, state}
  end

  def handle_call({:create_user, data}, _from, state) do
    id =
      :crypto.strong_rand_bytes(32)
      |> Base.url_encode64(padding: false)
      |> String.replace("/", "-")
      |> String.replace("+", "_")

    data = Map.put(data, :id, id)
    true = :ets.insert_new(@table, {id, data})
    Agenda.create_agenda(id)
    {:reply, data, state}
  end

  def handle_call({:edit_user, {id, data}}, _from, state) do
    [{_key, old_data}] = :ets.lookup(@table, id)
    new_data = Map.merge(old_data, data)
    res = :ets.insert(@table, {id, new_data})
    {:reply, res, state}
  end

  def handle_call({:delete_user, id}, _from, state) do
    File.rm_rf("data/images/#{id}")
    res = :ets.delete(@table, id)
    {:reply, res, state}
  end

  def handle_call({:get_linked_users, user_id}, _from, state) do
    try do
      [{_key, user}] = :ets.lookup(@table, user_id)
      linked_users =
        if user.role == "coach" do
          get_coached_users(user[:id])
        else
          get_coaching_users(user[:coaches])
        end

      {:reply, linked_users, state}
    rescue
      e ->
        Logger.warning("Error getting linked users: #{inspect(e)}")
        {:reply, [], state}
    end
  end

  def handle_info({:EXIT, _from, reason}, state) do
    Logger.info("[ETS] Saving #{@table} table in #{@path}")
    :ets.tab2file(@table, @path)
    {:stop, reason, state}
  end

  def terminate(_reason, _state) do
    Logger.info("[ETS] Saving #{@table} table in #{@path}")
    :ets.tab2file(@table, @path)
  end

  def get_user(nil), do: nil
  def get_user(email) do
    GenServer.call(__MODULE__, {:get_user, email})
    |> User.format_user()
  end

  def get_user_by_id(nil), do: nil
  def get_user_by_id(id) do
    GenServer.call(__MODULE__, {:get_user_by_id, id})
    |> User.format_user()
  end

  def get_all_user_info_by_id(nil), do: nil
  def get_all_user_info_by_id(id) do
    GenServer.call(__MODULE__, {:get_user_by_id, id})
  end

  def get_all_user_info(nil), do: nil
  def get_all_user_info(email) do
    GenServer.call(__MODULE__, {:get_user, email})
  end

  def is_new_email(email) do
    @table
    |> :ets.tab2list()
    |> Enum.find(fn {_key, user} -> user.email == email end)
    |> is_nil()
  end

  def confirm_signup(conn, user) do
    try do
      Logger.debug("New user: #{inspect(user)}")
      user.role
      |> case do
        "coach" ->
          [:avatar, :certification, :idcard, :rib]

        _ ->
          [:avatar]
      end
      |> Enum.all?(&Utils.move_user_files(user, &1))
      |> if do
        Clab.Mailer.send_confirmation_mail(user)
        Clab.Mailer.send_signup_alert(user)
        ImageMover.copy_user_avatar(user.id)
        token = Clab.AuthPlug.build_token(user.id)
        conn = put_resp_cookie(conn, "cltoken", token, same_site: "Strict")
        {conn, 200, "Votre compte a été bien été créé."}
      else
        User.delete_user(user.id)
        {conn, 400, "Une erreur est survenue lors de la sauvegarde d'un de vos fichiers."}
      end
    rescue
      e ->
        Logger.error("[ERROR] Bad signup for user: #{user.email}, #{inspect(e)}")
        User.delete_user(user.id)
        {conn, 500, "Une erreur est survenue lors de la création de votre compte."}
    end
  end

  def create_user(data) do
    cond do
      !is_new_email(data[:email]) ->
        :email_already_used

      !data[:email] || !data[:password] ->
        :error

      true ->
        salt = :rand.uniform() |> to_string |> Base.encode16()
        hashed_pwd = hash_password(data[:password], salt)
        updated_data =
          data
          |> Map.put(:password, hashed_pwd)
          |> Map.put(:salt, salt)
          |> Map.delete(:password_check)

        GenServer.call(__MODULE__, {:create_user, updated_data})
    end
  end

  def hash_password(password, salt) do
    :crypto.hash(:sha256, salt <> password)
    |> Base.encode16()
  end

  def format_user(nil), do: nil
  def format_user(user) do
    Map.take(user, [:firstname, :lastname, :email, :id, :role, :avatar, :coaches, :session_price, :price_id])
  end

  def get_coached_users(coach_id) do
    @table
    |> :ets.tab2list()
    |> Stream.filter(fn {_key, user} ->
      user[:coaches]
      |> List.wrap()
      |> Enum.member?(coach_id)
    end)
    |> Task.async_stream(fn {_key, user} ->
      User.format_user(user)
    end)
    |> Enum.map(fn {:ok, res} -> res end)
  end

  def get_coaching_users(coaches_id) do
    @table
    |> :ets.tab2list()
    |> Stream.filter(fn {_key, user} ->
      Enum.member?(coaches_id, user[:id])
    end)
    |> Task.async_stream(fn {_key, user} ->
      User.format_user(user)
    end)
    |> Enum.map(fn {:ok, user} -> user end)
  end

  def change_password(password, token) do
    decoded_token = Base.decode64!(token, padding: false)
    @password_secret <> user_email = decoded_token
    user = User.get_all_user_info(user_email)
    hashed_password = hash_password(password, user.salt)
    User.edit_user(user.id, %{password: hashed_password})
  end

  def create_reset_hash(user_email) do
    @password_secret
    |> Kernel.<>(user_email)
    |> Base.encode64(padding: false)
  end

  def delete_user(id) do
    GenServer.call(__MODULE__, {:delete_user, id})
  end

  def search_coach_by_name(name) do
    GenServer.call(__MODULE__, {:search_coach_by_name, name})
  end

  def get_linked_users(user_id) do
    GenServer.call(__MODULE__, {:get_linked_users, user_id})
  end

  def edit_user(id, data) do
    GenServer.call(__MODULE__, {:edit_user, {id, data}})
  end
end

#  User.create_user(%{
#   email: "theodecagny@hotmail.fr",
#   firstname: "Theophile",
#   lastname: "de Cagny",
#   password: "azerty",
#   role: "coach",
#   coached_ids: [],
#   session_price: "50"
# })
