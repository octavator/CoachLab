{application,clab,
             [{modules,['Elixir.Agenda','Elixir.AutoMailer','Elixir.Clab',
                        'Elixir.Clab.Application','Elixir.Clab.AuthPlug',
                        'Elixir.Clab.FallbackRouter','Elixir.Clab.Mailer',
                        'Elixir.Clab.ProtectedRouter',
                        'Elixir.Clab.PublicRouter','Elixir.Clab.Router',
                        'Elixir.DataSaver','Elixir.ImageMover','Elixir.Jwt',
                        'Elixir.Reservation','Elixir.Stripe',
                        'Elixir.StripeApi','Elixir.Twilio','Elixir.TwilioApi',
                        'Elixir.User','Elixir.Utils']},
              {compile_env,[{clab,[max_upload_file_size],error},
                            {clab,[stripe],
                                  {ok,#{url =>
                                            <<"https://api.stripe.com/v1/">>,
                                        test_sid =>
                                            <<"pk_test_51LK7W0DPLkquZzcad6zgw8FB7qrjWzcZstCLnaqCsht6n1QELcIvNXbpUA7EkCfdU226HrNKNoSUAXVJiBAveRXl00sZzpzTHO">>,
                                        test_secret =>
                                            <<"sk_test_51LK7W0DPLkquZzca1QxqnYrijHZKdn2k8ACuTlBfwTFkjfhO1c4VIRJzeMtqofmX2c32nCqQg4gg1Gr1qdEjI8Ep00RNMs6YDp">>,
                                        test_mode => true,
                                        live_secret => <<"sk_azerty">>}}},
                            {clab,[twilio],
                                  {ok,#{name => <<"clab-test">>,
                                        url =>
                                            <<"https://video.twilio.com/v1/">>,
                                        secret =>
                                            <<"BdTj70ASVynmNuUWYWraE35imHVqyEcF">>,
                                        account_sid =>
                                            <<"ACe1e6e2732527a4d5e37c9194fdf4095d">>,
                                        account_secret =>
                                            <<"7a21efb9e357e451b295591ced0c3254">>,
                                        sid =>
                                            <<"SKed2b73fe00dff7739b4eb7a75ef06066">>}}}]},
              {optional_applications,[]},
              {applications,[kernel,stdlib,elixir,logger,crypto,eex,plug,
                             cowboy,plug_cowboy,poison,mailibex,gen_smtp,
                             joken,httpoison,hackney,timex]},
              {description,"clab"},
              {registered,[]},
              {vsn,"0.1.0"},
              {mod,{'Elixir.Clab.Application',[]}}]}.
