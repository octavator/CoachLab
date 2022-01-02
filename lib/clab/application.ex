defmodule Clab.Application do
  @moduledoc false

  use Application

  def start(_type, _args) do
    children = [
      {Plug.Cowboy, scheme: :http, plug: ClabRouter, options: [port: 4001]},
      User,
      Agenda,
      DataSaver
    ]
    opts = [strategy: :one_for_one]
    Supervisor.start_link(children, opts)
  end
end
