import Config

config :clab,
  env: :dev,
  url: "http://localhost:80",
  test_key: "test value",
  region: "email-smtp.eu-west-1.amazonaws.com",
  access_key: "AKIA6L3JFYZIQWKZOPXX",
  secret: "BEoi3c6LxpW4kDno2BqTfakmQqHe7Un8ntT1hduQPJ5i",
  mailer: %{
    maintainer_emails: ["theophile.decagny@gmail.com"],
    signup_emails: ["theophile.decagny@gmail.com", "theophile.fondacci@coachlab.fr"]
  },
  twilio: %{
    url: "https://video.twilio.com/v1/",
    account_sid: "ACe1e6e2732527a4d5e37c9194fdf4095d",
    account_secret: "2bd98b9b924dc94e0a356e4387c6e6ec",
    sid: "SKed2b73fe00dff7739b4eb7a75ef06066",
    secret: "BdTj70ASVynmNuUWYWraE35imHVqyEcF",
    name: "clab-test"
  },
  stripe: %{
    url: "https://api.stripe.com/v1/",
    test_sid: "pk_test_51LK7W0DPLkquZzcad6zgw8FB7qrjWzcZstCLnaqCsht6n1QELcIvNXbpUA7EkCfdU226HrNKNoSUAXVJiBAveRXl00sZzpzTHO",
    test_secret: "sk_test_51LK7W0DPLkquZzca1QxqnYrijHZKdn2k8ACuTlBfwTFkjfhO1c4VIRJzeMtqofmX2c32nCqQg4gg1Gr1qdEjI8Ep00RNMs6YDp",
    test_mode: true,
    live_secret: "sk_azerty"
  }

import_config "#{config_env()}.exs"
