defmodule User do
  require Logger
  use GenServer

  @table :users
  @path 'data/users.ets'
  @secret "Pa4z=7lfce2bHh$3W2ma2zlpe6ez!0r"

  def start_link(args \\ []) do
    GenServer.start_link(__MODULE__, args, name: __MODULE__)
  end

  def init(_args) do
    if File.exists?(@path) do
      Logger.info("[ETS] Loading #{@table} from backup")
      {:ok, _ref} = :ets.file2tab(@path)
      Logger.info("[ETS] Success loading #{@table}")
    else
      :ets.new(@table, [:named_table, :public])
    end

    Process.flag(:trap_exit, true)
    {:ok, %{}}
  end

  def handle_info({:EXIT, _from, reason}, state) do
    Logger.info("[ETS] Saving #{@table} table in #{@path}")
    :ets.tab2file(@table, @path)
    {:stop, reason, state}
  end

  def handle_call({:get_user, email}, _from, state) do
    users = :ets.tab2list(@table)
    value = case Enum.find(users, fn {_key, user} -> user.email == email end) do
      nil -> nil
      {_key, value} -> value
    end
    {:reply, value, state}
  end

  def handle_call({:get_user_by_id, id}, _from, state) do
    try do
      [{_key, value}] = :ets.lookup(@table, id)
      {:reply, value, state}
    rescue
      _ -> {:reply, nil, state}
    end
  end

  def handle_call({:search_coach_by_name, name}, _from, state) do
    all_users = :ets.tab2list(@table)
    matching_coaches =
      all_users
      |> Enum.map(fn {_key, user} -> User.format_user(user) end)
      |> Enum.filter(& &1.role == "coach" && Utils.equals_string(&1.lastname, name))

    {:reply, matching_coaches, state}
  end

  def handle_call({:create_user, data}, _from, state) do
    id = 
      :crypto.strong_rand_bytes(32)
      |> Base.url_encode64(padding: false)
      |> String.replace("/", "-")
      |> String.replace("+", "_")

    data = Map.put(data, :id, id)
    true = :ets.insert_new(@table, {data.id, data})
    Agenda.create_agenda(data.id)
    {:reply, data, state}
  end

  def handle_call({:edit_user, {id, data}}, _from, state) do
    [{_key, old_data}] = :ets.lookup(@table, id)
    new_data = Map.merge(old_data, data)
    res = :ets.insert(@table, {id, new_data})
    {:reply, res, state}
  end

  def handle_call({:delete_user, id}, _from, state) do
    res = :ets.delete(@table, id)
    {:reply, res, state}
  end

  def handle_call({:get_linked_users, user_id}, _from, state) do
    try do
      [{_key, user}] = :ets.lookup(@table, user_id)
      data =
        case user.role do
          "coach" ->
            get_coached_users(user[:id])
          _ ->
            get_coaching_users(user[:coaches])
        end
      {:reply, data, state}
    rescue
      e -> 
        Logger.warn("Error getting linked users: #{inspect(e)}")
        {:reply, nil, state}
    end
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

  def create_user(data) do
    all_users = :ets.tab2list(@table)
    email_already_used = Enum.find(all_users, fn {_key, user} -> user.email == data[:email] end)
    cond do
      !is_nil(email_already_used) ->
        :email_already_used
      !data[:email] || !data[:password] ->
        :error
      true ->
        salt = :rand.uniform() |> to_string |> Base.encode16()
        hashed_pwd = hash_password(data[:password], salt)
        updated_data =
          Map.put(data, :password, hashed_pwd)
          |> Map.put(:salt, salt)
          |> Map.delete(:password_check)
        GenServer.call(__MODULE__, {:create_user, updated_data})
    end
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

  def hash_password(password, salt) do
    :crypto.hash(:sha256, salt <> password)
    |> Base.encode16()
  end

  def format_user(nil), do: nil
  def format_user(user) do
      Map.take(user, [:firstname, :lastname, :email, :id, :role, :avatar, :coaches, :session_price, :price_id])
  end

  def get_coached_users(coach_id) do
    :ets.tab2list(@table)
    |> Enum.filter(fn {_key, user} ->
      Enum.member?(List.wrap(user[:coaches]), coach_id)
    end)
    |> Enum.map(fn {_key, user} ->
      User.format_user(user)
    end)
  end
  def get_coaching_users(coaches_id) do
    all_users = :ets.tab2list(@table)
    all_users
    |> Enum.filter(fn {_key, user} ->
      Enum.member?(coaches_id, user[:id])
    end)
    |> Enum.map(fn {_key, user} ->
      User.format_user(user)
    end)
  end

  def change_password(password, token) do    
    decoded_token = Base.decode64!(token, padding: false)
    @secret <> user_email = decoded_token
    user = User.get_all_user_info(user_email)
    hashed_password = hash_password(password, user.salt)
    User.edit_user(user.id, %{password: hashed_password})
  end

  def create_reset_hash(user_email) do
    Base.encode64(@secret <> user_email, padding: false)
  end
end

#  User.create_user(%{
#   email: "theodecagny@hotmail.fr",
#   firstname: "Theophile",
#   lastname: "de Cagny",
#   password: "azeUIRE$6823z9EZZ",
#   role: "coach",
#   coached_ids: [],
#   session_price: "50"
# })
