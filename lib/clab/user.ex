defmodule User do
  require Logger
  use GenServer
  @table :users
  @path 'data/users.ets'

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
    {_key, value} = users |> Enum.find(fn {_key, user} -> user.email == email end)
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

    matching_users =
      all_users
      |> Enum.filter(fn {_key, user} ->
        user.role == "coach" && Utils.equals_string(user.lastname, name)
      end)
      |> Enum.map(fn {_key, user} -> user |> User.format_user() end)

    {:reply, matching_users, state}
  end

  def handle_call({:create_user, data}, _from, state) do
    data =
      data
      |> put_in(
        [:id],
        :crypto.strong_rand_bytes(32)
        |> Base.url_encode64(padding: false)
        |> String.replace("/", "-")
        |> String.replace("+", "_")
      )

    true = :ets.insert_new(@table, {data.id, data})
    Agenda.create_agenda(data.id)
    {:reply, data, state}
  end

  def handle_call({:edit_user, {id, data}}, _from, state) do
    [{_key, old_data}] = :ets.lookup(@table, id)
    new_data = Map.merge(old_data, data)
    res = IO.inspect(:ets.insert(@table, {id, new_data}))
    {:reply, res, state}
  end

  def handle_call({:delete_user, id}, _from, state) do
    res = IO.inspect(:ets.delete(@table, id))
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

    email_already_used =
      !is_nil(all_users |> Enum.find(fn {_key, user} -> user.email == data[:email] end))

    cond do
      email_already_used ->
        :email_already_used

      !data[:email] || !data[:password] ->
        :error

      true ->
        salt = :rand.uniform() |> to_string |> Base.encode16()
        hashed_pwd = hash_password(data[:password], salt)

        updated_data =
          put_in(data, [:password], hashed_pwd)
          |> put_in([:salt], salt)
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
    :crypto.hash(:sha256, salt <> password) |> Base.encode16()
  end

  def create_coach_user() do
    User.create_user(%{
      email: "theodecagny@hotmail.fr",
      firstname: "Theophile",
      lastname: "de Cagny",
      password: "azeUIRE$6823z9EZZ",
      role: "coach"
    })
  end

  def format_user(user) do
    user |> Map.take([:firstname, :lastname, :email, :id, :role, :avatar])
  end

  def get_coached_users(coach_id) do
    all_users = :ets.tab2list(@table)
    Logger.info("looking for coached users  by #{coach_id} in user list")
    all_users
      |> Enum.filter(fn {_key, user} ->
        Enum.member?(List.wrap(user[:coaches]), coach_id)
      end)
      |> Enum.map(fn {_key, user} ->
         user |> User.format_user()
       end)    
  end
  def get_coaching_users(coaches_id) do
    all_users = :ets.tab2list(@table)
    all_users
      |> Enum.filter(fn {_key, user} ->
        Enum.member?(coaches_id, user[:id])
      end)
      |> Enum.map(fn {_key, user} ->
         user |> User.format_user()
       end)    
  end
end
