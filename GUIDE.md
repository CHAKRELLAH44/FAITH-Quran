# 🕌 NŪR — Guide Complet de Développement

## Structure du Projet

```
nur-quran/
├── app/
│   ├── globals.css          ← Design, variables CSS, animations
│   ├── layout.jsx           ← Root layout Next.js
│   └── page.jsx             ← Page principale (orchestrateur)
├── components/
│   ├── LoginScreen.jsx      ← Écran de connexion
│   ├── Topbar.jsx           ← Barre de navigation fixe
│   ├── HomePage.jsx         ← Grille des 114 sourates
│   ├── SurahCard.jsx        ← Carte d'une sourate
│   ├── SurahDetail.jsx      ← Page détail (lecture + explication)
│   ├── FavoritesPage.jsx    ← Page favoris
│   ├── ProgressPage.jsx     ← Page suivi de lecture
│   └── Notification.jsx     ← Toast de notification
├── lib/
│   ├── surahs.js            ← Données des 114 sourates (offline)
│   ├── quranApi.js          ← Appels API Al-Quran Cloud
│   └── useStore.js          ← Hook état global (localStorage)
├── package.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## 1. Installation

### Prérequis
- **Node.js** v18+ → https://nodejs.org
- **VS Code** → https://code.visualstudio.com

### Étapes

```bash
# 1. Créer le dossier du projet
mkdir nur-quran
cd nur-quran

# 2. Copier tous les fichiers fournis dans ce dossier

# 3. Installer les dépendances
npm install

# 4. Lancer le serveur de développement
npm run dev

# 5. Ouvrir dans le navigateur
# → http://localhost:3000
```

---

## 2. Extensions VS Code Recommandées

Installe ces extensions dans VS Code :

| Extension | Utilité |
|-----------|---------|
| **ES7+ React/Redux/React-Native snippets** | Raccourcis JSX |
| **Tailwind CSS IntelliSense** | Autocomplétion Tailwind |
| **Prettier** | Formatage automatique |
| **Auto Rename Tag** | Renommer balises HTML/JSX |

---

## 3. Architecture — Comment ça fonctionne

### Flux de données

```
page.jsx (App)
   ├── useStore.js  ← état global : username, favorites[], read[]
   ├── surahs.js    ← 114 sourates en dur (pas besoin d'API)
   │
   ├── LoginScreen  → onLogin() → store.login()
   ├── Topbar       ← read[], username, page
   ├── HomePage     ← SURAHS + isFav/isRead → onOpen(num)
   ├── SurahDetail  ← surah + toggle callbacks
   │     ├── quranApi.js  → fetch Arabic ayat
   │     ├── quranApi.js  → fetch traduction FR/EN
   │     └── Claude API   → génère l'explication
   ├── FavoritesPage← favorites[]
   └── ProgressPage ← read[]
```

### Stockage local (localStorage)

Les données sont sauvegardées dans le navigateur sous la clé `nur_[username]` :

```json
{
  "favorites": [1, 18, 36, 55],
  "read": [1, 112, 113, 114]
}
```

---

## 4. APIs utilisées

### Al-Quran Cloud API (gratuite, sans clé)

```
GET https://api.alquran.cloud/v1/surah/{numero}
     → Texte arabe de la sourate

GET https://api.alquran.cloud/v1/surah/{numero}/fr.hamidullah
     → Traduction française

GET https://api.alquran.cloud/v1/surah/{numero}/en.sahih
     → Traduction anglaise
```

### Anthropic Claude API (pour les explications)

L'appel est fait depuis `SurahDetail.jsx` → fonction `loadExplanation()`.

> ⚠️ En développement local, le navigateur envoie la requête directement.
> En production, il faut créer une **API Route Next.js** pour ne pas exposer la clé.

---

## 5. Ajouter une Clé API Anthropic (Production)

### Étape 1 — Créer le fichier `.env.local`

```bash
# nur-quran/.env.local
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxx
```

### Étape 2 — Créer la Route API

Crée le fichier `app/api/explain/route.js` :

```js
import { NextResponse } from 'next/server'

export async function POST(req) {
  const { surahNumber, englishName, arabicName, translation } = await req.json()

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Génère une explication structurée en français pour la sourate ${surahNumber} du Coran : "${englishName}" (${arabicName} - ${translation}).

Fournis exactement ce format JSON (rien d'autre) :
{
  "context": "Contexte de révélation (Asbāb an-Nuzūl) en 3-4 phrases",
  "theme": "Thème principal en 2-3 phrases",
  "message": "Message clé et importance de cette sourate en 3-4 phrases",
  "key_verse_arabic": "Un verset représentatif en arabe",
  "key_verse_fr": "Traduction française de ce verset",
  "virtue": "Vertu ou bienfait de cette sourate"
}`,
      }],
    }),
  })

  const data = await res.json()
  const text = data.content?.map(c => c.text || '').join('') || ''
  const info = JSON.parse(text.replace(/```json|```/g, '').trim())
  return NextResponse.json(info)
}
```

### Étape 3 — Modifier SurahDetail.jsx

Dans `loadExplanation()`, remplace l'URL :

```js
// AVANT (direct, sans clé)
const res = await fetch('https://api.anthropic.com/v1/messages', { ... })

// APRÈS (via route API sécurisée)
const res = await fetch('/api/explain', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    surahNumber: surah.number,
    englishName: surah.englishName,
    arabicName:  surah.name,
    translation: surah.translation,
  }),
})
const info = await res.json()
```

---

## 6. Déploiement sur Vercel (Gratuit)

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Déployer
vercel

# 3. Ajouter la clé API dans Vercel Dashboard
# → Settings → Environment Variables
# → ANTHROPIC_API_KEY = sk-ant-...
```

Ou directement depuis GitHub :
1. Push ton projet sur GitHub
2. Va sur https://vercel.com
3. "Import Project" → sélectionne ton repo
4. Ajoute `ANTHROPIC_API_KEY` dans les variables d'environnement
5. Deploy ✅

---

## 7. Personnalisations possibles

### Changer les couleurs (globals.css)

```css
:root {
  --gold:       #c9a84c;   ← Couleur principale dorée
  --gold-light: #e8c97a;   ← Textes arabes
  --gold-dim:   #7a6230;   ← Accents sombres
  --bg-deep:    #0a0a0c;   ← Fond principal
  --bg-card:    #111116;   ← Fond des cartes
}
```

### Ajouter l'audio (récitation)

Dans `SurahDetail.jsx`, ajoute un bouton audio :

```jsx
// API audio gratuite : https://cdn.islamic.network/quran/audio/
const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${surah.number}.mp3`

<audio controls src={audioUrl} style={{ width: '100%', marginBottom: 24 }} />
```

### Changer le récitateur

```
ar.alafasy      → Mishary Alafasy
ar.abdurrahmaansudais → Soudais
ar.husary       → Husary
```

---

## 8. Commandes utiles

```bash
npm run dev      # Développement (localhost:3000)
npm run build    # Build production
npm run start    # Lancer le build en local
```

---

## 9. Dépannage

| Problème | Solution |
|----------|----------|
| `Module not found` | Vérifier les chemins `../lib/` et `../components/` |
| Texte arabe mal affiché | Vérifier le chargement de la police `Amiri` dans globals.css |
| API Al-Quran ne répond pas | CORS ? Essayer avec VPN ou vérifier la connexion |
| Explication IA ne charge pas | Vérifier la clé API Anthropic dans `.env.local` |
| localStorage vide après refresh | Normal — se reconnecter avec le même prénom |

---

## ✦ Résumé des fichiers à créer

| Fichier | Lignes | Rôle |
|---------|--------|------|
| `app/globals.css` | ~180 | Tout le design CSS |
| `app/layout.jsx` | ~12 | Layout Next.js |
| `app/page.jsx` | ~100 | Orchestrateur principal |
| `lib/surahs.js` | ~120 | Données 114 sourates |
| `lib/quranApi.js` | ~25 | Appels API Coran |
| `lib/useStore.js` | ~55 | État global |
| `components/LoginScreen.jsx` | ~90 | Connexion |
| `components/Topbar.jsx` | ~75 | Navigation |
| `components/SurahCard.jsx` | ~80 | Carte sourate |
| `components/HomePage.jsx` | ~120 | Grille principale |
| `components/SurahDetail.jsx` | ~220 | Détail + onglets |
| `components/FavoritesPage.jsx` | ~65 | Page favoris |
| `components/ProgressPage.jsx` | ~100 | Suivi lecture |
| `components/Notification.jsx` | ~35 | Toast |

**Total : ~1300 lignes de code**
