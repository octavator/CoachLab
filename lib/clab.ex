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
  plug Plug.Static, from: :clab, at: "/web"
  plug :match
  plug :dispatch
  
  get "/" do
    data = Utils.get_html_template("landing")
    # data = File.read!("./web/landing.html")
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