defmodule PhxClab.Repo do
  use Ecto.Repo,
    otp_app: :phx_clab,
    adapter: Ecto.Adapters.Postgres
end
