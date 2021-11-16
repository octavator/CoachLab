defmodule Schedule do
    use GenServer
    require Logger

    @table :schedules
    @path 'data/schedules.ets'

    def init(_args) do
        case File.exists?(@path) do
            true ->
                Logger.info("[ETS] Loading #{@table} from backup")
                {:ok, _ref} = :ets.file2tab(@path)
                Logger.info("[ETS] Success loading #{@table}")
            _ ->
                :ets.new(@table, [:named_table, :public])
        end
        Process.flag(:trap_exit, true)
        {:ok, %{}}
    end


    def start_link(_args) do
        GenServer.start(__MODULE__, [], name: __MODULE__)
    end

    def handle_info({:EXIT, _from, reason}, state) do
        Logger.info("[ETS] Saving #{@table} table in #{@path}")
        :ets.tab2file(@table, @path)
        {:stop, reason, state}
    end

    def reserve_new_slot(schedule_id, reservation_id) do
        :ets.insert(@table, {schedule_id, reservation_id})
    end

    def confirm_slot(_coach_id, _data) do
        true
    end

    def change_availability() do
        true
    end

    def check_availability() do
        true
    end

    def get_schedule_id(user_id, date) do
        user_id <> "!" <> date
    end
end
