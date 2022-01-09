import Config

if Mix.env() == :prod do
  #@TODO: best practice to get that info ? env var, runtime config, secret file ?
  #System.fetch_env!(:twilio_key)
  config :clab, twilio_key: "aaa"
end
