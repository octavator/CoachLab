defmodule Clab do
  def shutdown do
    :init.stop
  end
end

defmodule ClabRouter do
  use Plug.Router
  plug Plug.Logger
  require Logger

  @secret "73JIOiOJSKLAZHOJfspaioz9902"

  plug Plug.SSL
  plug Plug.Static, from: :clab, at: "/priv/static"
  plug :match
  plug Plug.Parsers, parsers: [:json, :multipart],
                     pass: ["*/*"],
                     json_decoder: Poison
  plug :dispatch

  def build_token(id) do
    (id <> "|" <> :crypto.hash(:sha256, @secret <> id))
     |> Base.encode64(padding: false)
  end

  #@TODO: add expiration to token (1 month ?)
  def check_token_user(conn) do
    conn = fetch_cookies(conn)
    cookie = conn.cookies["cltoken"]
    case get_user_from_token(cookie) do
      nil -> nil
      id ->
       cookie == build_token(id) && id || nil
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
      data = Map.take(user, [:role, :phone, :lastname, :firstname, :id, :email])
      {:ok, user_data} = data |> Poison.encode
      send_resp(conn, 200, user_data)
    else
      send_resp(conn, 401, "Token invalide")
    end
  end

  get "/me/agenda" do
    id = check_token_user(conn)
    if !is_nil(id) do
      user = User.get_user_by_id(id)
      agenda = Agenda.get_agenda(user.id)
      {:ok, agenda_data} = agenda |> Poison.encode
      send_resp(conn, 200, agenda_data)
    else
      send_resp(conn, 401, "Token invalide")
    end
  end

  get "/api/coach/agenda" do
    id = check_token_user(conn)
    if !is_nil(id) do
      coach_id = conn.query_params["coach_id"] |> Base.decode64!(padding: false)
      Logger.debug("coach id = #{coach_id}")
      agenda = Agenda.get_agenda(coach_id)
      user = User.get_user_by_id(coach_id) |> Map.take([:firstname, :lastname, :email, :id])
      {:ok, data} = %{agenda: agenda, user: user} |> Poison.encode
      send_resp(conn, 200, data)
    else
      send_resp(conn, 401, "Token invalide")
    end
  end

  post "/sign-in" do
    body = conn.body_params |> Map.new(fn {k, v} -> {String.to_atom(k), v} end)
    user = User.get_user(body.email)
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

  get "/coach/agenda" do
    Logger.debug("coach id agenda")
    data = Utils.get_html_template("coach_agenda")
    send_resp(conn, 200, data)
  end

  get "/bienvenue" do
    Logger.debug("coach id agenda")
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

  #@TODO: rajouter de la sécurité
  post "/file/upload" do
    user_id = check_token_user(conn)
    if !is_nil(user_id) do
      body = conn.body_params |> Map.new(fn {k, v} -> {String.to_atom(k), v} end)
      true = Utils.test_file_type(body.myFile.path, body.myFile.filename)
      #@TODO :  à harmoniser
      [dir_name | filename] = body.myFile.filename |> String.split("_")
      File.mkdir_p("data/#{dir_name}/#{user_id}")
      IO.inspect(File.read!(body.myFile.path), label: "writing file to data/#{dir_name}/#{user_id}/#{filename}")
      File.write("data/#{dir_name}/#{user_id}/#{filename}", File.read!(body.myFile.path))
      send_resp(conn, 200, "ok")
    else
      send_resp(conn, 401, "Token invalide")
    end
  end

  #@TODO: rajouter de la sécurité
  post "/inscription/file" do
    body = conn.body_params |> Map.new(fn {k, v} -> {String.to_atom(k), v} end)
    filename = body.myFile.filename
    path = Path.expand(body.myFile.path, __DIR__)

    #@TODO: check its extension isnt a potentially dangerous one
    true = Utils.test_file_type(path, filename)
    File.read!(path)
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
    # body = %{body | email: body.email <> "#{:crypto.strong_rand_bytes(20)}"}
    {conn, status_code, ret_text} = case User.create_user(body) do
      :email_already_used -> {conn, 400, "Cet email est déjà associé à un autre utilisateur"}
      :error -> {conn, 400, "Erreur durant la création de votre utilisateur."}
      false -> {conn, 400, "Erreur durant la création de votre utilisateur."}
      user ->
        files = case user.role do
          "coach" -> ["avatar", "certification", "idcard", "rib"]
          "default" -> ["avatar"]
        end
        IO.inspect(user)
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
            content = EEx.eval_file("#{:code.priv_dir(:clab)}/static/emails/signup-confirmation.html.eex", user: user)
            Clab.Mailer.send_mail([user.email], "Confirmation de votre inscription sur CoachLab", content)

            content = EEx.eval_file("#{:code.priv_dir(:clab)}/static/emails/signup-alert.html.eex", user: user)
            attachments = File.ls!("data/images/#{user.id}") |> Enum.map(& {&1, File.read!("data/images/#{user.id}/#{&1}")})
            Clab.Mailer.send_mail_with_attachments(
              Application.get_env(:clab, :mailer)[:signup_emails],
              "[#{Utils.get_role_label(user.role)}] Nouvelle inscription sur CoachLab !",
               content, attachments)

            token = (user.id <> "|" <> :crypto.hash(:sha256, @secret <> user.id)) |> Base.encode64(padding: false)
            conn = put_resp_cookie(conn, "cltoken", token, same_site: "Strict")
            {conn, 200, "Votre compte a été bien été créé."}
        end
    end
    send_resp(conn, status_code, ret_text)
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
        user.email == body.email -> {400, "Erreur: Vous ne pouvez prendre un rendez-vous avec vous-même."}
        true ->
          coach = User.get_user(body.email)
          case Agenda.update_agenda(user.id, %{body.id => body.resa}) do
            :error -> {400, "Une erreur est survenue durant la reservation."}
            _ ->
              Agenda.update_agenda(coach.id, %{body.id => body.resa})
              {200, "Votre rendez-vous a bien été enregistré."}
          end
      end
      send_resp(conn, status_code, ret_text)
    else
      send_resp(conn, 401, "Token invalide")
    end
  end

 #forward "/users", to: UsersRouter

  match _ do
    send_resp(conn, 404, "Erreur 404: page introuvable")
  end
end
