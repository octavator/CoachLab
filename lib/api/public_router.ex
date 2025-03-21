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

  post "/inscription/file" do
    body = conn.body_params |> Map.new(fn {k, v} -> {String.to_atom(k), v} end)
    filename = body.myFile.filename
    path = Path.expand(body.myFile.path, __DIR__)
    case Utils.test_file_type(path, filename) do
      true ->
        Logger.debug("[SIGNUP FILE] Uploading file to data/tmp_files/#{filename}")
        File.write!("data/tmp_files/#{filename}", File.read!(path))
        send_resp(conn, 200, "OK")

      _ ->
        send_resp(conn, 500, "Une erreur inconnue est survenue")
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
        body.password
        |> User.hash_password(user.salt)
        |> Kernel.==(user.password)
        |> if do
          token = Clab.AuthPlug.build_token(user.id)
          conn = put_resp_cookie(conn, "cltoken", token, same_site: "Strict")
          user_data = Map.drop(user, [:salt, :password])
          send_resp(conn, 200, Poison.encode!(user_data))
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

        user ->
          User.confirm_signup(conn, user)
      end

    send_resp(conn, status_code, ret_text)
  end

  get "/api/send_password_reset" do
    mail = conn.query_params["mail"] |> URI.decode()
    mail
    |> User.get_user()
    |> is_nil()
    |> if do
      # Send 200 so people can't guess existing users through this feature
      send_resp(conn, 200, "OK")
    else
      Clab.Mailer.send_reset_password_mail(mail)
      send_resp(conn, 200, "OK")
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

  match _ do
    conn
  end
end
