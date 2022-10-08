defmodule Reservation do
    require Logger
    use GenServer
    @table :reservations
    @path 'data/reservations.ets'

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

    def terminate(_reason, _state) do
      Logger.info("[ETS] Saving #{@table} table in #{@path}")
      :ets.tab2file(@table, @path)
    end

    def handle_info({:EXIT, _from, reason}, state) do
      Logger.info("[ETS] Saving #{@table} table in #{@path}")
      :ets.tab2file(@table, @path)
      {:stop, reason, state}
    end

    def handle_call({:get_reservation, res_id}, _from, state) do
      [{_key, value}]  = :ets.lookup(@table, res_id)
      {:reply, value, state}
    end

    def handle_call({:create_reservation, {id, data}}, _from, state) do
      res = :ets.insert_new(@table, {id, data})
      {:reply, res, state}
    end

    def handle_call({:update_reservation, {id, data}}, _from, state) do
      [{_key, old_data}] = :ets.lookup(@table, id)
      new_data = Map.merge(old_data, data)
      IO.inspect(new_data, label: "new_data")
      res = :ets.insert(@table, {id, new_data})
      {:reply, res, state}
    end

    def handle_call({:add_coached_id, {id, coached_id}}, _from, state) do
      [{_key, resa}] = :ets.lookup(@table, id)
      resa = update_in(resa[:coached_ids], & [&1 | coached_id])
      res = :ets.insert(@table, {id, resa})
      {:reply, res, state}
    end

    def handle_call({:delete_reservation, id}, _from, state) do
      res = :ets.delete(@table, id)
      {:reply, res, state}
    end

    def get_reservation(id) do
      GenServer.call(__MODULE__, {:get_reservation, id})
    end

    def create_reservation(id, data) do
      GenServer.call(__MODULE__, {:create_reservation, {id, data}})
    end

    def delete_reservation(id) do
      GenServer.call(__MODULE__, {:delete_reservation, id})
    end

    def update_reservation(id, data) do
      GenServer.call(__MODULE__, {:update_reservation, {id, data}})
    end

    def add_coached_id(id, coached_id) do
      GenServer.call(__MODULE__, {:add_coached_id, {id, coached_id}})
    end

    def clean_reservations() do
      :ets.tab2list(:reservations) |> Enum.each(fn {id, _reservation} -> 
        delete_reservation(id)
      end)
    end
end
