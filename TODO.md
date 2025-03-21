- Injecter les secrets, API keys etc. autrement que via config.exs pour pouvoir push sur GIT

- Découper clab.ex en différent routers

- Compléter l'edition des infos persos (avatar, spés, etc.)

- Repasser sur tous les @TODO

- MIDDLEWARE AUTHENTIFICATION sur les api pour alléger

- Passer sur une BDD plutôt que les tables ets

- Prix de la session de coaching à créer par couple resa/user

- sécuriser la confirmation de paiement avec un secret dans le redirect URI (soit un secret unique, soit un secret par paiement pour être tranquille)

- Gérer les room types TWILIO en fonction du type de la session en créant les rooms de manière intelligente

- Permettre l'annulation d'une résa par un coach (après que des gens aient payé, empecher le paiement pour les suivants etc.)
=> contournement: prévenir ses coachés par mail de l'annulation, en replanifier manuellemeent une avec eux dont le prix sera à 0

- Gérer l'affichage des RDVs en fonction de leur durée sur l'agenda (par ex. garder 1 seul RDV par heure et gérer l'affichage via CSS)

- Gérer les factures de manière légale (donner un PDF aux clients plutôt qu'un lien, + sauvegarder le fichier pendant plusieurs années)

- Permettre aux coachs de définir une liste de prestations, durée + prix

- Activer noice cancellation de TWILIO AI: https://www.twilio.com/blog/introducing-noise-cancellation-for-twilio-video

- Quid de la fonctionnalité d'invitation des coachs pour les coachés ? n'a plus l'air implémenté => USELESS ?? Low Crit

- delayed Sup

- Switch Twilio JS SDK from CDN to NPM package !!

- Twilio pricing a changé, le SDK aussi du coup => TOUTE REU EST PAYANTE PAR PARTICIPANT, mais plus de fonctionnalités OotB

  # @TODO: add expiration to token (1 month ?)
  # @TODO: auto delete of very old tmp_files


# Augmentation avec l'IA

- IA Modération profils (avatars NSFW/hate, description, profils only fans like etc.)

- Au moment où on envoie un mail d'inscription aujd, on pourrait aussi si le user est un coaché et qu'il a renseigné une recherche pour un coach, on peut appeler un agent IA pour matcher ses critères avec un ou plusieurs coachs de notre BDD 

- Améliorations de l'audio/vidéo en post-processing (si pas trop couteux en temps ou en computing ?)

- 