# ⚡ TECH COMPENDIUM // Cyberpunk RED & Savage Worlds Interface Zéro 2.0

> **Catalogue & Calculateur Tactique de Matériel, Armes & Cybermatériel (Night City & Malmart 2090)**

Application web interactive pour les jeux de rôle sur table **Cyberpunk RED** et **Savage Worlds Adventure Edition (SWADE) / Interface Zéro 2.0**.

---

## 🚀 Déploiement sur GitHub Pages (En 2 clics)

Le projet est configuré pour être déployé automatiquement sur **GitHub Pages** grâce au workflow GitHub Actions inclus (`.github/workflows/deploy.yml`).

### Étapes d'activation :

1. **Poussez ce projet sur votre dépôt GitHub** (branche `main` ou `master`).
2. Rendez-vous sur votre dépôt dans **Settings** ➔ **Pages**.
3. Dans la section **Build and deployment** :
   - Sous **Source**, sélectionnez **GitHub Actions** (au lieu de *Deploy from a branch*).
4. Le workflow se lance automatiquement à chaque `push`.
5. Votre application sera disponible en direct sur :  
   `https://<votre-nom-utilisateur>.github.io/<nom-du-depot>/`

---

## 🛠️ Fonctionnalités Spéciales GitHub Pages

- **Chemins relatifs universels (`base: './'`)** : L'application fonctionne aussi bien à la racine d'un domaine personnalisé que dans un sous-dossier de dépôt GitHub Pages (`/mon-depot/`).
- **Support SPA / Fallback 404 (`dist/404.html`)** : Les rechargements de page et navigations directes sont gérés sans erreur 404.
- **Proxy d'Images CDN sécurisé** : Les illustrations d'équipements sont automatiquement acheminées sans blocage CORS/Referrer sur GitHub Pages.
- **Uplink GitHub & Synchronisation Gist sans serveur** :
  - Sur GitHub Pages, ouvrez le modal **GitHub Uplink** (dans la barre d'outils).
  - Utilisez un **Personal Access Token (PAT)** GitHub avec la permission `gist`.
  - Vous pouvez sauvegarder vos paquetages sous forme de Gists complets (`tech-compendium-loadout.json` + `README.md` formaté) ou importer n'importe quel Gist/fichier JSON distant en 1 clic.

---

## 💻 Développement Local

```bash
# 1. Installer les dépendances
npm install

# 2. Démarrer le serveur de développement local (port 3000)
npm run dev

# 3. Lancer les tests unitaires
npx tsx --test src/utils/gearLogic.test.ts src/utils/githubService.test.ts

# 4. Compiler pour la production (génère dist/ et dist/404.html)
npm run build
```

---

## 📋 Fonctionnalités du Compendium

- **Base de données de 325 matériels dédoublonnés** : Armes de poing, fusils, armes lourdes, cybermatériel, blindages, drones, T-APP & consommables.
- **Double affichage des règles** : Basculez entre règles hybrides, Cyberpunk RED uniquement ou SWADE / Interface Zéro 2.0.
- **Calculateur de Paquetage Netrunner** : Calcul automatique du poids total, prix en Eurodollars (€$), Crédits (c$) et charge de Cybertension.
- **Simulateur de Dés Intégré** : D10 Cyberpunk RED (avec jets critiques) et dés explosifs Savage Worlds avec joker Wild Die d6.
- **Comparateur Côte à Côte** : Comparez 2 armes ou implants en temps réel.
- **Filtre Audio & Scanlines CRT** : Ambiance rétro-cyberpunk avec effets sonores Web Audio API et balayage phosphore commutable.
