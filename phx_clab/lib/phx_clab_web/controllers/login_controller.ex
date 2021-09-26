defmodule PhxClabWeb.LoginController do
  use PhxClabWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
