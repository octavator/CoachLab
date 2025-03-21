defmodule Clab.PublicRouter do
  use Plug.Router
  plug Plug.Logger
  require Logger
  plug Plug.Static, from: :clab, at: "/priv/static"
  plug :match

  plug Plug.Parsers,
    parsers: [
      :json,
      :urlencoded,
      {:multipart, length: Application.compile_env(:clab, :max_upload_file_size, 3_000_000)}
    ],
    json_decoder: {Poison, :decode!, [[keys: :atoms!]]}
    # json_decoder: {Poison, :decode!, [[keys: :atoms]]}

  plug :dispatch

  get "/health" do
    send_resp(conn, 200, "ok")
  end

  get "/" do
    data = Utils.get_html_template("landing")
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
          token = Clab.AuthPlug.build_token(user.id)
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
                token = Clab.AuthPlug.build_token(user.id)
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



  get "/nouveau-mot-de-passe" do
    data = Utils.get_html_template("new_password")
    send_resp(conn, 200, data)
  end

  get "/mot-de-passe-oublie" do
    data = Utils.get_html_template("forgotten_password")
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
        Clab.Mailer.send_reset_password_mail(mail)
        send_resp(conn, 200, "OK")
    end
  end

  match _ do
    conn
  end
end
