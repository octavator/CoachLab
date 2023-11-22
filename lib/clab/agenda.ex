defmodule Agenda do
  use GenServer
  require Logger

  @table :agendas
  @path 'data/agendas.ets'

  def start_link(args \\ []) do
    GenServer.start_link(__MODULE__, args, name: __MODULE__)
  end

  def init(_args) do
    if File.exists?(@path) do
      Logger.info("[ETS] Loading #{@table} from backup")
      {:ok, _ref} = :ets.file2tab(@path)
      Logger.info("[ETS] Success loading #{@table}")
    else
      Logger.info("[ETS] Init #{@table} from scratch")
      :ets.new(@table, [:named_table, :public])
    end
    Process.flag(:trap_exit, true)
    {:ok, %{}}
  end

  def reserve_agendas(resa_id, coached_ids, payload) do
    try do
      coached_ids
      |> Enum.all?(& Agenda.update_agenda(&1, %{resa_id => resa_id}))
      |> if do
        coach = User.get_user_by_id(payload["coach_id"])
        Reservation.create_reservation(resa_id, Map.put(payload, "price", coach[:session_price] || "50"))
        Agenda.update_agenda(payload["coach_id"], %{resa_id => resa_id})
        :ok
      else
        Enum.each(coached_ids, & Reservation.cancel_resa(resa_id, &1))
        :error
      end
    rescue
      e ->
        Logger.error("[RESERVATION] Error during creation of reservation  #{resa_id}: #{inspect(e)}")
        :unknown_error
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

  def handle_call({:get_agenda, user_id}, _from, state) do
    [{_key, value}]  = :ets.lookup(@table, user_id)
    {:reply, value, state}
  end

  def handle_call({:create_agenda, user_id}, _from, state) do
    res = :ets.insert_new(@table, {user_id, %{}})
    {:reply, res, state}
  end

  def handle_call({:update_agenda, {user_id, data}}, _from, state) do
    [{_key, old_data}] = :ets.lookup(@table, user_id)
    new_data = Map.merge(old_data, data)
    res = :ets.insert(@table, {user_id, new_data})
    {:reply, res, state}
  end

  def handle_call({:delete_agenda, user_id}, _from, state) do
    res = :ets.insert(@table, {user_id, %{}})
    {:reply, res, state}
  end

  def get_agenda(user_id) do
    GenServer.call(__MODULE__, {:get_agenda, user_id})
  end

  def create_agenda(data) do
    GenServer.call(__MODULE__, {:create_agenda, data})
  end

  def delete_agenda(user_id) do
    GenServer.call(__MODULE__, {:delete_agenda, user_id})
  end

  def update_agenda(user_id, data) do
    GenServer.call(__MODULE__, {:update_agenda, {user_id, data}})
  end

  def clean_agendas() do
    @table
    |> :ets.tab2list()
    |> Enum.each(fn {user_id, _agenda} ->
      delete_agenda(user_id)
    end)
  end
end
