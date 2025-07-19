# Clab

## Versions management
Proper versions for Elixir & Erlang are specified in the .tool-versions file.

Recommended usage & installation through asdf (https://asdf-vm.com/)

## Deployment in production
Assuming you already have installed versions for elixir & react specified in the .tool-versions file, and node & npm are installed with a sufficiently modern version.

```
mix deps.get

npm install

npm run build

mix release --overwrite

_build/dev/rel/clab/bin/clab start
```
# renew certificates

```certbot renew``` génère un fichier privkey.pem et fullchain.pem dont le contenu est à copier dans les fichiers privkey.pem et certificate.pem à la racine du repo quand on docker build
