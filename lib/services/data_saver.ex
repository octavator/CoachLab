defmodule DataSaver do
  require Logger
  use GenServer
  @backup_path 'data/backup/'
  @backup_interval 1 #hours
  @backup_days 30 #after that we delete backups
  @tables [:users, :agendas, :reservations]

  def start_link(args \\ []) do
    GenServer.start_link(__MODULE__, args, name: __MODULE__)
  end

  def init(_args) do
    File.mkdir_p(@backup_path)
    Process.send_after(__MODULE__, :tick, 1000 * 60 * 60 * @backup_interval)
    {:ok, %{}}
  end

  def handle_info(:tick, state) do
    Logger.info("[ETS] Data Backup now in progress")
    backup(@tables)
    clean_backups()
    Logger.info("[ETS] Data Backup successful")

    Process.send_after(__MODULE__, :tick, 1000 * 60 * 60 * @backup_interval)
    {:noreply, state}
  end

  def backup(tables) do
    Enum.each(tables, fn table ->
      date_string =
        DateTime.utc_now()
        |> DateTime.to_string
        |> String.split(".")
        |> List.first()
        |> String.replace(" ", "_")
        |> String.replace(":", "")

      filepath = '#{@backup_path}#{to_charlist(table)}_#{to_charlist(date_string)}.ets'
      Logger.info("[ETS] Saving #{table} table in #{filepath}")
      :ets.tab2file(table, filepath)
    end)
  end

  def clean_backups() do
    @backup_path
    |> File.ls!()
    |> Enum.each(fn file ->
      today = DateTime.to_date(DateTime.utc_now)
      [year, month, day] =
        file
        |> String.split("_")
        |> Enum.at(1)
        |> String.split("-")
        |> Enum.map(& String.to_integer/1)

      target_date = Date.new!(year, month, day) |> Date.add(@backup_days)

      if Date.compare(today, target_date) == :gt do
        Logger.info("[ETS] Cleaning outdated archive #{file}")
        File.rm('#{@backup_path}#{file}')
      end
    end)
  end
end
