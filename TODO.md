- Redirection sur page Connexion si 403, puis au sign in rediriger sur la page qu'il voulait voir en premier lieu

- Injecter les secrets, API keys etc. autrement que via config.exs pour pouvoir push sur GIT

- Repasser sur tous les @TODO

- Passer sur une BDD plutôt que les tables ets

- sécuriser la confirmation de paiement avec un secret dans le redirect URI (un secret par paiement pour être tranquille)

- Permettre l'annulation d'une résa par un coach (après que des gens aient payé, empecher le paiement pour les suivants etc.)
=> contournement: prévenir ses coachés par mail de l'annulation, en replanifier manuellemeent une avec eux dont le prix sera à 0

- Gérer l'affichage des RDVs en fonction de leur durée sur l'agenda (par ex. garder 1 seul RDV par heure et gérer l'affichage via CSS)
=> En tout cas, agenda buggé pour l'instant, on eput prendre un créneau d'une heure 30 sur 

- Permettre aux coachs de définir une liste de prestations, durée + prix

- delayed Sup => galère ? :o faudra tester en tt cas

- Twilio pricing a changé, le SDK aussi du coup => TOUTE REU EST PAYANTE PAR PARTICIPANT, mais plus de fonctionnalités OotB

- Compléter l'edition des infos persos (avatar, spés, etc.)

- Obliger à rajouter un coaché sur création de RDV sur mon propre agenda ? Pas de création de mon propre chef ? => Le cas échéant, pas de lien de paiement sur la visualisation d'un RDV pris pour un coaché

- Gérer les factures de manière légale (donner un PDF aux clients plutôt qu'un lien, + sauvegarder le fichier pendant plusieurs années)

- Prix de la session de coaching à créer par couple resa/user ?

- Switch Twilio JS SDK from CDN to NPM package !!

  # @TODO: add expiration to token (1 month ?)
  # @TODO: auto delete of very old tmp_files


# Augmentation avec l'IA

- IA Modération profils (avatars NSFW/hate, description, profils only fans like etc.)

- Au moment où on envoie un mail d'inscription aujd, on pourrait aussi si le user est un coaché et qu'il a renseigné une recherche pour un coach, on peut appeler un agent IA pour matcher ses critères avec un ou plusieurs coachs de notre BDD 

- Améliorations de l'audio/vidéo en post-processing (si pas trop couteux en temps ou en computing ?)

- 