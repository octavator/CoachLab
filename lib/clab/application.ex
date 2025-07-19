defmodule Clab.Application do
  @moduledoc false
  @port Application.compile_env!(:clab, :port)
  @env Application.compile_env!(:clab, :env)

  use Application

  def start(_type, _args) do
    cowboy_children = case @env do
      # env when env in [:prod, :preprod] ->
      #   [{
      #     Plug.Cowboy, scheme: :https, plug: Clab.Router, options: [
      #       port: 443,
      #       otp_app: :clab,
      #       keyfile: "./privkey.pem",
      #       certfile: "./certificate.pem"
      #     ]
      #   },
      #   {Plug.Cowboy, scheme: :http, plug: Clab.Router, options: [port: 8080]}
      #   ]

      _ ->
        [{Plug.Cowboy, scheme: :http, plug: Clab.Router, options: [port: @port]}]
    end

    children = cowboy_children ++ [
      User,
      Agenda,
      Reservation,
      DataSaver,
      ImageMover,
      AutoMailer
    ]

    opts = [
      max_restarts: 30,
      max_seconds: 5,
      strategy: :one_for_one,
    ]

    File.mkdir_p("data/tmp_files")
    #@TODO: delayed Sup
    Supervisor.start_link(children, opts)
  end
end
