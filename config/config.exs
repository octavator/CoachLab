import Config

config :clab,
  env: :dev,
  url: "http://localhost:80",
  test_key: "test value",
  mailer: %{
    region: "smtp_adress",
    access_key: "username_or_key",
    secret: "password_or_secret",
    port: 587,
    maintainer_emails: ["theophile.decagny@gmail.com"],
    signup_emails: ["theophile.decagny@gmail.com"]
  },
  twilio: %{
    url: "https://video.twilio.com/v1/",
    account_sid: "my_sid_not_yours",
    account_secret: "my_secret_not_yours",
    sid: "rebelotte",
    secret: "rerebelotte",
    name: "clab-test"
  },
  stripe: %{
    url: "https://api.stripe.com/v1/",
    test_sid: "test_sid_gl",
    test_secret: "stripe_test_secret",
    test_mode: true,
    live_secret: "live_secret_stripe"
  }
config :mime, :types, %{
  "application/pdf" => ["pdf"],
  "image/png" => ["png"],
  "image/jpeg" => ["jpg", "jpeg"],
  "image/svg+xml" => ["svg"],
  "image/gif" => ["gif"]
}

import_config "#{config_env()}.exs"
