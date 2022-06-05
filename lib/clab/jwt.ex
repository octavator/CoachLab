defmodule Jwt do
  use Joken.Config
  @app_config Application.get_env(:clab, :twilio)

  @impl true
  def token_config do
    default_claims(iss: @app_config[:sid])
    |> add_claim("sub", fn -> @app_config[:account_sid] end)
  end
end