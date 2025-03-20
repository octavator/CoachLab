defmodule Reservation do
  use GenServer
  require Logger

  @table :reservations
  @path ~c"data/reservations.ets"

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

  def handle_call({:update_reservation, {id, data, user_id}}, _from, state) do
    [{_key, old_data}] = :ets.lookup(@table, id)
    res =
      if (user_id == old_data["coach_id"]) do
        :ets.insert(@table, {id, Map.merge(old_data, data)})
        new_coached_ids = List.wrap(data["coached_ids"]) -- List.wrap(old_data["coached_ids"])
        Enum.each(new_coached_ids, & Task.start( fn -> Reservation.send_payment_link(id, &1) end))
      else
        :error
      end
    {:reply, res, state}
  end

  def handle_call({:confirm_payment, {id, coached_id}}, _from, state) do
    [{_key, resa}] = :ets.lookup(@table, id)
    if !Enum.member?(resa["paid"], coached_id), do: Clab.Mailer.send_invoice(coached_id, resa)
    resa = Map.update(resa, "paid", [coached_id], &Enum.uniq(&1 ++ [coached_id]))
    :ets.insert(@table, {id, resa})
    {:reply, resa, state}
  end

  def handle_call({:cancel_resa, {id, coached_id}}, _from, state) do
    [{_key, resa}] = :ets.lookup(@table, id)
    resa = Map.update(resa, "coached_ids", [], & Enum.reject(&1, fn id -> id == coached_id end))
    resa =
      if Enum.empty?(resa["coached_ids"]) do
        Agenda.update_agenda(resa["coach_id"], %{resa["id"] => nil})
        nil
      else
        resa
      end

    Agenda.update_agenda(coached_id, %{resa.id => nil})
    res = :ets.insert(@table, {id, resa})
    {:reply, res, state}
  end

  def handle_call({:get_reservation, id}, _from, state) do
    [{_key, value}]  = :ets.lookup(@table, id)
    {:reply, value, state}
  end

  def handle_call({:create_reservation, {id, data}}, _from, state) do
    res = :ets.insert_new(@table, {id, data})
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

  def terminate(_reason, _state) do
    Logger.info("[ETS] Saving #{@table} table in #{@path}")
    :ets.tab2file(@table, @path)
  end

  def handle_info({:EXIT, _from, reason}, state) do
    Logger.info("[ETS] Saving #{@table} table in #{@path}")
    :ets.tab2file(@table, @path)
    {:stop, reason, state}
  end

  def clean_reservations() do
    :ets.delete_all_objects(@table)
  end

  def get_date_from_id(id) do
    #@TODO: use Timex module or Date or smthg, this is shit
    datetime_str = String.replace(List.first(String.split(id, "+")), " ", "T")
    year = List.first(String.split(Enum.at(String.split(datetime_str, "/"), 2), "T"))
    month = Enum.at(String.split(datetime_str, "/"), 1)
    day = Enum.at(String.split(datetime_str, "/"), 0)
    date = "#{year}-#{month}-#{day}"
    Timex.parse!("#{date}T#{List.last(String.split(datetime_str, "T"))}Z", "{ISO:Extended:Z}")
  end

  def send_payment_link(resa_id, user_id) do
    resa = Reservation.get_reservation(resa_id)
    coach = User.get_user_by_id(resa["coach_id"])
    user = User.get_user_by_id(user_id)
    Clab.Mailer.send_payment_link(user, coach, resa)
  end

  def get_price(resa, coach) do
    resa["price"] || coach[:session_price]
  end
end
