defmodule DataSaver do
  require Logger
  use GenServer
  @backup_path 'data/backup/'
  @backup_interval 1 #hours
  @backup_days 30 #after that we delete backups

  def start_link(args \\ []) do
    GenServer.start_link(__MODULE__, args, name: __MODULE__)
  end

  def init(_args) do
    Process.send_after(__MODULE__, :tick, 1000 * 60 * 60 * @backup_interval)
    {:ok, %{}}
  end

  def handle_info(:tick, state) do
    Logger.info("[ETS] Data Backup now in progress")
    tables = [:users, :agendas]
    backup(tables)
    clean_backups()
    Process.send_after(__MODULE__, :tick, 1000 * 60 * 60 * @backup_interval)
    {:noreply, state}
  end

  def backup(tables) do
    Enum.each(tables, fn table ->
      date = DateTime.utc_now()
      date_string = 
       date
       |> DateTime.to_string
       |> String.split(".")
       |> List.first
       |> String.replace(" ", "_")
       |> String.replace(":", "")

      filepath = '#{@backup_path}#{to_charlist(table)}_#{to_charlist(date_string)}.ets'
      Logger.info("[ETS] Saving #{table} table in #{filepath}")
      :ets.tab2file(table, filepath)
    end)
  end

  def clean_backups() do
    files = File.ls!(@backup_path)
    Enum.each(files, fn file ->
      today = DateTime.to_date(DateTime.utc_now) 
      date_string = 
        file
        |> String.split("_")
        |> Enum.at(1)
      year = date_string |> String.split("-") |> Enum.at(0) |> String.to_integer
      month = date_string |> String.split("-") |> Enum.at(1) |> String.to_integer
      day = date_string |> String.split("-") |> Enum.at(2) |> String.to_integer
      target_date = Date.new!(year, month, day) |> Date.add(@backup_days)

      if Date.compare(target_date, today) == :lt do
        Logger.info("[ETS] Cleaning outdated archive #{file}")
        IO.inspect(File.rm('#{@backup_path}#{file}'))
      end
    end)
  end
end
