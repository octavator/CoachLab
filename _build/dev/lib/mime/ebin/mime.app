{application,mime,
             [{modules,['Elixir.MIME']},
              {compile_env,[{mime,[extensions],error},
                            {mime,[suffixes],error},
                            {mime,[types],
                                  {ok,#{<<"application/pdf">> => [<<"pdf">>],
                                        <<"image/gif">> => [<<"gif">>],
                                        <<"image/jpeg">> =>
                                            [<<"jpg">>,<<"jpeg">>],
                                        <<"image/png">> => [<<"png">>],
                                        <<"image/svg+xml">> =>
                                            [<<"svg">>]}}}]},
              {optional_applications,[]},
              {applications,[kernel,stdlib,elixir,logger]},
              {description,"A MIME type module for Elixir"},
              {registered,[]},
              {vsn,"2.0.6"},
              {env,[]}]}.
