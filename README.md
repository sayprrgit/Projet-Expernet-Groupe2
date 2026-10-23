# Projet Expernet - Groupe 2

Ce dépôt contient le projet complet (Frontend Vue.js 3 et Backend NestJS) orchestré avec Docker.

---

## 🏗️ Architecture du projet

- **`portal-expernet/`** : API Backend développée avec **NestJS** (Node.js 22, TypeScript).
- **`front/`** : Application Frontend développée avec **Vue.js 3** + **Vite** + **TypeScript**.
- **Docker Compose** : Orchestration des conteneurs pour le développement local et la production.

---

## 🚀 Démarrage rapide avec Docker

### Prérequis
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et en cours d'exécution.
- Les fichiers `.env` créés (voir [Configuration](#️-configuration-fichiers-env)).

### 1. Lancer l'environnement de développement
Pour construire et démarrer les conteneurs (Base de données + Backend + Frontend) avec rechargement à chaud (Hot-Reload) :

```bash
docker compose up --build
```

Pour lancer en tâche de fond (mode détaché) :
```bash
docker compose up -d
```

### 2. Accéder aux applications
- **Frontend** : [http://localhost:5173](http://localhost:5173)
- **Backend API** : [http://localhost:3000/api](http://localhost:3000/api)
- **Documentation Swagger** : [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

> 💡 **Hot-Reload activé** : toute modification dans les dossiers `front/src` ou `portal-expernet/src` est automatiquement prise en compte sans redémarrer les conteneurs.

### 3. Arrêter les conteneurs
```bash
docker compose down
```

---

## 📦 Environnement de Production

Pour tester ou déployer en mode production (build optimisé avec Nginx pour le frontend et build minifié pour le backend) :

```bash
docker compose -f docker-compose.prod.yml up --build
```

- **Frontend (Nginx)** : [http://localhost](http://localhost) (port 80)
- **Backend** : [http://localhost:3000/api](http://localhost:3000/api)

---

## ⚙️ Configuration (fichiers `.env`)

Le projet utilise **deux** fichiers `.env`, jamais commités (ils sont dans le `.gitignore`) :

| Fichier | Lu par | Contenu |
|---|---|---|
| `.env` (racine) | Docker Compose | `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `JWT_SECRET` |
| `portal-expernet/.env` | Prisma et NestJS (en local) | `DATABASE_URL` |

Pour les créer, copier le modèle puis remplacer les valeurs `change_me` :

```bash
# Windows (cmd)
copy .env.example .env
# Linux / macOS / PowerShell
cp .env.example .env
```

Contenu de `portal-expernet/.env` (même mot de passe que dans le `.env` de la racine) :

```
DATABASE_URL="postgresql://expernet:MOT_DE_PASSE@localhost:5432/expernet?schema=public"
```

> ⚠️ Utiliser un mot de passe sans caractères spéciaux (`@`, `:`, `/`, `#`), sinon `DATABASE_URL` devient invalide.
> Pour générer un `JWT_SECRET` : `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

---

## 🗄️ Base de données (PostgreSQL + Prisma 7)

La base **PostgreSQL 16** tourne dans le service Docker `db` (conteneur `portal-expernet-db`, port `5432`). Les données sont conservées dans le volume `pgdata`.
L'accès aux données se fait avec l'ORM **Prisma 7**.

### Fichiers Prisma (dans `portal-expernet/`)

| Fichier | Rôle |
|---|---|
| `prisma.config.ts` | Configuration Prisma 7 : chemin du schéma, des migrations, commande de seed et URL de la base |
| `prisma/schema.prisma` | Définition des tables, relations et énumérations |
| `prisma/migrations/` | Historique versionné des migrations SQL (**à commiter**) |
| `prisma/seed.ts` | Données de démonstration |
| `src/generated/prisma/` | Client Prisma généré (ignoré par Git, se régénère avec `npx prisma generate`) |
| `src/prisma/` | `PrismaService` et `PrismaModule` (module global injecté dans tous les modules NestJS) |

> Prisma 7 : l'URL de la base n'est plus dans `schema.prisma` mais dans `prisma.config.ts`, et le client se connecte via l'adaptateur `@prisma/adapter-pg`.

### Installer la base (première fois)

```bash
# 1. Depuis la racine : démarrer PostgreSQL
docker compose up -d db

# 2. Depuis portal-expernet/
cd portal-expernet
npm install
npx prisma migrate dev      # crée les tables
npx prisma generate         # génère le client Prisma
npx prisma db seed          # insère les données de démo
```

### Commandes Prisma utiles (depuis `portal-expernet/`)

| Commande | Utilité |
|---|---|
| `npx prisma migrate dev --name <nom>` | Créer et appliquer une migration après une modification du schéma |
| `npx prisma generate` | Régénérer le client (à relancer après chaque modification du schéma) |
| `npx prisma db seed` | Réinsérer les données de démo (vide les tables d'abord) |
| `npx prisma studio` | Interface web pour consulter et modifier les données (l'adresse s'affiche dans le terminal) |
| `npx prisma migrate reset` | Effacer la base et rejouer toutes les migrations (dev uniquement) |

### Modèle de données

| Domaine | Tables |
|---|---|
| Utilisateurs | `User` (rôles `ADMIN`, `FORMATEUR`, `ETUDIANT`, champs MFA) |
| Catalogue de formations | `Filiere`, `Formation`, `Candidature` |
| Promotions et planning | `Promotion`, `Inscription`, `Session` |
| Émargement | `Emargement` (signature, horodatage, empreinte SHA-256), `Attestation` |
| Examens | `Examen`, `JuryMembre`, `Competence`, `Evaluation` |
| Collaboration (remplace Teams) | `Canal`, `Message`, `Document` |

### Comptes de démonstration (créés par le seed)

Mot de passe commun, **uniquement pour le développement** : `Password123!`

| Email | Rôle |
|---|---|
| admin@expernet.re | ADMIN |
| j.hoarau@expernet.re | FORMATEUR |
| lynho@exemple.re | ETUDIANT |
| s.grondin@exemple.re | ETUDIANT |

> Les `id` changent à chaque exécution du seed : toujours les relire dans Prisma Studio, ne jamais les écrire en dur dans le code.

---

## 📖 Documentation de l'API (Swagger)

- **Swagger UI** : [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- **Spécification OpenAPI (JSON)** : [http://localhost:3000/api/openapi.json](http://localhost:3000/api/openapi.json)

Toutes les routes sont préfixées par `/api`.

---

## 🔐 Authentification (JWT)

Connexion par **email + mot de passe** (vérifié avec le hash bcrypt de la table `User`), qui renvoie un **jeton JWT** valable 8 heures, signé en HS256 avec `JWT_SECRET`.

| Méthode | Route | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Corps `{ "email", "password" }` → `{ token, user }` |
| `GET` | `/api/auth/me` | Profil de l'utilisateur connecté (jeton requis) |

- Les routes protégées attendent l'en-tête `Authorization: Bearer <jeton>`. Sans jeton valide : **401**.
- `AuthGuard` (`portal-expernet/src/auth/auth.guard.ts`) vérifie le jeton, relit l'utilisateur en base et l'attache à la requête (sans le hash du mot de passe ni le secret MFA).
- **RBAC** : le décorateur `@Roles('ADMIN', 'FORMATEUR')` limite une route à certains rôles (sinon **403**) ; `@CurrentUser()` donne l'utilisateur connecté dans un contrôleur.
- Le message d'erreur de connexion est identique pour un email inconnu et un mauvais mot de passe, et le temps de réponse est égalisé, pour ne pas révéler quels comptes existent.
- Côté front : page de connexion commune **`/login`**, store Pinia `front/src/stores/auth.ts` ; une route avec `meta: { requiresAuth: true }` redirige vers `/login?redirect=...` puis revient à la page demandée après connexion.
- **Dans Swagger** : appeler `POST /api/auth/login`, copier `token`, cliquer sur **Authorize** et le coller.

> `JWT_SECRET` est **obligatoire** (aucune valeur par défaut) : dans le `.env` de la racine pour Docker et dans `portal-expernet/.env` pour un lancement local.

**À venir** : double authentification (TOTP) pour les rôles ADMIN et FORMATEUR (champs `mfaEnabled` et `mfaSecret` déjà présents en base).

---

## 💬 Module Collaboration (remplacement de Teams)

Objectif : remplacer Microsoft Teams par des canaux de discussion et un espace documentaire **intégrés à la plateforme** et **liés aux promotions** : un étudiant inscrit à une promotion accède automatiquement à ses canaux et à ses documents, sans compte séparé.

### Interface

- Accès depuis l'onglet **Espaces → Teams — Espace collaboratif**, bouton **Connexion Teams** : passage par la page de connexion commune `/login`, puis ouverture de l'espace.
- Page plein écran `/teams/messagerie` (sans navbar ni footer) : canaux à gauche, conversation au centre (fils de réponses), fichiers du canal à droite.
- Les nouveaux messages s'affichent automatiquement (actualisation toutes les 4 secondes).
- Code : `front/src/views/TeamsChatView.vue` et `front/src/services/collab.ts`.

### Routes disponibles (jeton JWT requis)

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/canaux` | Canaux accessibles à l'utilisateur connecté |
| `GET` | `/api/canaux/:id/messages` | Historique d'un canal (200 derniers messages) |
| `POST` | `/api/canaux/:id/messages` | Envoi d'un message `{ contenu, parentId? }` (`parentId` pour répondre dans un fil) |
| `GET` | `/api/documents?promotionId=&canalId=` | Documents visibles par l'utilisateur |
| `POST` | `/api/documents` | Dépôt d'un fichier (`multipart/form-data` : `file`, `titre`, et en option `promotionId`, `canalId`, `visiblePar`) |
| `GET` | `/api/documents/:id/download` | Téléchargement d'un document |

### Règles d'accès

- **ADMIN** : accède à tous les canaux et à tous les documents.
- **FORMATEUR / ETUDIANT** : accède aux canaux généraux et à ceux de ses promotions (formateur de la promotion ou étudiant inscrit). Pour les documents, son rôle doit en plus figurer dans `visiblePar`.
- Le dépôt d'un document dans une promotion n'est autorisé qu'à ses membres.
- Messages : 2000 caractères maximum ; une réponse à une réponse est rattachée au message d'origine (un seul niveau de fil).
- Fichiers : **10 Mo** maximum, stockés dans `portal-expernet/uploads/` (ignoré par Git) sous un nom aléatoire (UUID) ; la base conserve le nom d'origine.

### Tester dans Swagger

1. `POST /api/auth/login` avec un compte de démonstration, puis **Authorize** avec le `token` obtenu.
2. `POST /api/documents` (connecté en formateur) avec un fichier, un titre et le `promotionId`.
3. Se reconnecter en étudiant inscrit : `GET /api/documents` affiche le document.
4. Déposer un document avec `visiblePar` = `ADMIN,FORMATEUR` : l'étudiant ne le voit plus, l'admin si.

### Prochaines étapes

- Remplacer l'actualisation périodique par du temps réel avec **Socket.IO**.
- Double authentification (TOTP) pour les comptes ADMIN et FORMATEUR.

---

## 🧯 Dépannage

| Problème | Solution |
|---|---|
| `EADDRINUSE: address already in use :3000` | Un autre backend occupe le port : `docker compose stop backend`, ou repérer le processus avec `netstat -ano \| findstr :3000` puis `taskkill /PID <pid> /F` |
| `Cannot find module .../generated/prisma/client.js` | Lancer `npx prisma generate` |
| `Can't reach database server` | Démarrer la base : `docker compose up -d db` |
| `Cannot resolve environment variable: DATABASE_URL` | Le fichier `portal-expernet/.env` est absent ou incomplet |
| `Authentication failed` | Le mot de passe diffère entre les deux fichiers `.env` |
| `npx prisma` ne reconnaît pas `migrate` | Prisma n'est pas installé dans le projet : `npm install` depuis `portal-expernet/` |
| `Cannot find module` dans le conteneur backend après l'ajout d'une dépendance | Reconstruire l'image et son `node_modules` : `docker compose up -d --build -V backend` |
| `JWT_SECRET manquant` au démarrage | Ajouter `JWT_SECRET` dans le `.env` concerné |

---

## 🛠️ Commandes utiles

- Voir les logs en direct :
  ```bash
  docker compose logs -f
  ```
- Voir les logs d'un service spécifique :
  ```bash
  docker compose logs -f frontend
  docker compose logs -f backend
  ```
- Ouvrir un terminal dans un conteneur :
  ```bash
  docker compose exec backend sh
  docker compose exec frontend sh
  ```
- Logs de la base de données :
  ```bash
  docker compose logs -f db
  ```

---

## 🌿 Conventions Git

Les messages de commit suivent les **Conventional Commits** : `type(portée): description`.

| Type | Usage |
|---|---|
| `[ADD]` | Nouvelle fonctionnalité |
| `[FIX]` | Correction de bug |
| `[DEL]` | Suppression |
| `[UPD]` | Mise a jour |
| `[MRG]` | Fusion des branches |
| `[BCK] ` | Backup |
| `[CFL] ` | Resolution de conflit |
