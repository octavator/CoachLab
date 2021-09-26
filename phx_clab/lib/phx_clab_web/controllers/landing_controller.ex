defmodule PhxClabWeb.LandingController do
  use PhxClabWeb, :controller

  def home(conn, _params) do
    conn
    #disables layout rendering
    # |> put_root_layout(false)
    |> put_flash(:info, "Welcome to Phoenix, from flash info!")
    |> put_flash(:error, "Let's pretend we have an error.")
    |> render("home.html")
  end
end
