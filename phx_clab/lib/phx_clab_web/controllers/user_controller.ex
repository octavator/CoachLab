defmodule PhxClabWeb.UserController do
  use PhxClabWeb, :controller

  @secret "73JIOiOJSKLAZHOJfspaioz9902"

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

  def build_token(id) do
    (id <> "|" <> :crypto.hash(:sha256, @secret <> id))
     |> Base.encode64(padding: false)
  end

  def show(conn, _params) do
    text(conn, "USER CONTROLLER SHOW")
    # render(conn, "show.html")
  end

  def new(conn, _params) do
    text(conn, "USER CONTROLLER NEW")
  end

  def edit(conn, _params) do
    text(conn, "USER CONTROLLER EDIT")
  end

  def delete(conn, _params) do
    text(conn, "USER CONTROLLER DELETE")
  end

  def me(conn, _params) do
    {conn, id} = get_token_user(conn)
    if !is_nil(id) && conn.cookies["cltoken"] == build_token(id) do
    #   user = User.get_user_by_id(id)
    #   data = Map.delete(user, :salt) |> Map.delete(:password)
    #   {:ok, user_data} = data |> Poison.encode
    #   send_resp(conn, 200, user_data)
      conn
      |> put_status(401)
      |> json(%{id: id, message: "Token invalide"})
    else
      conn
      |> put_status(401)
      |> json(%{id: id, message: "Token invalide"})
    #   send_resp(conn, 401, "Token invalide")
    end
  end

end
