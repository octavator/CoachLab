defmodule Clab do
  @moduledoc """
  Documentation for `Clab`.
  """

  @doc """
  Hello world.

  ## Examples

      iex> Clab.hello()
      :world

  """
  def hello do
    :world
  end
end

defmodule ClabRouter do
  use Plug.Router
  plug Plug.Logger

  #@TODO: 2 problems:
  # - js files are accessible through url
  # - must copy our files from web/ to priv/static/ :( => webpack ?
  plug Plug.Static, from: :clab, at: "/priv/static"
  plug :match
  plug :dispatch
  
  get "/" do
    data = Utils.get_html_template("landing")
    send_resp(conn, 200, data)
  end

  get "/agenda" do
    data = Utils.get_html_template("agenda")
    send_resp(conn, 200, data)
  end

  get "/infos" do
    data = Utils.get_html_template("infos")
    send_resp(conn, 200, data)
  end

  get "/modal" do
    data = Utils.get_html_template("modal-appointment")
    send_resp(conn, 200, data)
  end

  get "/hello" do
    send_resp(conn, 200, "world")
  end

 #forward "/users", to: UsersRouter

  
  match _ do
    send_resp(conn, 404, "Erreur 404: page introuvable")
  end
end