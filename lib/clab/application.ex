defmodule Clab.Application do
  @moduledoc false

  use Application

  def start(_type, _args) do
    cowboy_child = case Application.fetch_env!(:clab, :env) do
      env when env in [:prod, :preprod] ->
        {
          Plug.Cowboy, scheme: :https, plug: ClabRouter, options: [
            port: 443,
            otp_app: :clab,
            keyfile: "./privkey.pem",
            certfile: "./certificate.pem"
          ]
        }
      _ ->
        {Plug.Cowboy, scheme: :http, plug: ClabRouter, options: [port: 4001]}
    end

    children = [
      cowboy_child,
      User,
      Agenda,
      DataSaver
    ]
    opts = [strategy: :one_for_one]
    Supervisor.start_link(children, opts)
  end
end
