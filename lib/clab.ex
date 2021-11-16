defmodule Clab do
  def shutdown do
    :init.stop
  end
end

defmodule ClabRouter do
  use Plug.Router
  plug Plug.Logger

  #@TODO: 1 problems:
  # - js files are accessible through url
  plug Plug.Static, from: :clab, at: "/priv/static"
  plug :match
  plug Plug.Parsers, parsers: [:json],
                     pass:  ["text/*"],
                     json_decoder: Poison
  plug :dispatch

  get "/" do
    data = Utils.get_html_template("landing")
    send_resp(conn, 200, data)
  end

  get "/me" do
    conn = fetch_cookies(conn)
    token = IO.inspect(conn.cookies["cltoken"] |> Base.decode64!(padding: false))
    user = User.get_user(token)
    data = Map.delete(user, :salt) |> Map.delete(:password)
    {:ok, user_data} = data |> Poison.encode
    send_resp(conn, 200, user_data)
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
            conn = put_resp_cookie(conn, "cltoken", user.email |> Base.encode64(padding: false))
            send_resp(conn, 200, user_data |> Poison.encode!)
          _ ->
            send_resp(conn, 401, "Votre mot de passe est incorrect")
        end
    end

  end

  get "/agenda" do
    #if ! query param coach_id, show current user agenda
    data = Utils.get_html_template("agenda")
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
    data = Utils.get_html_template("signup")
    send_resp(conn, 200, data)
  end

  post "/sign-up" do
    body = conn.body_params |> Map.new(fn {k, v} -> {String.to_atom(k), v} end)
    {status_code, ret_text} = case User.create_user(body) do
      :error -> {400, "Erreur durant la création de votre utilisateur."}
      false -> {400, "Erreur durant la création de votre utilisateur."}
      _ ->  {200, "Votre compte a été bien été créé."}
    end
    send_resp(conn, status_code, ret_text)
  end

  post "/edit-infos" do
    body = conn.body_params |> Map.new(fn {k, v} -> {String.to_atom(k), v} end)
    {status_code, ret_text} = case User.edit_user(body.email, body) do
      :error -> {400, "Erreur durant le changement de vos informations."}
      _ ->  {200, "Vos informations ont été mis à jour."}
    end
    send_resp(conn, status_code, ret_text)
  end

 #forward "/users", to: UsersRouter

  match _ do
    send_resp(conn, 404, "Erreur 404: page introuvable")
  end
end
