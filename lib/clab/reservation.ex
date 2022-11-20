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

  def handle_call({:update_reservation, {id, data, user_id}}, _from, state) do
    [{_key, old_data}] = :ets.lookup(@table, id)
    res = if (user_id == old_data["coach_id"]) do
      :ets.insert(@table, {id, Map.merge(old_data, data)})
      Enum.each(List.wrap(data["coached_ids"]) -- List.wrap(old_data["coached_ids"]), 
       & Task.start( fn -> Reservation.send_payment_link(id, &1) end))
    else
      :error
    end
    {:reply, res, state}
  end

  def handle_call({:add_coached_id, {id, coached_id}}, _from, state) do
    [{_key, resa}] = :ets.lookup(@table, id)
    cond do
      Enum.member?(coached_id, resa["coached_ids"]) ->
        :error  
      true ->
        resa = update_in(resa, ["coached_ids"], &List.wrap(&1) ++ [coached_id])
        res = :ets.insert(@table, {id, resa})
        Agenda.update_agenda(coached_id, %{resa["id"] => resa["id"]})
        {:reply, res, state}  
    end
  end

  def handle_call({:confirm_payment, {id, coached_id}}, _from, state) do
    [{_key, resa}] = :ets.lookup(@table, id)
    resa = update_in(resa, ["paid"], &Enum.uniq(List.wrap(&1) ++ [coached_id]))
    :ets.insert(@table, {id, resa})
    {:reply, resa, state}
  end

  def handle_call({:cancel_resa, {id, coached_id}}, _from, state) do
    [{_key, resa}] = :ets.lookup(@table, id)
    resa = update_in(resa, ["coached_ids"], & Enum.reject(&1, fn id -> id == coached_id end))
    Agenda.update_agenda(coached_id, %{resa.id => nil})
    resa = if (length(resa[:coached_ids]) == 0) do
      Agenda.update_agenda(resa.coach_id, %{resa.id => nil})
      nil
    else
      resa
    end
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

  def update_reservation(id, data, user_id) do
    GenServer.call(__MODULE__, {:update_reservation, {id, data, user_id}})
  end

  def cancel_resa(id, coached_id) do
    GenServer.call(__MODULE__, {:cancel_resa, {id, coached_id}})
  end

  def add_coached_id(id, coached_id) do
    GenServer.call(__MODULE__, {:add_coached_id, {id, coached_id}})
  end
  def confirm_payment(id, coached_id) do
    GenServer.call(__MODULE__, {:confirm_payment, {id, coached_id}})
  end

  def clean_reservations() do
    :ets.tab2list(:reservations) |> Enum.each(fn {id, _reservation} -> 
      delete_reservation(id)
    end)
  end

  def get_date_from_id(id) do
    datetime_str = String.replace(List.first(String.split(id, "+")), " ", "T")
    year = List.first(String.split(Enum.at(String.split(datetime_str, "/"), 2), "T"))
    month = Enum.at(String.split(datetime_str, "/"), 1)
    day = Enum.at(String.split(datetime_str, "/"), 0)
    date = "#{year}-#{month}-#{day}"
    Timex.parse!("#{date}T#{List.last(String.split(datetime_str, "T"))}Z", "{ISO:Extended:Z}")
  end

  def send_payment_link(res_id, user_id) do
    resa = get_reservation(res_id)
    coach = User.get_user_by_id(resa["coach_id"])
    user = User.get_user_by_id(user_id)
    Clab.Mailer.send_payment_link(user, coach, resa)
  end
end
