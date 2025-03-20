#@TODO: if we could make this work :pray:
defmodule Clab.AuthPlug do
  import Plug.Conn
  use Plug.Builder

  @secret "ex6NgPSw1MAcMolW0R1czwDC"

  def init(options), do: options

  def call(conn, _opts) do
    conn
    |> check_token_user()
    |> User.get_user_by_id()
    |> case do
      nil ->
        send_resp(conn, 401, "Token invalide") |> halt()

      user ->
        assign(conn, :user, user)
    end
  end

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
end
