defmodule Clab do
  def shutdown do
    :init.stop
  end
end

defmodule ClabRouter do
  use Plug.Router
  plug Plug.Logger
  require Logger
  
  # use Plug.Debugger

  @secret "73JIOiOJSKLAZHOJfspaioz9902"

  plug Plug.SSL
  plug Plug.Static, from: :clab, at: "/priv/static"
  plug :match
  plug Plug.Parsers,
     parsers: [
       :json,
       :urlencoded,
       {:multipart, length: 6_000_000} #6MB max upload
     ],
     json_decoder: Poison

  plug :dispatch

  #@TODO: replace auth checks with a custom plug
  #@TODO: add expiration to token (1 month ?)
  #@TODO: auto delete of very old backups and tmp_files

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
      true -> nil
    end
  end

  def get_user_from_token(cookie) do
    case cookie do
      nil -> nil
      cookie ->
        token = cookie |> Base.decode64!(padding: false)
        String.split(token, "|") |> hd
    end
  end

  get "/" do
    data = Utils.get_html_template("landing")
    send_resp(conn, 200, data)
  end

  get "/me" do
    id = check_token_user(conn)
    if !is_nil(id) do
      user = User.get_user_by_id(id)
      if !is_nil(user) do
        data = Map.take(user, [:role, :phone, :lastname, :firstname, :id, :email])
        {:ok, user_data} = data |> Poison.encode
        send_resp(conn, 200, user_data)
      else
        send_resp(conn, 401, "Utilisateur inconnu")
      end
    else
      send_resp(conn, 401, "Token invalide")
    end
  end

  get "/me/agenda" do
    id = check_token_user(conn)
    if !is_nil(id) do
      user = User.get_user_by_id(id)
      agenda = Agenda.get_agenda(user.id)
      data = %{agenda: agenda, user: user} |> Poison.encode!
      send_resp(conn, 200, data)
    else
      send_resp(conn, 401, "Token invalide")
    end
  end

  get "/coach/agenda/:target_id" do
    id = check_token_user(conn)
    if !is_nil(id) do
      Logger.debug("coach id = #{target_id}")
      agenda = Agenda.get_agenda(target_id) |> Map.new(fn {k, _v} -> {k, %{}} end)
      user = User.get_user_by_id(target_id)
      data = %{agenda: agenda, user: user} |> Poison.encode!
      send_resp(conn, 200, data)
    else
      send_resp(conn, 401, "Token invalide")
    end
  end

  post "/sign-in" do
    body = conn.body_params |> Map.new(fn {k, v} -> {String.to_atom(k), v} end)
    user = User.get_all_user_info(body.email)
    case user do
      nil -> send_resp(conn, 401, "Adresse mail inconnue")
      user ->
        hashed_input = User.hash_password(body.password, user.salt)
        case hashed_input == user.password do
          true ->
            user_data = Map.delete(user, :salt) |> Map.delete(:password)
            token = (user.id <> "|" <> :crypto.hash(:sha256, @secret <> user.id)) |> Base.encode64(padding: false)
            conn = put_resp_cookie(conn, "cltoken", token, same_site: "Strict")
            send_resp(conn, 200, user_data |> Poison.encode!)
          _ ->
            send_resp(conn, 401, "Votre mot de passe est incorrect")
        end
    end

  end

  get "/logout" do
    conn = put_resp_cookie(conn, "cltoken", "disconnected", same_site: "Strict")
    send_resp(conn, 200, "Vous avez été déconnecté")
  end

  get "/agenda" do
    data = Utils.get_html_template("agenda")
    send_resp(conn, 200, data)
  end

  get "/new_agenda" do
    id = check_token_user(conn)
    if !is_nil(id) do
      data = Utils.get_html_template("new_agenda")
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

  get "/api/linked_users" do
    id = check_token_user(conn)
    if !is_nil(id) do
      users = User.get_linked_users(id)
      if is_nil(users) do
        send_resp(conn, 500, "Une erreur inattendue est survenue")
      else
        send_resp(conn, 200, users |> Poison.encode!)
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
    data = Utils.get_html_template("user_profile")
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

  post "/file/upload" do
    user_id = check_token_user(conn)
    if !is_nil(user_id) do
      body = conn.body_params |> Map.new(fn {k, v} -> {String.to_atom(k), v} end)
      filename = body.myFile.filename
      path = Path.expand(body.myFile.path, __DIR__)
      true = Utils.test_file_type(path, filename)
      IO.inspect("writing file to data/tmp_files/#{filename}")
      File.write("data/tmp_files/#{filename}", File.read!(path))
      send_resp(conn, 200, "ok")
    else
      send_resp(conn, 401, "Token invalide")
    end
  end

  post "/inscription/file" do
    body = conn.body_params |> Map.new(fn {k, v} -> {String.to_atom(k), v} end)
    filename = body.myFile.filename
    path = Path.expand(body.myFile.path, __DIR__)
    true = Utils.test_file_type(path, filename)
    IO.inspect("writing file to data/tmp_files/#{filename}")
    File.write("data/tmp_files/#{filename}", File.read!(path))
    send_resp(conn, 200, "ok")
  end

  get "/coach/search" do
    coach_name = conn.query_params["coach_name"] |> URI.decode()
    Logger.debug("coach search: #{coach_name}")
    users = User.search_coach_by_name(coach_name)  |> Poison.encode!
    send_resp(conn, 200, users)
  end

  post "/sign-up" do
    body = conn.body_params |> Map.new(fn {k, v} -> {String.to_atom(k), v} end)
    {conn, status_code, ret_text} = case User.create_user(body) do
      :email_already_used -> {conn, 400, "Cet email est déjà associé à un autre utilisateur"}
      :error -> {conn, 400, "Erreur durant la création de votre utilisateur."}
      false -> {conn, 400, "Erreur durant la création de votre utilisateur."}
      user ->
        try do
          files = case user.role do
            "coach" -> ["avatar", "certification", "idcard", "rib"]
            "default" -> ["avatar"]
          end
          IO.inspect(user, label: "new user")
          all_files_without_error = files |> Enum.all?(fn file ->
            ext = user[String.to_atom(file)] |> String.split(".") |> List.last()
            old_filepath = "data/tmp_files/#{user[String.to_atom(file)]}"
            new_filepath = "data/images/#{user.id}/#{file}.#{ext}"
            Utils.move_user_files(old_filepath, new_filepath, user)
          end)
          case all_files_without_error do
            false ->
              User.delete_user(user.id)
              files |> Enum.each(& File.rm("data/images/#{user.id}/#{&1}_#{user[&1]}"))
              {conn, 400, "Une erreur est survenue lors de la sauvegarde d'un de vos fichiers."}
            _ ->
              Clab.Mailer.send_confirmation_mail(user)
              Clab.Mailer.send_signup_alert(user)
              ImageMover.copy_user_avatar(user.id)
              token = (user.id <> "|" <> :crypto.hash(:sha256, @secret <> user.id)) |> Base.encode64(padding: false)
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
      grants = %{"identity" => user.id, "voice" => %{}, "video" => %{}}
      {:ok, token, _conf} = Jwt.generate_and_sign(
        %{"grants" => grants, "ttl" => 4800},
        Joken.Signer.create("HS256", Application.get_env(:clab, :twilio)[:secret], %{
          "typ" => "JWT",
          "alg" => "HS256",
          "cty" => "twilio-fpa;v=1"
        })
      )
      send_resp(conn, 200, token)
    else
      send_resp(conn, 401, "Token invalide")
    end
  end

  post "/edit-infos" do
    body = conn.body_params |> Map.new(fn {k, v} -> {String.to_atom(k), v} end)
    id = check_token_user(conn)
    if !is_nil(id) do
      user = User.get_user_by_id(id)
      existing_user = body.email != user.email && !is_nil(User.get_user(body.email))
      edit_ret = User.edit_user(user.id, body)
      {status_code, ret_text} = cond do
        edit_ret == :error -> {400, "Erreur durant le changement de vos informations."}
        existing_user  -> {400, "Cette adresse mail est déjà utilisée."}
        true ->  {200, "Vos informations ont été mis à jour."}
      end
      send_resp(conn, status_code, ret_text)
    else
      send_resp(conn, 401, "Token invalide")
    end
  end

  post "/new-resa" do
    id = check_token_user(conn)
    if !is_nil(id) do
      user = User.get_user_by_id(id)
      body = conn.body_params |> Map.new(fn {k, v} -> {String.to_atom(k), v} end)
      {status_code, ret_text} = cond do
        user.email == body.user_id -> {400, "Erreur: Vous ne pouvez prendre un rendez-vous avec vous-même."}
        true ->
          coach = User.get_user_by_id(body.user_id)
          payload = Map.put(body.resa, :coach_id, body.user_id)
          case Agenda.update_agenda(user.id, %{body.id => payload}) do
            :error -> {400, "Une erreur est survenue durant la reservation."}
            _ ->
              Agenda.update_agenda(coach.id, %{body.id => payload})
              {200, "Votre rendez-vous a bien été enregistré."}
          end
      end
      send_resp(conn, status_code, ret_text)
    else
      send_resp(conn, 401, "Token invalide")
    end
  end

  post "/signup-invite" do
    id = check_token_user(conn)
    if !is_nil(id) do
      coach = User.get_user_by_id(id)
      body = conn.body_params |> Map.new(fn {k, v} -> {String.to_atom(k), v} end)
      content = EEx.eval_file("#{:code.priv_dir(:clab)}/static/emails/signup-invitation.html.eex", coach: coach)
      Task.start(fn -> Clab.Mailer.send_mail([body.email], "Votre coach vous a invité à le rejoindre sur CoachLab", content) end)
      send_resp(conn, 200, "Ok")
    else
      send_resp(conn, 401, "Token invalide")
    end
  end

  get "/user/:user_id" do
    id = check_token_user(conn)
    if !is_nil(id) do
      Logger.debug("get user id: #{user_id}")
      user = User.get_user_by_id(user_id)  |> Poison.encode!
      send_resp(conn, 200, user)
    else
      send_resp(conn, 401, "Token invalide")
    end
  end

 #forward "/users", to: UsersRouter

  match _ do
    send_resp(conn, 404, "Erreur 404: page introuvable")
  end
end
