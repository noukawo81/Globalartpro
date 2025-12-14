Validation des IDs côté backend

Résumé:
- Toutes les routes qui modifient l'état (PUT, POST media, POST invite, transfers, buy) nécessitent désormais une authentification JWT et vérifient que `req.user.id` correspond à l'`id`/`userId` transmis (ou utilisé par défaut).
- `artists.js`: PUT /:id, POST /:id/media, POST /:id/invite -> requièrent `jwtAuth` et `req.user.id === id`.
- `marketplace.js` (/buy): vérifie que `buyer === req.user.id` et s'assure que `sellerId` existe (quand ce n'est pas `marketplace-seller`).
- `wallet.js`: `send`, `deposit`, `nft/mint` et autres actions nécessitent `jwtAuth` et `userId === req.user.id`.
- `artc.js`: `transfer`/`start`/`status`/`claim` requièrent `jwtAuth` et `userId/fromUserId` doit correspondre au token.
- `portal.js`: `buy` vérifie que le `userId` correspond au token.

Tests d'intégration ajoutés (backend/test/integration):
- `artist-ownership.test.js`: vérifie que PUT /:id, POST invite & POST media exigent que le JWT corresponde à l'artiste.
- `wallet-transfer.test.js`: vérifie que POST /wallet/send exige que fromUserId corresponde au token.
- `marketplace-buy.test.js`: vérifie que POST /marketplace/buy exige que buyer corresponde au token et que seller existe.
- `artc-ownership.test.js`: vérifie ownership sur ARTC endpoints.

Comment exécuter les tests (local):

1. Positionnez-vous dans le dossier backend

  cd backend

2. Installez les dépendances (peut nécessiter accès Internet):

  npm install

3. Lancez les tests:

  npm test

Notes:
- Les tests utilisent un JWT construit avec `process.env.JWT_SECRET || 'secret'`.
- Les tests écrivent des données temporaires sous `backend/data` et conservent l'état actuel (pas de nettoyage automatique).
- En cas d'erreur `minio` non disponible lors de l'installation, vous pouvez commenter la dépendance ou installer une version compatible.

Si vous voulez que je :
- Ajoute des tests supplémentaires pour les endpoints `portal`, `gapstudio` etc.
- Remplace l'approche `local JSON DB` par une DB in-memory pour rendre les tests plus propres.
- Ajoute un script `scripts/test:ci` pour exécuter uniquement l'ensemble d'intégration.

Dites-moi ce que vous préférez et je l'ajoute.
