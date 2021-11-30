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

  #@TODO: 1 problems:
  # - js files are accessible through url
  plug Plug.Static, from: :clab, at: "/priv/static"
  plug :match
  plug Plug.Parsers, parsers: [:json],
                     pass:  ["text/*"],
                     json_decoder: Poison
  plug :dispatch

  def build_token(email) do
    (email <> "|" <> :crypto.hash(:sha256, @secret <> email))
     |> Base.encode64(padding: false)
  end

  def get_token_user(conn) do
    conn = fetch_cookies(conn)
    token = conn.cookies["cltoken"] |> Base.decode64!(padding: false)
    tokens = String.split(token, "|")
    email = tokens |> hd
    {conn, email}
  end

  get "/" do
    data = Utils.get_html_template("landing")
    send_resp(conn, 200, data)
  end

  get "/me" do
    {conn, email} = get_token_user(conn)
    if conn.cookies["cltoken"] == build_token(email) do
      user = User.get_user(email)
      data = Map.delete(user, :salt) |> Map.delete(:password)
      {:ok, user_data} = data |> Poison.encode
      send_resp(conn, 200, user_data)
    else
      send_resp(conn, 401, "Token invalide")
    end
  end

  get "/me/agenda" do
    {conn, email} = get_token_user(conn)
    if conn.cookies["cltoken"] == build_token(email) do
      agenda = Agenda.get_agenda(email)
      {:ok, agenda_data} = agenda |> Poison.encode
      send_resp(conn, 200, agenda_data)
    else
      send_resp(conn, 401, "Token invalide")
    end
  end

  get "/api/coach/agenda" do
    {conn, email} = get_token_user(conn)
    if conn.cookies["cltoken"] == build_token(email) do
      coach_id = conn.query_params["coach_id"] |> Base.decode64!(padding: false)
      Logger.debug("coach id = #{coach_id}")
      agenda = Agenda.get_agenda(coach_id)
      user = User.get_user(coach_id) |> Map.take([:firstname, :lastname, :email, :id])
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
            token = (user.email <> "|" <> :crypto.hash(:sha256, @secret <> user.email)) |> Base.encode64(padding: false)
            conn = put_resp_cookie(conn, "cltoken", token)
            send_resp(conn, 200, user_data |> Poison.encode!)
          _ ->
            send_resp(conn, 401, "Votre mot de passe est incorrect")
        end
    end

  end

  get "/logout" do
    conn = put_resp_cookie(conn, "cltoken", "disconnected")
    send_resp(conn, 200, "Vous avez été déconnecté")
  end

  get "/agenda" do
    #if ! query param coach_id, show current user agenda
    data = Utils.get_html_template("agenda")
    send_resp(conn, 200, data)
  end

  get "/coach/agenda" do
    Logger.debug("coach id agenda")
    #if ! query param coach_id, show current user agenda
    data = Utils.get_html_template("coach_agenda")
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

  post "/new-resa" do
    {conn, email} = get_token_user(conn)
    body = conn.body_params |> Map.new(fn {k, v} -> {String.to_atom(k), v} end)
    {status_code, ret_text} = case email == body.email do
      false -> {403, "Erreur est survenue durant la reservation."}
      true ->
        case Agenda.update_agenda(body.email, %{body.id => body.resa}) do
          :error -> {400, "Erreur durant le changement de vos informations."}
          _ ->  {200, "Votre rendez-vous a bien été enregistré."}
        end
    end
    send_resp(conn, status_code, ret_text)
  end

 #forward "/users", to: UsersRouter

  match _ do
    send_resp(conn, 404, "Erreur 404: page introuvable")
  end
end
