defmodule PhxClabWeb.CoachAgendaController do
  use PhxClabWeb, :controller

  def index(conn, %{"coach_id" => coach_id}) do
    render(conn, "index.html", coach_id: coach_id)
  end
end
