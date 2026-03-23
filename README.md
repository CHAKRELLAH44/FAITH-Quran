# نور · FAITH Quran

> Une plateforme web immersive dédiée au Noble Coran — lecture, compréhension et suivi personnel.



---

## ✦ Aperçu

**FAITH Quran** est une application Progressive Web App (PWA) permettant de lire les 114 sourates du Coran, d'en comprendre le sens grâce à l'intelligence artificielle, et de suivre sa progression de lecture — en arabe, français ou anglais.

---

## ✦ Fonctionnalités

### 📖 Lecture
- Les 114 sourates avec texte arabe complet
- Traduction en **français** et **anglais**
- Bismillah affiché automatiquement (sauf At-Tawbah)
- Numérotation élégante de chaque verset

### 📚 Explication par IA
- Contexte de révélation *(Asbāb an-Nuzūl)*
- Thème principal et message clé
- Verset représentatif avec traduction
- Vertus et bienfaits de la sourate
- Disponible en **arabe**, **français** et **anglais**

### ⭐ Favoris & Suivi
- Marquer des sourates comme favorites
- Marquer les sourates lues
- Anneau de progression visuel
- Données sauvegardées dans Supabase

### 🛡 Dashboard Admin
- Statistiques globales (utilisateurs, lectures, favoris)
- Top 10 sourates les plus lues et les plus mises en favoris
- Gestion des utilisateurs
- Envoi de notifications à tous les utilisateurs
- Accès protégé par code secret

### 📲 PWA
- Installable sur mobile et desktop
- Fonctionne hors ligne (Service Worker)
- Icônes adaptées iOS et Android

---

## ✦ Stack Technique

| Couche | Technologie |
|--------|-------------|
| Frontend | Next.js 16 · React 18 |
| Style | Tailwind CSS · CSS Variables |
| Base de données | Supabase (PostgreSQL) |
| IA | Groq API (LLaMA 3.3 70B) |
| Données Coran | Al-Quran Cloud API |
| Polices | Amiri · Cinzel · Lato |
| Déploiement | Netlify |

---

## ✦ Structure du Projet

```
FAITH-Quran/
├── app/
│   ├── globals.css              ← Design & variables CSS
│   ├── layout.jsx               ← Layout racine + PWA meta
│   ├── page.jsx                 ← Orchestrateur principal
│   └── api/
│       ├── auth/route.js        ← Authentification admin
│       ├── admin/route.js       ← API dashboard admin
│       └── explain/route.js     ← Explications IA (Groq)
├── app/admin/
│   ├── page.jsx                 ← Login admin
│   └── dashboard/page.jsx       ← Dashboard admin
├── components/
│   ├── LoginScreen.jsx          ← Écran de connexion + PWA install
│   ├── Topbar.jsx               ← Navigation + déconnexion
│   ├── HomePage.jsx             ← Grille 114 sourates
│   ├── SurahCard.jsx            ← Carte sourate
│   ├── SurahDetail.jsx          ← Lecture + Explication
│   ├── FavoritesPage.jsx        ← Page favoris
│   ├── ProgressPage.jsx         ← Suivi de lecture
│   └── Notification.jsx         ← Toast de notification
├── lib/
│   ├── supabase.js              ← Client Supabase
│   ├── adminAuth.js             ← Vérification session admin
│   ├── useStore.js              ← État global (Supabase + local)
│   ├── surahs.js                ← Données 114 sourates
│   └── quranApi.js              ← API Al-Quran Cloud
├── public/
│   ├── manifest.json            ← Manifest PWA
│   ├── sw.js                    ← Service Worker
│   └── icons/                   ← Icônes PWA
├── .env.local                   ← Variables d'environnement (privé)
├── netlify.toml                 ← Configuration Netlify
└── supabase-schema.sql          ← Schéma base de données
```

---

## ✦ Installation

### Prérequis
- Node.js v18+
- Compte [Supabase](https://supabase.com) (gratuit)
- Compte [Groq](https://console.groq.com) (gratuit, sans carte)
- Compte [Netlify](https://netlify.com) (gratuit)

### 1. Cloner le projet

```bash
git clone https://github.com/CHAKRELLAH44/FAITH-Quran.git
cd FAITH-Quran
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Crée un fichier `.env.local` à la racine :

```env
NEXT_PUBLIC_SUPABASE_URL=https://XXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_KEY=sb_secret_...
GROQ_API_KEY=gsk_...
ADMIN_SECRET_CODE=TonCodeSecretAdmin
```

### 4. Initialiser la base de données

Dans **Supabase → SQL Editor**, exécute le contenu de `supabase-schema.sql`.

### 5. Lancer en développement

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000)

---

## ✦ Déploiement sur Netlify

```bash
# Pousser sur GitHub
git add .
git commit -m "deploy"
git push

# Netlify redéploie automatiquement
```

Sur [netlify.com](https://netlify.com) → importe le repo GitHub → ajoute les 5 variables d'environnement → Deploy.

---

## ✦ Accès Admin

```
https://ton-site.netlify.app/admin
```

Entre ton `ADMIN_SECRET_CODE` pour accéder au dashboard.

---

## ✦ APIs utilisées

| API | Usage | Coût |
|-----|-------|------|
| [Al-Quran Cloud](https://alquran.cloud/api) | Texte arabe + traductions | Gratuit |
| [Groq](https://console.groq.com) | Explications IA | Gratuit |
| [Supabase](https://supabase.com) | Base de données | Gratuit |

---

## ✦ Palette de couleurs

```css
--gold:          #c9a84c   /* Or principal    */
--gold-light:    #e8c97a   /* Or clair        */
--gold-dim:      #7a6230   /* Or sombre       */
--bg-deep:       #0a0a0c   /* Fond noir       */
--text-primary:  #f0ead6   /* Texte principal */
```

---

## ✦ Licence

MIT © 2025 — CHAKRELLAH44

---

<div align="center">

بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ

*Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux*

</div>