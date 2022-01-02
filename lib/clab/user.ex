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
        Task.start(fn ->
            :timer.sleep(1000)
            User.create_user(%{email: "theodecagny@hotmail.fr", firstname: "Theophile", lastname: "de Cagny", password: "toto", role: "coach"})
        end)
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
        [{_key, value}] = :ets.lookup(@table, id)
        {:reply, value, state}
    end

    def handle_call({:create_user, data}, _from, state) do
        data = data |> put_in([:id], :crypto.strong_rand_bytes(32) |> Base.url_encode64(padding: false))
        res = :ets.insert_new(@table, {data.id, data})
        Agenda.create_agenda(data.id)
        {:reply, res, state}
    end

    def handle_call({:edit_user, {id, data}}, _from, state) do
        [{_key, old_data}]  = :ets.lookup(@table, id)
        new_data = Map.merge(old_data, data)
        res = IO.inspect :ets.insert(@table, {id, new_data})
        {:reply, res, state}
    end

    def handle_call({:delete_user, id}, _from, state) do
        res = IO.inspect :ets.delete(@table, id)
        {:reply, res, state}
    end

    def terminate(_reason, _state) do
        Logger.info("[ETS] Saving #{@table} table in #{@path}")
        :ets.tab2file(@table, @path)
    end

    def get_user(email) do
        GenServer.call(__MODULE__, {:get_user, email})
    end

    def get_user_by_id(id) do
        GenServer.call(__MODULE__, {:get_user_by_id, id})
    end

    def create_user(data) do
        all_users = :ets.tab2list(@table)
        email_already_used = !is_nil((all_users |> Enum.find(fn {_key, user} -> user.email == data[:email] end)))
        cond do
            email_already_used -> :email_already_used
            !data[:email] || !data[:password] -> :error
            true ->
                salt = :rand.uniform() |> to_string |> Base.encode16
                hashed_pwd = hash_password(data[:password], salt)
                updated_data = put_in(data, [:password], hashed_pwd)
                updated_data = put_in(updated_data, [:salt], salt)
                GenServer.call(__MODULE__, {:create_user, updated_data})
        end
    end

    def delete_user(email) do
        GenServer.call(__MODULE__, {:delete_user, email})
    end

    def edit_user(email, data) do
        GenServer.call(__MODULE__, {:edit_user, {email, data}})
    end

    def hash_password(password, salt) do
        :crypto.hash(:sha256, salt <> password) |> Base.encode16
    end
end
