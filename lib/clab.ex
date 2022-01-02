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

  plug Plug.Static, from: :clab, at: "/priv/static"
  plug :match
  plug Plug.Parsers, parsers: [:json],
                     pass:  ["text/*"],
                     json_decoder: Poison
  plug :dispatch

  def build_token(id) do
    (id <> "|" <> :crypto.hash(:sha256, @secret <> id))
     |> Base.encode64(padding: false)
  end

  def get_token_user(conn) do
    conn = fetch_cookies(conn)
    cookie = conn.cookies["cltoken"]
    if cookie == nil do
      {conn, nil}
    else
      token = cookie |> Base.decode64!(padding: false)
      tokens = String.split(token, "|")
      id = tokens |> hd
      {conn, id}
    end

  end

  get "/" do
    data = Utils.get_html_template("landing")
    send_resp(conn, 200, data)
  end

  get "/me" do
    {conn, id} = get_token_user(conn)
    if !is_nil(id) && conn.cookies["cltoken"] == build_token(id) do
      user = User.get_user_by_id(id)
      data = Map.delete(user, :salt) |> Map.delete(:password)
      {:ok, user_data} = data |> Poison.encode
      send_resp(conn, 200, user_data)
    else
      send_resp(conn, 401, "Token invalide")
    end
  end

  get "/me/agenda" do
    {conn, id} = get_token_user(conn)
    if conn.cookies["cltoken"] == build_token(id) do
      user = User.get_user_by_id(id)
      agenda = Agenda.get_agenda(user.id)
      {:ok, agenda_data} = agenda |> Poison.encode
      send_resp(conn, 200, agenda_data)
    else
      send_resp(conn, 401, "Token invalide")
    end
  end

  get "/api/coach/agenda" do
    {conn, id} = get_token_user(conn)
    if conn.cookies["cltoken"] == build_token(id) do
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
    data = Utils.get_html_template("signup")
    send_resp(conn, 200, data)
  end

  post "/sign-up" do
    body = conn.body_params |> Map.new(fn {k, v} -> {String.to_atom(k), v} end)
    {status_code, ret_text} = case User.create_user(body) do
      :email_already_used -> {400, "Cet email est déjà associé à un autre utilisateur"}
      :error -> {400, "Erreur durant la création de votre utilisateur."}
      false -> {400, "Erreur durant la création de votre utilisateur."}
      _ ->  {200, "Votre compte a été bien été créé."}
    end
    send_resp(conn, status_code, ret_text)
  end

  post "/edit-infos" do
    body = conn.body_params |> Map.new(fn {k, v} -> {String.to_atom(k), v} end)
    {conn, id} = get_token_user(conn)
    user = User.get_user_by_id(id)
    existing_user = body.email != user.email && !is_nil(User.get_user(body.email))
    edit_ret = User.edit_user(user.id, body)
    {status_code, ret_text} = cond do
      edit_ret == :error -> {400, "Erreur durant le changement de vos informations."}
      existing_user  -> {400, "Cette adresse mail est déjà utilisée."}
      true ->  {200, "Vos informations ont été mis à jour."}
    end
    send_resp(conn, status_code, ret_text)
  end

  post "/new-resa" do
    {conn, email} = get_token_user(conn)
    body = conn.body_params |> Map.new(fn {k, v} -> {String.to_atom(k), v} end)
    {status_code, ret_text} = cond do
      email == body.email -> {400, "Erreur: Vous ne pouvez prendre un rendez-vous avec vous-même."}
      true ->
        user = User.get_user(email)
        coach = User.get_user(body.email)
        case Agenda.update_agenda(user.id, %{body.id => body.resa}) do
          :error -> {400, "Une erreur est survenue durant la reservation."}
          _ ->
            Agenda.update_agenda(coach.id, %{body.id => body.resa})
            {200, "Votre rendez-vous a bien été enregistré."}
        end
    end
    send_resp(conn, status_code, ret_text)
  end

 #forward "/users", to: UsersRouter

  match _ do
    send_resp(conn, 404, "Erreur 404: page introuvable")
  end
end
