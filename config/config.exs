import Config

config :clab,
  env: :dev,
  test_key: "test value",
  region: "email-smtp.eu-west-1.amazonaws.com",
  access_key: "AKIA6L3JFYZIQWKZOPXX",
  secret: "BEoi3c6LxpW4kDno2BqTfakmQqHe7Un8ntT1hduQPJ5i",
  mailer: %{
    maintainer_emails: ["theophile.decagny@gmail.com"],
    signup_emails: ["theophile.decagny@gmail.com", "theophile.fondacci@coachlab.fr"]
  }

import_config "#{config_env()}.exs"
