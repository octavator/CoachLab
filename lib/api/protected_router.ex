defmodule Clab.ProtectedRouter do
  use Plug.Router
  use Timex

  plug :match
  plug :dispatch

  #@TODO: possible de split ce router en plusieurs sous routers plus spécialisés

  get "/api/me" do
    user_data =
      conn.assigns[:user]
      |> Map.take([
        :role,
        :phone,
        :lastname,
        :firstname,
        :id,
        :email,
        :avatar,
        :session_price
      ])

    send_resp(conn, 200, Poison.encode!(user_data))
  end

  get "/api/me/agenda" do
    user = conn.assigns[:user]
    agenda = Agenda.get_agenda(user.id)
    data = %{agenda: agenda, user: user}
    send_resp(conn, 200,  Poison.encode!(data))
  end

  get "/payment_success" do
    user = conn.assigns[:user]
    resa_id = conn.query_params["id"] |> URI.decode()
    Reservation.confirm_payment(resa_id, user.id)
    data = Utils.get_html_template("payment_success")
    send_resp(conn, 200, data)
  end

  get "/api/coach/agenda/:target_id" do
    user = conn.assigns[:user]
    agenda = Agenda.get_agenda(target_id)
    data = %{agenda: agenda, user: user}
    send_resp(conn, 200, Poison.encode!(data))
  end

  get "/api/reservation/:resa_id" do
    user = conn.assigns[:user]
    reservation = Reservation.get_reservation(resa_id)

    reservation =
      if user.id == reservation[:coach_id] do
        reservation
      else
        coached_ids =
          reservation[:coached_ids]
          |> List.wrap()
          |> Enum.filter(&(&1 == user.id))

        reservation
        |> Map.take([
          :isMulti,
          :isVideo,
          :id,
          :coach_id,
          :coach_name,
          :duration,
          :sessionTitle,
          :paid,
          :address
        ])
        |> Map.put(:coached_ids, coached_ids)
      end

    send_resp(conn, 200, Poison.encode!(reservation))
  end

  get "/api/payment_link/:resa_id" do
    resa_id = URI.decode(resa_id)
    user = conn.assigns[:user]

    payment_link =
      resa_id
      |> Reservation.get_reservation()
      |> Access.get(:price_id)
      |> Stripe.create_payment_link(user.id, resa_id)

    send_resp(conn, 200, Poison.encode!(payment_link))
  end

  get "/logout" do
    conn = put_resp_cookie(conn, "cltoken", "disconnected", same_site: "Strict")
    send_resp(conn, 200, "Vous avez été déconnecté")
  end

  get "/agenda" do
    data = Utils.get_html_template("agenda")
    send_resp(conn, 200, data)
  end

  get "/mes_coaches" do
    data = Utils.get_html_template("my_coaches")
    send_resp(conn, 200, data)
  end

  get "/mes_sessions" do
    data = Utils.get_html_template("my_sessions")
    send_resp(conn, 200, data)
  end

  get "/api/linked_users" do
    user = conn.assigns[:user]
    users = User.get_linked_users(user.id)
    send_resp(conn, 200, Poison.encode!(users))
  end

  get "/bienvenue" do
    data = Utils.get_html_template("temp-welcome-page")
    send_resp(conn, 200, data)
  end

  get "/profil" do
    data = Utils.get_html_template("profile")
    send_resp(conn, 200, data)
  end

  get "/infos" do
    data = Utils.get_html_template("user_infos")
    send_resp(conn, 200, data)
  end


  get "/coach/search" do
    users =
      conn.query_params["coach_name"]
      |> URI.decode()
      |> User.search_coach_by_name()

    send_resp(conn, 200, Poison.encode!(users))
  end

  get "/users/search" do
    user_name =
      conn.query_params["user_name"]
      |> URI.decode()

    users =
      conn.query_params["coach_id"]
      |> URI.decode()
      |> User.get_coached_users()
      |> Enum.filter(&Utils.contains_string("#{&1[:firstname]} #{&1[:lastname]}", user_name))

    send_resp(conn, 200, Poison.encode!(users))
  end

  get "/video" do
    data = Utils.get_html_template("video")
    send_resp(conn, 200, data)
  end

  get "/video-token" do
    user = conn.assigns[:user]
    res_id =
      conn.query_params["roomId"]
      |> URI.decode()
      |> String.replace(":00 ", ":00+")
    resa = Reservation.get_reservation(res_id)
    dt = Reservation.get_date_from_id(res_id)


    time_diff =
      Timex.now("Europe/Paris")
      |> Timex.diff(dt, :minutes)

    cond do
      time_diff > 90 ->
        send_resp(conn, 403, "La séance est terminée.")

      time_diff < -15 ->
        send_resp(
          conn,
          403,
          "La séance n'est pas encore accessible. Vous pourrez y accéder 15 minutes avant."
        )

      user.id == resa[:coach_id] ->
        Twilio.create_room(resa)
        token = Jwt.create_twilio_token(user)
        send_resp(conn, 200, token)

      Enum.member?(List.wrap(resa[:paid]), user.id) ->
        token = Jwt.create_twilio_token(user)
        send_resp(conn, 200, token)

      true ->
        send_resp(conn, 403, "Vous n'avez pas payé pour cette séance")
    end
  end

  post "/new_coach" do
    body = conn.body_params
    user =
      conn.assigns[:user]
      |> Map.update(:coaches, [body.coach_id], &Enum.uniq([body.coach_id | &1]))

    case User.edit_user(user.id, user) do
      :error ->
        send_resp(conn, 400, "Erreur durant le changement de vos informations.")

      _ ->
        send_resp(conn, 200, "Vos informations ont été mis à jour.")
    end

  end

  post "/edit-infos" do
    body = conn.body_params
    user = conn.assigns[:user]

    if body[:session_price] && body[:session_price] != user[:session_price] do
      Map.put(user, :session_price, body.session_price)
    end

    #@TODO: map.take
    case User.edit_user(user.id, body) do
      :error ->
        send_resp(conn, 400, "Erreur durant le changement de vos informations.")

      _ ->
        send_resp(conn, 200, "Vos informations ont été mis à jour.")
    end
  end

  post "/api/new-resa" do
    body = conn.body_params
    coach = User.get_user_by_id(body.user_id)

    #@TODO: map.take
    payload =
      Map.merge(body.resa, %{
        coach_id: coach.id,
        coach_avatar: coach[:avatar],
        coach_name: "#{coach.firstname} #{coach.lastname}"
      })

    Agenda.reserve_agendas(payload[:id], payload[:coached_ids], payload)
    |> case do
      :ok ->
        payload[:coached_ids]
        |> List.wrap()
        |> Enum.each(&Reservation.send_payment_link(payload[:id], &1))

        send_resp(conn, 200, "Votre rendez-vous a bien été enregistré.")

      _ ->
        send_resp(conn, 500, "Une erreur inattendue est survenue durant la reservation.")
    end
  end

  post "/api/update-resa" do
    body = conn.body_params
    user = conn.assigns[:user]
    #@TODO: besoin d'une fonction format resa ?
    payload = %{
      id: body.id,
      sessionTitle: body.sessionTitle,
      address: body.address,
      coached_ids: body.coached_ids
    }

    body.id
    |> Reservation.update_reservation(payload, user.id)
    |> case do
      :error ->
        send_resp(conn, 403, "Vous n'avez pas l'autorisation de modifier cette reservation.")

      _ ->
        send_resp(conn, 200, "RDV mis à jour.")
    end
  end

  post "/signup-invite" do
    body = conn.body_params
    coach = conn.assigns[:user]

    Clab.Mailer.send_invitation_mails([body.email], coach)

    send_resp(conn, 200, "OK")
  end

  get "/api/user/:user_id" do
    user = User.get_user_by_id(user_id)
    send_resp(conn, 200, Poison.encode!(user))
  end

  get "/facture" do
    data = Utils.get_html_template("invoice")
    send_resp(conn, 200, data)
  end

  post "/api/change_password" do
    body = conn.body_params
    User.change_password(body.password, body.token)
    send_resp(conn, 200, "OK")
  end

  match _ do
    send_resp(conn, 404, "Erreur 404: page introuvable")
  end
end
