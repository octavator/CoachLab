import Config

config :clab,
  env: :dev,
  test_key: "test value"

import_config "#{config_env()}.exs"
