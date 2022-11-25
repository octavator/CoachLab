defmodule AutoMailer do
  require Logger
  use GenServer

  @backup_interval 1000 * 60 * 1 # 15 minutes

  def start_link(args \\ []) do
    GenServer.start_link(__MODULE__, args, name: __MODULE__)
  end

  def init(_args) do
    Process.send_after(__MODULE__, :tick, @backup_interval)
    {:ok, %{}}
  end

  def handle_info(:tick, state) do
    if (rem(Timex.now().minute, 15) == 0) do 
      Logger.info("Auto Mailer in progress")
      send_payment_reminder()
    end
    Process.send_after(__MODULE__, :tick, @backup_interval)
    {:noreply, state}
  end

  def send_payment_reminder() do 
    :ets.tab2list(:reservations)
    |> Enum.map(fn {_k, resa} ->
      if length(List.wrap(resa["paid"])) != length(List.wrap(resa["coached_ids"])) do
        date = Reservation.get_date_from_id(resa["id"])
        reminder_date = Timex.set(Timex.shift(Timex.now("Europe/Paris"), hours: 72), [seconds: 0, milliseconds: 0, microseconds: 0])
        if Timex.compare(date, reminder_date) == 0 do
          Logger.info("Sending reminder for " <> resa["id"])
          Enum.each(resa["coached_ids"] -- resa["paid"], fn user_id ->
            user = User.get_user_by_id(user_id)
            coach = User.get_user_by_id(resa["coach_id"])
            Clab.Mailer.send_payment_link(user, coach, resa)
          end)
        end
      end
    end)
  end
end
