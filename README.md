# La Mezcla — Répertoire des artistes de Paris

Annuaire collaboratif des artistes de Paris, avec connexion par lien magique
(e-mail, sans mot de passe) et une base de données Supabase en temps réel.

## Lancer en local

```bash
npm install
npm run dev
```

Le site sera sur http://localhost:5173

Les clés Supabase sont déjà incluses dans `src/supabaseClient.js` comme
valeurs par défaut (la clé "anon" est faite pour être publique). Si tu
préfères les gérer par variables d'environnement, copie `.env.example`
vers `.env.local` :

```bash
cp .env.example .env.local
```

## Déployer sur Vercel

1. Mets ce projet sur GitHub (voir plus bas)
2. Va sur [vercel.com](https://vercel.com), connecte-toi avec GitHub
3. "Add New… → Project", choisis ce dépôt
4. Vercel détecte Vite automatiquement — clique "Deploy"
5. Une fois déployé, copie l'URL Vercel (ex: `https://la-mezcla.vercel.app`)

## Étape importante après le premier déploiement

Le lien magique de connexion doit savoir où rediriger les gens. Dans ton
dashboard **Supabase → Authentication → URL Configuration** :

- **Site URL** : mets ton URL Vercel (ex: `https://la-mezcla.vercel.app`)
- **Redirect URLs** : ajoute la même URL, et aussi `http://localhost:5173`
  pour pouvoir continuer à tester en local

Sans ça, les liens de connexion par e-mail redirigeront vers une mauvaise
adresse.

## Mettre ce projet sur GitHub

```bash
git init
git add .
git commit -m "La Mezcla — premier déploiement"
git branch -M main
git remote add origin https://github.com/TON-NOM-UTILISATEUR/la-mezcla.git
git push -u origin main
```

(Crée d'abord le dépôt vide sur github.com avant le `git push`.)

## Structure du projet

```
src/
  App.jsx            → toute la logique et l'interface
  App.css            → tous les styles
  supabaseClient.js  → connexion à la base de données
public/
  logo.png           → logo La Mezcla
  sky.jpg            → photo du ciel (hero + duotone)
  grain.png          → texture de grain photographique
```

## Modération

Actuellement, n'importe qui connecté peut ajouter une fiche, et seul
l'auteur peut la modifier/supprimer (géré par les policies SQL dans
Supabase, "Row Level Security"). Si le spam devient un problème, on peut
facilement passer à un système où les nouvelles fiches doivent être
approuvées avant publication — demande-le à Claude si besoin.
