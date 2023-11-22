import Config

config :clab,
  env: :prod,
  test_key: "production value",
  # @TODO: change url for Azure's
  url: "https://clab.azurewebsites.net",
  stripe: %{
    url: "https://api.stripe.com/v1/",
    #@TODO: prod keys
    test_sid: "pk_test_51LK7W0DPLkquZzcad6zgw8FB7qrjWzcZstCLnaqCsht6n1QELcIvNXbpUA7EkCfdU226HrNKNoSUAXVJiBAveRXl00sZzpzTHO",
    test_secret: "sk_test_51LK7W0DPLkquZzca1QxqnYrijHZKdn2k8ACuTlBfwTFkjfhO1c4VIRJzeMtqofmX2c32nCqQg4gg1Gr1qdEjI8Ep00RNMs6YDp",
    test_mode: false
  }
