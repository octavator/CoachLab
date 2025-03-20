defmodule AutoMailer do
  use GenServer
  require Logger

  @ticking_interval 1000 * 60 * 1 # 15 minutes

  def start_link(args \\ []) do
    GenServer.start_link(__MODULE__, args, name: __MODULE__)
  end

  def init(_args) do
    Process.send_after(__MODULE__, :tick, @ticking_interval)
    {:ok, %{}}
  end

  def handle_info(:tick, state) do
    Logger.info("Auto Mailer ticking")
    if (rem(Timex.now().minute, 15) == 0) do
      Logger.info("Auto Mailer in progress")
      send_payment_reminders()
    end

    Process.send_after(__MODULE__, :tick, @ticking_interval)
    {:noreply, state}
  end

  def send_payment_reminders() do
    #@TODO: Not opti to go through every reservations every 15min, once we can search by date / time do it
    :reservations
    |> :ets.tab2list()
    |> Enum.map(fn {_k, resa} ->
      nb_of_payments =
        resa[:paid]
        |> List.wrap()
        |> Enum.count()

      nb_of_coached =
        resa[:coached_ids]
        |> List.wrap()
        |> Enum.count()

      if nb_of_payments != nb_of_coached do
        date = Reservation.get_date_from_id(resa[:id])
        reminder_date =
          Timex.now("Europe/Paris")
          |> Timex.shift(days: 3)
          |> Timex.set([seconds: 0, milliseconds: 0, microseconds: 0])

        if Timex.compare(date, reminder_date) == 0 do
          Logger.info("Sending reminder for #{resa[:id]}")
          Enum.each(resa[:coached_ids] -- resa[:paid], fn user_id ->
            user = User.get_user_by_id(user_id)
            coach = User.get_user_by_id(resa[:coach_id])
            Clab.Mailer.send_payment_link(user, coach, resa)
          end)
        end
      end
    end)
  end
end
