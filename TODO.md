- Injecter les secrets, API keys etc. autrement que via config.exs pour pouvoir push sur GIT

- Découper clab.ex en différent routers

- Quid de la fonctionnalité d'invitation des coachs pour les coachés ? n'a plus l'air implémenté

- Compléter l'edition des infos persos (avatar, spés, etc.)

- Repasser sur tous les @TODO

- Passer sur une BDD plutôt que les tables ets

- Prix de la session de coaching à créer par couple resa/user

- sécuriser la confirmation de paiement avec un secret dans le redirect URI (soit un secret unique, soit un secret par paiement pour être tranquille)

- Gérer les room types TWILIO en fonction du type de la session en créant les rooms de manière intelligente

- Permettre l'annulation d'une résa par un coach (après que des gens aient payé, empecher le paiement pour les suivants etc.)
=> contournement: prévenir ses coachés par mail de l'annulation, en replanifier manuellemeent une avec eux dont le prix sera à 0

- Gérer l'affichage des RDVs en fonction de leur durée sur l'agenda (par ex. garder 1 seul RDV par heure et gérer l'affichage via CSS)

- Gérer les factures de manière légale (donner un PDF aux clients plutôt qu'un lien, + sauvegarder le fichier pendant plusieurs années)

- Activer noice cancellation de TWILIO AI: https://www.twilio.com/blog/introducing-noise-cancellation-for-twilio-video