defmodule DataSaver do
  require Logger
  use GenServer
  @backup_path 'data/backup/'
  @backup_interval 4 #hours

  def start_link(args \\ []) do
    GenServer.start(__MODULE__, args, name: __MODULE__)
  end

  def init(_args) do
    Process.send_after(__MODULE__, :backup_tables, 1000 * 60 * 60 * @backup_interval)
    {:ok, %{}}
  end

  def handle_info(:backup_tables, state) do
    Logger.info("[ETS] Data Backup now in progress")
    tables = [:users, :agendas]
    tables |> Enum.each(fn table ->
      date = DateTime.utc_now()
      date_string = String.replace(DateTime.to_string(date), " ", "_")
       |> String.replace(":", "")
       |> String.split(".")
       |> hd()
      filepath = @backup_path ++ '#{to_charlist(table)}_#{to_charlist(date_string)}.ets'
      Logger.info("[ETS] Saving #{table} table in #{filepath}")
      :ets.tab2file(table, filepath)
    end)
    Process.send_after(__MODULE__, :backup_tables, 1000 * 60 * 60 * @backup_interval)
    {:noreply, state}
  end
end
