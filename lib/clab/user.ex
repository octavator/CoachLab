defmodule User do
    require Logger
    use GenServer
    @table :users
    @path 'data/users.ets'
    @secret "Jazektkowxppzeâpzepo%32*$ezwxnza"

    def start_link(args \\ []) do
        GenServer.start(__MODULE__, args, name: __MODULE__)
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
            User.create_user(%{email: "theodecagny@hotmail.fr", id: "1", firstname: "Theophile", lastname: "de Cagny", password: "toto", role: "coach"})
        end)
        {:ok, %{}}
    end

    def handle_info({:EXIT, _from, reason}, state) do
        Logger.info("[ETS] Saving #{@table} table in #{@path}")
        :ets.tab2file(@table, @path)
        {:stop, reason, state}
    end

    def handle_call({:get_user, email}, _from, state) do
        [{_key, value}]  = :ets.lookup(@table, email)
        {:reply, value, state}
    end

    def handle_call({:create_user, data}, _from, state) do
        res = :ets.insert_new(@table, {data.email, data})
        {:reply, res, state}
    end

    def handle_call({:edit_user, {email, data}}, _from, state) do
        [{_key, old_data}]  = :ets.lookup(@table, email)
        new_data = Map.merge(old_data, data)
        res = IO.inspect :ets.insert(@table, {email, new_data})
        {:reply, res, state}
    end

    def handle_call({:delete_user, email}, _from, state) do
        res = IO.inspect :ets.delete(@table, email)
        {:reply, res, state}
    end

    def get_user(email) do
        GenServer.call(__MODULE__, {:get_user, email})
    end

    def create_user(data) do
        if !data[:email] || !data[:password] do
            :error
        else
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
