defmodule Clab do
  def shutdown do
    :init.stop()
  end
end

defmodule ClabRouter do
  use Plug.Router
  plug(Plug.Logger)
  require Logger
  use Timex
  # use Plug.Debugger

  @secret "73JIOiOJSKLAZHOJfspaioz9902"

  # @TODO
  # plug Plug.SSL
  plug(Plug.Static, from: :clab, at: "/priv/static")
  plug(:match)

  plug(Plug.Parsers,
    parsers: [
      :json,
      :urlencoded,
      {:multipart, length: Application.compile_env(:clab, :max_upload_file_size, 3_000_000)}
    ],
    json_decoder: {Poison, :decode!, [[keys: :atoms!]]}
    # json_decoder: {Poison, :decode!, [[keys: :atoms]]}
  )

  plug(:dispatch)

  # @TODO: replace auth checks with a custom plug
  # @TODO: add expiration to token (1 month ?)
  # @TODO: auto delete of very old tmp_files

  def build_token(id) do
    (id <> "|" <> :crypto.hash(:sha256, @secret <> id))
    |> Base.encode64(padding: false)
  end

  def check_token_user(conn) do
    conn = fetch_cookies(conn)
    cookie = conn.cookies["cltoken"]

    cond do
      !is_nil(conn.cookies["CLABPOWAAA"]) ->
        conn.cookies["CLABPOWAAA"]

      cookie && cookie == build_token(get_user_from_token(cookie)) ->
        get_user_from_token(cookie)

      true ->
        nil
    end
  end

  def get_user_from_token(cookie) do
    case cookie do
      nil ->
        nil

      cookie ->
        cookie
        |> Base.decode64!(padding: false)
        |> String.split("|")
        |> List.first()
    end
  end

  #@TODO: use smthg like MyAPI.UserPlug.call(conn, [])

  get "/" do
    data = Utils.get_html_template("landing")
    send_resp(conn, 200, data)
  end

  get "/api/me" do
    id = check_token_user(conn)

    if !is_nil(id) do
      user = User.get_user_by_id(id)

      if !is_nil(user) do
        user_data =
          user
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
          |> Poison.encode!()

        send_resp(conn, 200, user_data)
      else
        send_resp(conn, 401, "Utilisateur inconnu")
      end
    else
      send_resp(conn, 401, "Token invalide")
    end
  end

  get "/api/me/agenda" do
    id = check_token_user(conn)

    if !is_nil(id) do
      user = User.get_user_by_id(id)
      agenda = Agenda.get_agenda(user.id)
      data = %{agenda: agenda, user: user} |> Poison.encode!()
      send_resp(conn, 200, data)
    else
      send_resp(conn, 401, "Token invalide")
    end
  end

  get "/payment_success" do
    id = check_token_user(conn)

    if !is_nil(id) do
      resa_id = conn.query_params["id"] |> URI.decode()
      Reservation.confirm_payment(resa_id, id)
      data = Utils.get_html_template("payment_success")
      send_resp(conn, 200, data)
    else
      send_resp(conn, 401, "Token invalide")
    end
  end

  get "/api/coach/agenda/:target_id" do
    id = check_token_user(conn)

    if !is_nil(id) do
      agenda = Agenda.get_agenda(target_id)
      user = User.get_user_by_id(target_id)
      data = %{agenda: agenda, user: user} |> Poison.encode!()
      send_resp(conn, 200, data)
    else
      send_resp(conn, 401, "Token invalide")
    end
  end

  get "/api/reservation/:resa_id" do
    id = check_token_user(conn)

    if !is_nil(id) do
      user = User.get_user_by_id(id)
      reservation = Reservation.get_reservation(resa_id)

      reservation =
        if user.id == reservation[:coach_id] do
          reservation
        else
          coached_ids =
            reservation[:coached_ids]
            |> List.wrap()
            |> Enum.filter(&(&1 == id))

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
        |> Poison.encode!()

      send_resp(conn, 200, reservation)
    else
      send_resp(conn, 401, "Token invalide")
    end
  end

  get "/api/payment_link/:resa_id" do
    id = check_token_user(conn)

    if !is_nil(id) do
      resa_id = resa_id |> URI.decode()

      payment_link =
        resa_id
        |> Reservation.get_reservation()
        |> Access.get(:price_id)
        |> Stripe.create_payment_link(id, resa_id)
        |> Poison.encode!()

      send_resp(conn, 200, payment_link)
    else
      send_resp(conn, 401, "Token invalide")
    end
  end

  post "/sign-in" do
    body = conn.body_params |> Map.new(fn {k, v} -> {String.to_atom(k), v} end)

    body.email
    |> User.get_all_user_info()
    |> case do
      nil ->
        send_resp(conn, 401, "Adresse mail inconnue")

      user ->
        hashed_input = User.hash_password(body.password, user.salt)

        if hashed_input == user.password do
          token = build_token(user.id)
          conn = put_resp_cookie(conn, "cltoken", token, same_site: "Strict")

          user_data =
            user
            |> Map.delete(:salt)
            |> Map.delete(:password)
            |> Poison.encode!()

          send_resp(conn, 200, user_data)
        else
          send_resp(conn, 401, "Votre mot de passe est incorrect")
        end
    end
  end

  get "/logout" do
    conn = put_resp_cookie(conn, "cltoken", "disconnected", same_site: "Strict")
    send_resp(conn, 200, "Vous avez été déconnecté")
  end

  get "/agenda" do
    id = check_token_user(conn)

    if !is_nil(id) do
      data = Utils.get_html_template("agenda")
      send_resp(conn, 200, data)
    else
      send_resp(conn, 401, "Token invalide")
    end
  end

  get "/mes_coaches" do
    id = check_token_user(conn)

    if !is_nil(id) do
      data = Utils.get_html_template("my_coaches")
      send_resp(conn, 200, data)
    else
      send_resp(conn, 401, "Token invalide")
    end
  end

  get "/mes_sessions" do
    id = check_token_user(conn)

    if !is_nil(id) do
      data = Utils.get_html_template("my_sessions")
      send_resp(conn, 200, data)
    else
      send_resp(conn, 401, "Token invalide")
    end
  end

  get "/api/linked_users" do
    id = check_token_user(conn)

    if !is_nil(id) do
      users = User.get_linked_users(id)

      if is_nil(users) do
        send_resp(conn, 500, "Une erreur inattendue est survenue")
      else
        send_resp(conn, 200, users |> Poison.encode!())
      end
    else
      send_resp(conn, 401, "Token invalide")
    end
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

  get "/connexion" do
    data = Utils.get_html_template("login")
    send_resp(conn, 200, data)
  end

  get "/inscription" do
    data = Utils.get_html_template("new-signup")
    send_resp(conn, 200, data)
  end

  post "/inscription/file" do
    body = conn.body_params |> Map.new(fn {k, v} -> {String.to_atom(k), v} end)
    filename = body.myFile.filename
    path = Path.expand(body.myFile.path, __DIR__)
    true = Utils.test_file_type(path, filename)
    Logger.debug("Writing uploaded file to data/tmp_files/#{filename}")
    File.write!("data/tmp_files/#{filename}", File.read!(path))
    send_resp(conn, 200, "ok")
  end

  get "/coach/search" do
    users =
      conn.query_params["coach_name"]
      |> URI.decode()
      |> User.search_coach_by_name()
      |> Poison.encode!()

    send_resp(conn, 200, users)
  end

  get "/users/search" do
    user_name = conn.query_params["user_name"] |> URI.decode()

    users =
      conn.query_params["coach_id"]
      |> URI.decode()
      |> User.get_coached_users()
      |> Enum.filter(&Utils.contains_string("#{&1[:firstname]} #{&1[:lastname]}", user_name))
      |> Poison.encode!()

    send_resp(conn, 200, users)
  end

  post "/sign-up" do
    body = conn.body_params |> Map.new(fn {k, v} -> {String.to_atom(k), v} end)

    {conn, status_code, ret_text} =
      case User.create_user(body) do
        :email_already_used ->
          {conn, 400, "Cet email est déjà associé à un autre utilisateur"}

        :error ->
          {conn, 400, "Erreur durant la création de votre utilisateur."}

        false ->
          {conn, 400, "Erreur durant la création de votre utilisateur."}

        user ->
          try do
            Logger.debug("New user: #{inspect(user)}")

            case user.role do
              "coach" -> [:avatar, :certification, :idcard, :rib]
              "default" -> [:avatar]
            end
            |> Enum.all?(&Utils.move_user_files(user, &1))
            |> case do
              false ->
                User.delete_user(user.id)
                {conn, 400, "Une erreur est survenue lors de la sauvegarde d'un de vos fichiers."}

              _ ->
                Clab.Mailer.send_confirmation_mail(user)
                Clab.Mailer.send_signup_alert(user)
                ImageMover.copy_user_avatar(user.id)
                token = build_token(user.id)
                conn = put_resp_cookie(conn, "cltoken", token, same_site: "Strict")
                {conn, 200, "Votre compte a été bien été créé."}
            end
          rescue
            e ->
              Logger.error("[ERROR] Bad signup for user: #{user.email}, #{inspect(e)}")
              User.delete_user(user.id)
              {conn, 400, "Une erreur est survenue lors de la création de votre compte."}
          end
      end

    send_resp(conn, status_code, ret_text)
  end

  get "/video" do
    data = Utils.get_html_template("video")
    send_resp(conn, 200, data)
  end

  get "/video-token" do
    id = check_token_user(conn)

    if !is_nil(id) do
      user = User.get_user_by_id(id)
      res_id = conn.query_params["roomId"] |> URI.decode() |> String.replace(":00 ", ":00+")
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

        resa[:coach_id] == user.id ->
          Twilio.create_room(resa)
          token = Jwt.create_twilio_token(user)
          send_resp(conn, 200, token)

        Enum.member?(List.wrap(resa[:paid]), user.id) ->
          token = Jwt.create_twilio_token(user)
          send_resp(conn, 200, token)

        true ->
          send_resp(conn, 403, "Vous n'avez pas payé pour cette séance")
      end
    else
      send_resp(conn, 401, "Token invalide")
    end
  end

  post "/new_coach" do
    body = conn.body_params |> Map.new(fn {k, v} -> {String.to_atom(k), v} end)
    id = check_token_user(conn)

    if !is_nil(id) do
      user =
        id
        |> User.get_user_by_id()
        |> Map.update(:coaches, [body.coach_id], &Enum.uniq(&1 ++ [body.coach_id]))

      {status_code, ret_text} =
        case User.edit_user(user.id, user) do
          :error -> {400, "Erreur durant le changement de vos informations."}
          _ -> {200, "Vos informations ont été mis à jour."}
        end

      send_resp(conn, status_code, ret_text)
    else
      send_resp(conn, 401, "Token invalide")
    end
  end

  post "/edit-infos" do
    body = conn.body_params |> Map.new(fn {k, v} -> {String.to_atom(k), v} end)
    id = check_token_user(conn)

    if !is_nil(id) do
      user = User.get_user_by_id(id)

      if body[:session_price] && body[:session_price] != user[:session_price] do
        Map.put(user, :session_price, body.session_price)
      end

      cond do
        User.edit_user(user.id, body) == :error ->
          send_resp(conn, 400, "Erreur durant le changement de vos informations.")

        true ->
          send_resp(conn, 200, "Vos informations ont été mis à jour.")
      end

      else
      send_resp(conn, 401, "Token invalide")
    end
  end

  post "/api/new-resa" do
    id = check_token_user(conn)

    if !is_nil(id) do
      body = conn.body_params |> Map.new(fn {k, v} -> {String.to_atom(k), v} end)
      coach = User.get_user_by_id(body.user_id)

      payload =
        Map.merge(body.resa, %{
          coach_id: coach.id,
          coach_avatar: coach[:avatar],
          coach_name: "#{coach.firstname} #{coach.lastname}"
        })

      {status_code, ret_text} =
        Agenda.reserve_agendas(payload[:id], payload[:coached_ids], payload)
        |> case do
          :ok ->
            payload[:coached_ids]
            |> List.wrap()
            |> Enum.each(&Reservation.send_payment_link(payload[:id], &1))

            {200, "Votre rendez-vous a bien été enregistré."}

          :error ->
            {400, "Une erreur est survenue durant la reservation."}

          _ ->
            {500, "Une erreur inattendue est survenue durant la reservation."}
        end

      send_resp(conn, status_code, ret_text)
    else
      send_resp(conn, 401, "Token invalide")
    end
  end

  post "/api/update-resa" do
    id = check_token_user(conn)

    if !is_nil(id) do
      body = conn.body_params |> Map.new(fn {k, v} -> {String.to_atom(k), v} end)

      #@TODO: besoin d'une fonction format resa ?
      payload = %{
        id: body.id,
        sessionTitle: body.sessionTitle,
        address: body.address,
        coached_ids: body.coached_ids
      }

      if Reservation.update_reservation(body.id, payload, id) == :error do
        send_resp(conn, 403, "Vous n'avez pas l'autorisation de modifier cette reservation.")
      else
        send_resp(conn, 200, "RDV mis à jour.")
      end
    else
      send_resp(conn, 401, "Token invalide")
    end
  end

  post "/signup-invite" do
    #@TODO: MIDDLEWARE AUTHENTIFICATION
    id = check_token_user(conn)

    if !is_nil(id) do
      body = conn.body_params |> Map.new(fn {k, v} -> {String.to_atom(k), v} end)
      coach = User.get_user_by_id(id)

      Clab.Mailer.send_invitation_mails([body.email], coach)

      send_resp(conn, 200, "Ok")
    else
      send_resp(conn, 401, "Token invalide")
    end
  end

  get "/api/user/:user_id" do
    id = check_token_user(conn)

    if !is_nil(id) do
      user = User.get_user_by_id(user_id)
      send_resp(conn, 200, user |> Poison.encode!())
    else
      send_resp(conn, 401, "Token invalide")
    end
  end

  get "/nouveau-mot-de-passe" do
    data = Utils.get_html_template("new_password")
    send_resp(conn, 200, data)
  end

  get "/mot-de-passe-oublie" do
    data = Utils.get_html_template("forgotten_password")
    send_resp(conn, 200, data)
  end

  get "/facture" do
    data = Utils.get_html_template("invoice")
    send_resp(conn, 200, data)
  end

  get "/api/send_password_reset" do
    mail = conn.query_params["mail"] |> URI.decode()

    mail
    |> User.get_user()
    |> case do
      nil ->
        # Send 200 so people can't guess existing users through this feature
        send_resp(conn, 200, "OK")

      _ ->
        hash = User.create_reset_hash(mail)

        content =
          EEx.eval_file("#{:code.priv_dir(:clab)}/static/emails/forgotten-password.html.eex",
            hash: hash,
            base_url: Application.fetch_env!(:clab, :url)
          )

        Task.start(fn ->
          Clab.Mailer.send_mail([mail], "Ré-initialisez votre mot de passe CoachLab", content)
        end)

        send_resp(conn, 200, "OK")
    end
  end

  post "/api/change_password" do
    body = conn.body_params |> Map.new(fn {k, v} -> {String.to_atom(k), v} end)
    User.change_password(body.password, body.token)
    send_resp(conn, 200, "OK")
  end

  # forward "/users", to: UsersRouter

  match _ do
    send_resp(conn, 404, "Erreur 404: page introuvable")
  end
end
