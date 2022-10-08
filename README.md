# Clab

**TODO: Add description**


## Server

Server runs on port 4001 in http in local dev and in https on port 443 in deployed environment (preprod and production)
Environment is defined in config file

## Installation

If [available in Hex](https://hex.pm/docs/publish), the package can be installed
by adding `clab` to your list of dependencies in `mix.exs`:

```elixir
def deps do
  [
    {:clab, "~> 0.1.0"}
  ]
end
```

Documentation can be generated with [ExDoc](https://github.com/elixir-lang/ex_doc)
and published on [HexDocs](https://hexdocs.pm). Once published, the docs can
be found at [https://hexdocs.pm/clab](https://hexdocs.pm/clab).

## Webpack

to compile changes to js & html
```npm run build```

# renew certificates

```certbot renew``` génère un fichier privkey.pem et fullchain.pem dont le contenu est à copier dans les fichiers privkey.pem et certificate.pem à la racine du repo quand on docker build