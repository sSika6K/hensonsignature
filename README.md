# Lancer le projet en local

Pour démarrer le serveur de développement :

```bash
npm run dev
```

Puis ouvre :

```
http://localhost:3000
```

## Commandes utiles

### Générer Prisma Client

```bash
npm run generate
```

### Appliquer le schéma à la base de données

```bash
npm run db:push
```

### Remplir la base avec des données de test

```bash
npm run db:seed
```

### Lancer le build de production

```bash
npm run build
```

### Démarrer l'application en production

```bash
npm run start
```

### Linter le projet

```bash
npm run lint
```

## Structure du projet

- `app/` — pages et routes Next.js
- `lib/` — utilitaires partagés
- `prisma/` — schéma Prisma et seed
- `public/` — fichiers statiques

## Base de données

Le projet utilise un modèle `Guitar` avec notamment les champs suivants :

- `name`
- `type`
- `year`
- `description`
- `imageUrl`
- `videoId`
- `price`
- `body`
- `neck`
- `pickups`
- `hardware`

## Fonctionnalités

- Affichage de la collection
- Création d'une guitare
- Édition d'une guitare
- Suppression d'une guitare
- Gestion de l'authentification
- Upload d'images
- Intégration de vidéos YouTube

## Notes

- Le projet repose sur **Next.js App Router**
- Les données sont stockées dans **PostgreSQL**
- Les images sont hébergées via **Supabase Storage**
