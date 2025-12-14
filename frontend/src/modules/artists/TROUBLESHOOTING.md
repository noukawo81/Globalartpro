# 🔧 Dashboard Artiste - Guide de dépannage

## ❓ FAQ - Questions fréquemment posées

### Q1: Le bouton "Mon Dashboard" n'apparaît pas
**Causes possibles:**
- ❌ Vous n'êtes pas connecté → **Connectez-vous d'abord**
- ❌ `artistId` n'est pas en localStorage → **Vérifier auth flow**
- ❌ Route non ajoutée → **Vérifier routes.jsx**

**Solution:**
```javascript
// Vérifier dans DevTools Console
console.log(localStorage.getItem("artistId")); // Doit afficher un ID
console.log(localStorage.getItem("token"));    // Doit afficher un JWT
```

---

### Q2: Page blanche / rien ne s'affiche
**Causes possibles:**
- ❌ Route protégée redirige → **Connectez-vous**
- ❌ Erreur JavaScript → **Ouvrir console (F12)**
- ❌ CSS broken → **Vérifier styles inline**

**Solution:**
```bash
# 1. Ouvrir DevTools (F12)
# 2. Aller dans l'onglet Console
# 3. Vérifier les erreurs rouges
# 4. Exécuter:
> localStorage.clear()
> location.reload()
```

---

### Q3: Les rayons ne s'affichent pas
**Causes possibles:**
- ❌ CSS transform bugué → **Vérifier navigateur**
- ❌ JavaScript erreur → **Vérifier console**
- ❌ Écran trop petit → **Responsive pas bien**

**Solution:**
```javascript
// Dans ArtistDashboard.jsx, debug:
console.log("Nombre de rayons:", sections.length); // Doit être 6
console.log("Active section:", activeSection);      // Doit changer
```

---

### Q4: Les données ne s'actualisent pas
**Causes possibles:**
- ❌ Mock data statique → **C'est normal en dev**
- ❌ API non connectée → **À faire en Phase 2**
- ❌ Cache browser → **Vider cache (Ctrl+Shift+Delete)**

**Solution:**
```javascript
// Les données sont mockedDans AnalyticsDashboard.jsx
const analyticsData = {
  "7d": { /* mock data */ },
  // Remplacer par fetchAnalytics() une fois API prête
};
```

---

### Q5: Design responsive ne marche pas
**Causes possibles:**
- ❌ Pas de viewport meta → **Vérifier index.html**
- ❌ Résolution écran minuscule → **Utiliser DevTools mobile**
- ❌ CSS media queries missing → **À ajouter si nécessaire**

**Solution:**
```bash
# 1. Ouvrir DevTools (F12)
# 2. Cliquer sur responsive icon (device icon)
# 3. Tester sur différentes résolutions
# 4. Vérifier sur mobile réel si possible
```

---

## 🐛 Erreurs courantes et solutions

### Erreur: "Cannot read property 'artistId' of null"
```
CAUSE: localStorage.getItem("artistId") retourne null
SOLUTION: 
1. Vous connecter d'abord
2. Vérifier que le localStorage est rempli
3. Utiliser ProtectedRoute correctement
```

---

### Erreur: "api is not defined"
```
CAUSE: Import manquant
SOLUTION:
Ajouter en haut du fichier:
import api from "@/services/apiInterceptor";
```

---

### Erreur: "Cannot read property 'id' of undefined"
```
CAUSE: Section non trouvée dans le tableau
SOLUTION:
1. Vérifier que sectionId existe dans sections[]
2. Vérifier que SectionContent() gère ce section.id
```

---

### Erreur: "Module not found: @/modules/artists/pages/ArtistDashboard"
```
CAUSE: Chemin import incorrect
SOLUTION:
Vérifier que le fichier existe:
frontend/src/modules/artists/pages/ArtistDashboard.jsx
```

---

### Erreur: "Styling not working"
```
CAUSE: CSS-in-JS syntax
SOLUTION:
Vérifier que tous les styles sont des objets JavaScript
Pas de CSS externe, tout en inline styles
```

---

## 🔍 Debug avancé

### Étape 1: Vérifier la console
```javascript
// Ouvrir DevTools (F12) et exécuter:

// Vérifier auth
console.log("Auth:", {
  artistId: localStorage.getItem("artistId"),
  token: localStorage.getItem("token"),
  user: localStorage.getItem("user")
});

// Vérifier route
console.log("URL:", window.location.pathname);

// Vérifier state
// (À ajouter dans ArtistDashboard.jsx pour debug)
```

---

### Étape 2: Vérifier Network tab
```
DevTools > Network Tab
1. Filtrer par "api"
2. Voir les requêtes HTTP
3. Vérifier les codes de status
   - 200 ✅ OK
   - 401 ❌ Unauthorized
   - 404 ❌ Not found
   - 500 ❌ Server error
```

---

### Étape 3: Vérifier les props
```javascript
// Ajouter dans n'importe quel composant:
console.log("Props:", props);
console.log("State:", state);
console.log("Context:", context);
```

---

### Étape 4: Utiliser React DevTools
```
1. Installer React DevTools extension
2. F12 > Onglet "Components"
3. Explorer la hiérarchie
4. Voir les props/state de chaque composant
```

---

## 🛠️ Troubleshooting par section

### Section Œuvres ne s'affiche pas
```javascript
// Debug:
console.log(active?.id); // Doit être "artworks"
console.log(active?.subsections); // Doit avoir 4 items

// Solution:
// Vérifier que "artworks" existe dans sections[]
```

---

### Section Finances affiche mal les chiffres
```javascript
// Debug:
console.log("Balance:", artistData.balance);
console.log("Type:", typeof artistData.balance);

// Solution:
// S'assurer que c'est un nombre, pas une string
// Utiliser parseFloat() si nécessaire
```

---

### Onglets Analytics ne changent pas
```javascript
// Debug:
console.log("TimeRange:", timeRange); // Doit changer
console.log("Data:", analyticsData[timeRange]);

// Solution:
// S'assurer que useState fonctionne
// Vérifier que les boutons appellent setTimeRange()
```

---

## 📝 Checklist de dépannage

Quand ça marche pas, vérifier dans l'ordre:

- [ ] **Navigation**: Peut-on accéder à `/artist/:id/dashboard`?
- [ ] **Auth**: Êtes-vous connecté (localStorage.token existe)?
- [ ] **Route**: Est-ce que `/artist-dashboard` est dans routes.jsx?
- [ ] **Import**: Tous les imports sont-ils corrects?
- [ ] **Erreurs**: Console (F12) affiche-t-elle des erreurs?
- [ ] **Responsive**: Testez en mobile mode (DevTools)
- [ ] **Cache**: Avez-vous vidé le cache browser?
- [ ] **Build**: Avez-vous fait `npm run dev` récemment?

---

## 🚀 Performance debugging

### App lente?
```javascript
// 1. Vérifier les re-renders
console.log("ArtistDashboard re-rendered");

// 2. Utiliser React Profiler
// DevTools > Profiler tab > record

// 3. Vérifier les fetches API
// DevTools > Network tab

// 4. Ajouter Memoization si nécessaire
```

---

### Beaucoup de rayons = lent?
```javascript
// Solution: Lazy load les sections
const SectionContent = React.lazy(() => 
  Promise.resolve(activeSection === "artworks" ? ... : ...)
);
```

---

## 🔐 Security debugging

### Token expiré?
```javascript
// Vérifier le token:
console.log("Token:", localStorage.getItem("token"));

// Décoder (site: jwt.io):
// Copier le token et vérifier l'expiration
```

---

### Authentification échouée?
```javascript
// Vérifier apiInterceptor:
// DevTools > Network > Voir Authorization header
// Doit avoir: "Bearer YOUR_JWT_TOKEN"
```

---

## 📱 Mobile debugging

### Version mobile cassée?
```
1. DevTools (F12) > Toggle device toolbar (Ctrl+Shift+M)
2. Sélectionner iPhone, Android, etc.
3. Tester chaque section
4. Vérifier overflow, tap targets, etc.
```

---

### Geste touch ne marche pas?
```javascript
// Pour tester les events touch:
element.addEventListener("touchstart", () => {
  console.log("Touch detected");
});
```

---

## 🎨 Style debugging

### Couleurs pas bonnes?
```javascript
// Vérifier les hex colors:
console.log("Color palette:", {
  artworks: "#FF6B6B",
  gapstudio: "#4ECDC4",
  // etc...
});
```

---

### Layout cassé?
```javascript
// Ajouter des bordures temporaires:
style={{
  ...styles.container,
  border: "2px red solid" // Debug border
}}
```

---

## 📞 Quand tout échoue

**Étapes finales:**

1. ✅ `npm run dev` - Redémarrer le dev server
2. ✅ `ctrl+shift+delete` - Vider le cache
3. ✅ `F5` - Rafraîchir la page
4. ✅ Fermer/réouvrir le navigateur
5. ✅ Vérifier les logs backend
6. ✅ Redémarrer tout (terminal, navigateur, VS Code)

**Si toujours pas bon:**
- 📝 Créer un ticket de bug avec:
  - URL exact
  - Erreur exacte (copie de console)
  - Steps to reproduce
  - Expected vs Actual result
  - Screenshots/videos

---

## 🎓 Ressources de debug

- [React DevTools](https://chrome.google.com/webstore)
- [Redux DevTools](https://chrome.google.com/webstore)
- [Network Throttling](https://developers.google.com/web/tools)
- [JSDebugger](https://learn.javascript.ru/)

---

## 💡 Tips pour déboguer rapidement

```javascript
// 1. Log raccourci
const log = (...args) => console.log(...args);
log("Debug:", data);

// 2. Breakpoint in code
debugger; // Mettre en pause à ce point

// 3. Conditional logging
if (process.env.NODE_ENV === "development") {
  console.log("Dev mode - debug info");
}

// 4. Time measurement
console.time("fetch");
// ... code ...
console.timeEnd("fetch");

// 5. Group logs
console.group("Section Data");
  console.log("Name:", section.name);
  console.log("Color:", section.color);
console.groupEnd();
```

---

**Dernière mise à jour**: 11 Décembre 2025  
**Version**: 1.0
