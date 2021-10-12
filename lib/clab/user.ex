defmodule Clab.User do
    use GenServer
    @table :user_table
    
    def start_link(name \\ __MODULE__, args \\ []) do
        IO.inspect name
        IO.inspect args
        GenServer.start_link(name, args, name: name)
    end

    def init(_args) do
        :ets.new(@table, [:named_table, :public])
        {:ok, %{name: @table}}
    end

    def handle_call({:get_user, email}, _from, state) do
        [{_key, value}]  = IO.inspect :ets.lookup(@table, email)
        {:reply, value, state}
    end

    def handle_call({:create_user, data}, _from, state) do
        res = IO.inspect :ets.insert_new(@table, {data.email, data})
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
        GenServer.call(__MODULE__, {:create_user, data})
    end

    def delete_user(email) do
        GenServer.call(__MODULE__, {:delete_user, email})
    end
end
#Clab.User.create_user(%{email: "john.doe@mail.com", id: "1", firstname: "John", lastname: "Doe"})