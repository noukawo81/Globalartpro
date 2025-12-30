# Marketplace & Portal: endpoints rapides

Objectif: permettre à un artiste de partager ses médias sur la Marketplace ou le Portail culturel, et permettre à l'équipe GlobalArtPro (admin) d'exposer des œuvres dans le musée virtuel.

## Endpoints principaux (backend)

- POST /api/marketplace/list
  - Auth: JWT
  - Ownership: `ownerAuth({ body: 'artistId' })` (l'artiste doit être celui authentifié)
  - Body: `{ artistId, mediaId, title, description, price, token = 'ARTC', pole = 'digital', channel = 'marketplace' }`
  - Réponse: `{ listing }`

- GET /api/marketplace/list
  - Returns: `{ listings: [...] }`

- POST /api/marketplace/:id/exhibit
  - Auth: JWT
  - Only admin can call (req.user.role === 'admin')
  - Marke listing as `exhibited: true` and add `exhibitedAt` timestamp

- POST /api/portal/share
  - Auth: JWT
  - Ownership: `ownerAuth({ body: 'artistId' })`
  - Body: `{ artistId, mediaId, title, description, link }`
  - Réponse: `{ post }`

- GET /api/portal/posts
  - Retourne les posts du portail: `{ posts: [...] }`

## Frontend helpers

- `api.createListing(payload)` → POST `/marketplace/list`
- `api.getMarketplaceListings()` → GET `/marketplace/list`
- `api.exhibitListing(listingId)` → POST `/marketplace/:id/exhibit`
- `api.shareToPortal(payload)` → POST `/portal/share`
- `api.getPortalPosts()` → GET `/portal/posts`

## Notes de vérification rapide

1. Après inscription, l'utilisateur est redirigé vers `/artist/:id` (profil) — bouton `🎨 Mon Dashboard` propose d'aller au dashboard ensuite.
2. Depuis le profil, l'artiste peut télécharger un média et:
   - Le partager sur la marketplace via `Mettre en vente` (crée une annonce)
   - Le partager sur le portail via `Partager` (crée un post)
3. Seul un compte avec `role: 'admin'` peut marquer une annonce `exhibited` (exposition musée).

Si vous voulez, je peux: ajouter des tests CI pour exécuter ces tests automatiquement, ou créer une page d'administration pour gérer les sélections muséales.