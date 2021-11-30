defmodule Clab.Application do
  @moduledoc false

  use Application

  def start(_type, _args) do
    children = [
      {Plug.Cowboy, scheme: :http, plug: ClabRouter, options: [port: 4001]},
      Schedule,
      User,
      Agenda
    ]
    opts = [strategy: :one_for_one, name: Clab.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
