import Config

config :clab,
  env: :prod,
  test_key: "production value",
  url: "https://clab.azurewebsites.net",
  stripe: %{
    url: "https://api.stripe.com/v1/",
    test_sid: "make_your_own;)",
    test_secret: "same_here,use_your_own!",
    test_mode: false
  }
