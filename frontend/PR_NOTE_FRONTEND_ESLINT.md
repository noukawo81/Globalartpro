# Note de PR — Corrections ESLint & Build

**Contexte**: Nettoyage ciblé ESLint sur pages admin/museum, `ArtistProfile`, `Toast`, `ModalPremium` et `MarketplaceHome` pour éliminer warnings et erreurs de parsing.

**Modifs principales**:
- Fix des dépendances de hooks (`useEffect` → `useCallback` / dépendances ajoutées).
- Suppression de duplication de `MOCK_DATA` dans `MarketplaceHome`.
- Correction de parsing (`ModalPremium`) et ajout de la dépendance `onClose` dans `Toast`.
- Amélioration du formulaire d'upload de `ArtistProfile` pour un upload plus robuste (sélection de fichier stockée en `state`).
- Ajout d'une validation côté client du token via `GET /api/auth/me` avant les actions de partage / mise en vente.

**Tests / Build**:
- Lint : `npm run lint` — plus d'erreurs bloquantes dans le frontend.
- Build : `npm run build` — build de production réussie (Vite). Avertissement non bloquant concernant l'import dynamique de `services/api.js`.
- Backend : tests unitaires/integration passés localement (`npm test`) — toutes les suites passées.

**Notes importantes**:
- Backend: ajout d'un stockage JSON persistant pour les utilisateurs (`backend/src/lib/userDB.js`) et ajout de l'endpoint `GET /api/auth/me` pour valider un token côté client.
- Le push du backend a été bloqué par le scan de secrets GitHub (push protection) — une précédente commit contient un secret détecté et bloque le push de la branche. Solution : supprimer le secret des commits concernés (history rewrite) ou débloquer via la page de sécurité GitHub (lien ajouté dans l'erreur de push). Je peux aider à purger le secret si vous me confirmez.

**Actions demandées**:
- Lancer CI sur la PR frontend et reviewer: @noukawo81
- Pour le backend : autoriser/débloquer le push sur GitHub (ou me valider pour réécrire l'historique pour retirer le secret)

Labels suggérés: `frontend`, `lint`, `ci:pending`.

---

Si vous voulez, je peux poster ce texte directement dans la PR (nécessite `gh` ou accès GitHub), ou je peux l'ajouter comme commentaire si vous préférez garder la PR description manuelle.
