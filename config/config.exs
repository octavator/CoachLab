import Config

config :clab,
  env: :dev,
  url: "http://localhost:80",
  test_key: "test value",
  mailer: %{
    region: "smtp.office365.com",
    access_key: "theodecagny@hotmail.fr",
    secret: ".H&NxrPr)5P7ExP",
    port: 587,
    maintainer_emails: ["theophile.decagny@gmail.com"],
    signup_emails: ["theophile.decagny@gmail.com"]
  },
  twilio: %{
    url: "https://video.twilio.com/v1/",
    account_sid: "ACe1e6e2732527a4d5e37c9194fdf4095d",
    account_secret: "7a21efb9e357e451b295591ced0c3254",
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
config :mime, :types, %{
  "application/pdf" => ["pdf"],
  "image/png" => ["png"],
  "image/jpeg" => ["jpg", "jpeg"],
  "image/svg+xml" => ["svg"],
  "image/gif" => ["gif"]
}

import_config "#{config_env()}.exs"
