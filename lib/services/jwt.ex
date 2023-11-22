defmodule Jwt do
  use Joken.Config
  @app_config Application.get_env(:clab, :twilio)

  @impl true
  def token_config do
    default_claims(iss: @app_config[:sid])
    |> add_claim("sub", fn -> @app_config[:account_sid] end)
  end

  def create_twilio_token(user) do
    grants = %{
      "identity" => user.id,
      "voice" => %{},
      "video" => %{}
    }
    opts = %{
      "grants" => grants,
      "ttl" => 4800
    }
    {:ok, token, _conf} =
      Jwt.generate_and_sign(
        opts,
        Joken.Signer.create(
          "HS256",
          Application.get_env(:clab, :twilio)[:secret],
          %{
            "typ" => "JWT",
            "alg" => "HS256",
            "cty" => "twilio-fpa;v=1"
          }
        )
      )
    token
  end
end
