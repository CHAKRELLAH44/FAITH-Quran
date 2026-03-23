# NŪR — Plateforme Coran Interactive
## Guide Complet pour VSCode

---

## 📁 STRUCTURE DU PROJET

```
-quran/
├── app/
│   ├── globals.css          ← Design global (couleurs, fonts, animations)
│   ├── layout.jsx           ← Layout racine Next.js
│   └── page.jsx             ← Page principale (orchestrateur)
├── components/
│   ├── LoginScreen.jsx      ← Écran de connexion
│   ├── Topbar.jsx           ← Barre de navigation
│   ├── Notification.jsx     ← Toast de notification
│   ├── SurahCard.jsx        ← Carte d'une sourate
│   ├── HomePage.jsx         ← Grille des 114 sourates
│   ├── SurahDetail.jsx      ← Page détail (lecture + explication)
│   ├── FavoritesPage.jsx    ← Page favoris
│   └── ProgressPage.jsx     ← Page suivi de lecture
├── lib/
│   ├── surahs.js            ← Données des 114 sourates
│   ├── quranApi.js          ← Appels API Al-Quran Cloud
│   └── useStore.js          ← État global (localStorage)
├── package.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## 🚀 INSTALLATION (étape par étape)

### 1. Créer le dossier
```bash
mkdir nur-quran
cd nur-quran
```

### 2. Copier tous les fichiers
Copiez chaque fichier depuis ce guide dans les dossiers correspondants.

### 3. Installer les dépendances
```bash
npm install
```

### 4. Lancer en développement
```bash
npm run dev
```

### 5. Ouvrir dans le navigateur
```
http://localhost:3000
```

---

## ⚙️ FONCTIONNEMENT

### État (localStorage)
- Chaque utilisateur a ses données sauvegardées sous la clé `nur_<username>`
- Format : `{ favorites: [1, 18, 36], read: [1, 2, 5] }`
- Pas de backend requis — tout est local

### APIs utilisées
| API | URL | Usage |
|-----|-----|-------|
| Al-Quran Cloud | `api.alquran.cloud/v1` | Texte arabe + traductions |
| Anthropic Claude | `api.anthropic.com/v1/messages` | Explications IA |

### Navigation (pages)
| Page | Description |
|------|-------------|
| `home` | Grille des 114 sourates |
| `detail` | Lecture + Explication d'une sourate |
| `favorites` | Sourates mises en favoris |
| `progress` | Suivi de lecture avec anneau |

---

## 🎨 DESIGN — Variables CSS

```css
--bg-deep:        #0a0a0c   /* Fond principal noir */
--bg-card:        #111116   /* Fond des cartes */
--gold:           #c9a84c   /* Or principal */
--gold-light:     #e8c97a   /* Or clair (texte arabe) */
--gold-dim:       #7a6230   /* Or sombre (accents) */
--text-primary:   #f0ead6   /* Texte principal blanc cassé */
--text-secondary: #a09070   /* Texte secondaire */
--text-dim:       #5a5040   /* Texte discret */
--border:         rgba(201,168,76,0.15)  /* Bordure discrète */
--border-bright:  rgba(201,168,76,0.40)  /* Bordure visible */
--glow:           rgba(201,168,76,0.08)  /* Fond lumineux */
```

### Polices
- **Cinzel** → Titres, numéros (élégant, latin)
- **Amiri** → Texte arabe (calligraphie)
- **Lato** → Texte courant (lisible)

---

## 🔧 PERSONNALISATION

### Changer la langue d'explication (IA)
Dans `SurahDetail.jsx`, modifiez le prompt :
```js
content: `Génère une explication en ARABE pour la sourate...`
```

### Ajouter une traduction
Dans `quranApi.js`, ajoutez une édition :
```js
// Éditions disponibles sur api.alquran.cloud
const edition = lang === 'fr' ? 'fr.hamidullah' :
                lang === 'ar.muyassar' ? 'ar.muyassar' :
                'en.sahih'
```

### Modifier les filtres
Dans `HomePage.jsx` :
```js
// Changer les seuils short/long
filter === 'short' ? s.ayahs <= 20 :    // ← modifier ici
filter === 'long'  ? s.ayahs > 100 :    // ← modifier ici
```

---

## 🌐 DÉPLOIEMENT VERCEL (gratuit)

```bash
# 1. Installer Vercel CLI
npm install -g vercel

# 2. Se connecter
vercel login

# 3. Déployer
vercel --prod
```

Ou directement sur vercel.com :
1. Push votre code sur GitHub
2. Importer le repo sur vercel.com
3. Déploiement automatique ✅

---

## ❓ PROBLÈMES FRÉQUENTS

| Problème | Solution |
|----------|----------|
| `Module not found` | Vérifiez les chemins d'import (`../lib/` vs `./lib/`) |
| Texte arabe ne s'affiche pas | Vérifiez la police Amiri dans `globals.css` |
| API ne répond pas | L'API alquran.cloud peut être lente, attendez quelques secondes |
| Explication IA vide | La clé API Anthropic est gérée automatiquement par claude.ai |
| Favoris perdus | Les données sont liées au `username` exact entré à la connexion |

---

## 📦 VERSIONS

```json
{
  "next": "14.2.3",
  "react": "^18",
  "tailwindcss": "^3.4.3"
}
```
