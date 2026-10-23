# Projet Expernet - Groupe 2

Ce dépôt contient le projet complet (Frontend Vue.js 3 et Backend NestJS) orchestré avec Docker.

---

## 🏗️ Architecture du projet

- **`portal-expernet/`** : API Backend développée avec **NestJS** (Node.js 22, TypeScript).
- **`front/`** : Application Frontend développée avec **Vue.js 3** + **Vite** + **TypeScript**.
- **Docker Compose** : Orchestration des conteneurs pour le développement local et la production.

La plateforme réunit en un seul portail les trois outils actuels d'Expernet :

| Avant | Dans le portail |
|---|---|
| Site WordPress (catalogue) | Site public : catalogue, fiches formations, candidature, planning, à propos |
| GALIA (emplois du temps, notes, affectations) | **Espace GALIA** : tableaux de bord étudiant, formateur et administrateur |
| Microsoft Teams (documents, collaboration) | **Espace Teams** : canaux par promotion, fils de discussion, documents partagés |

---

## 🧰 Technologies

### Frontend (`front/`)

| Technologie | Version | Rôle |
|---|---|---|
| Vue.js | 3.5 | Framework d'interface (Composition API, `<script setup>`) |
| TypeScript | 6.0 | Typage statique (vérification avec `vue-tsc`) |
| Vite | 8 | Serveur de développement et build ; proxy `/api` vers le backend |
| Vue Router | 5 | Navigation, routes protégées (`meta.requiresAuth`), pages plein écran (`meta.bare`) |
| Pinia | 4 | Store d'authentification partagé (`stores/auth.ts`) |
| Axios | 1.20 | Appels HTTP, jeton JWT ajouté automatiquement |
| swagger-ui-dist | 5 | Documentation de l'API intégrée au site (page `/docs`) |
| Vitest + Vue Test Utils | 4 | Tests unitaires |

### Backend (`portal-expernet/`)

| Technologie | Version | Rôle |
|---|---|---|
| Node.js | 22 | Environnement d'exécution |
| NestJS | 12 | Framework API modulaire (modules, contrôleurs, services, guards) |
| TypeScript | 6.0 | Typage statique, modules ES (`"type": "module"`) |
| Prisma ORM | 7.10 | Schéma, migrations versionnées, client typé ; adaptateur `@prisma/adapter-pg` |
| PostgreSQL | 16 | Base de données relationnelle |
| bcrypt | 6 | Hachage des mots de passe |
| JWT (HS256) | — | Jetons d'authentification signés avec `node:crypto` (`src/auth/jwt.util.ts`) |
| Multer (`@nestjs/platform-express`) | — | Dépôt de fichiers (`multipart/form-data`) |
| @nestjs/swagger + swagger-ui-express | 12 / 5 | Spécification **OpenAPI 3.0** générée depuis le code et interface Swagger UI |
| Vitest + Supertest | 4 / 7 | Tests unitaires et e2e |

### Outillage et déploiement

| Outil | Rôle |
|---|---|
| Docker & Docker Compose | Conteneurs `db`, `backend`, `frontend` (développement avec rechargement à chaud) |
| Nginx | Sert le front compilé en production (`docker-compose.prod.yml`) |
| oxlint, Prettier | Qualité et formatage du code |
| axe-core | Audit d'accessibilité (WCAG 2.1 AA / RGAA) |
| Git + Conventional Commits | Historique lisible (voir [Conventions Git](#-conventions-git)) |

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
| Promotions et planning | `Promotion`, `Inscription`, `Session`, `PlanningEvent` (agenda public) |
| Émargement | `Emargement` (signature, horodatage, empreinte SHA-256), `Attestation` |
| Examens | `Examen`, `JuryMembre`, `Competence`, `Evaluation` (niveau d'acquisition et note sur 20) |
| Collaboration (remplace Teams) | `Canal`, `Message`, `Document` |

### Comptes de démonstration (créés par le seed)

Mot de passe commun, **uniquement pour le développement** : `Password123!`

| Email | Rôle |
|---|---|
| marie.payet@expernet.re | ADMIN |
| laetitia.laurence-nicosia@expernet.re | ADMIN |
| jean.hoarau@expernet.re | FORMATEUR |
| sophie.menicoce@expernet.re | FORMATEUR |
| marc.beauregard@expernet.re | FORMATEUR |
| lynho.rasoamanana@exemple.re | ETUDIANT |
| sarah.grondin@exemple.re | ETUDIANT |

> Le seed crée aussi d'autres étudiants (voir `portal-expernet/prisma/seed.ts`), tous avec le même mot de passe.

> Les `id` changent à chaque exécution du seed : toujours les relire dans Prisma Studio, ne jamais les écrire en dur dans le code.

---

## 📖 Documentation de l'API (Swagger / OpenAPI 3.0)

La documentation est **générée automatiquement depuis le code** (décorateurs `@ApiTags`, `@ApiOperation`, `@ApiBody`… de `@nestjs/swagger`) : elle reste toujours à jour.

| Accès | Adresse |
|---|---|
| Swagger UI (backend) | [http://localhost:3000/api/docs](http://localhost:3000/api/docs) |
| Spécification OpenAPI (JSON) | [http://localhost:3000/api/openapi.json](http://localhost:3000/api/openapi.json) |
| Documentation intégrée au site | [http://localhost:5173/docs](http://localhost:5173/docs) |

Configuration : `portal-expernet/src/main.ts` (titre, version, serveur, authentification Bearer). Toutes les routes sont préfixées par `/api`.

### Tester une route protégée

1. Ouvrir `POST /api/auth/login` → **Try it out** → saisir un compte de démonstration → **Execute**.
2. Copier la valeur de `token` dans la réponse.
3. Cliquer sur **Authorize** (cadenas en haut de page), coller le jeton, valider.
4. Les routes protégées sont maintenant appelées avec `Authorization: Bearer <jeton>`.

### Liste des routes

Légende : 🌐 public · 🔑 connecté · 👤 rôle requis

| Groupe Swagger | Méthode | Route | Accès | Description |
|---|---|---|---|---|
| App | `GET` | `/api` | 🌐 | Vérifie que l'API est en ligne |
| Authentification | `POST` | `/api/auth/login` | 🌐 | Connexion → `{ token, user }` |
| Authentification | `GET` | `/api/auth/me` | 🔑 | Profil de l'utilisateur connecté |
| Formations & Candidatures | `GET` | `/api/formations` | 🌐 | Catalogue avec filtres à facettes (`search`, `category`, `level`, `type`, `cpfOnly`, `campus`) |
| Formations & Candidatures | `GET` | `/api/formations/meta/categories` | 🌐 | Filières, niveaux et statistiques |
| Formations & Candidatures | `GET` | `/api/formations/:id` | 🌐 | Fiche détaillée (id ou slug) |
| Formations & Candidatures | `POST` | `/api/formations/candidature` | 🌐 | Dépôt d'une candidature (validation stricte) |
| Formations & Candidatures | `GET` | `/api/formations/candidatures` | 👤 ADMIN | Liste des candidatures (données personnelles) |
| Planning | `GET` | `/api/planning` | 🌐 | Agenda public : rentrées, sessions, ateliers, examens |
| GALIA (étudiant) | `GET` | `/api/galia/emploi-du-temps` | 👤 ETUDIANT | Emploi du temps |
| GALIA (étudiant) | `GET` | `/api/galia/mes-notes` | 👤 ETUDIANT | Notes |
| GALIA (étudiant) | `GET` | `/api/galia/progression` | 👤 ETUDIANT | Progression par compétence |
| GALIA (étudiant) | `GET` | `/api/galia/assiduite` | 👤 ETUDIANT | Assiduité |
| GALIA (étudiant) | `GET` | `/api/galia/mes-absences` | 👤 ETUDIANT | Absences |
| GALIA (étudiant) | `GET` | `/api/galia/ma-promotion` | 👤 ETUDIANT | Promotion |
| GALIA (formateur) | `GET` | `/api/galia/formateur/overview` | 👤 FORMATEUR, ADMIN | Indicateurs globaux |
| GALIA (formateur) | `GET` | `/api/galia/formateur/promotions` | 👤 FORMATEUR, ADMIN | Promotions suivies |
| GALIA (formateur) | `GET` | `/api/galia/formateur/promotions/:id/etudiants` | 👤 FORMATEUR, ADMIN | Étudiants et statistiques |
| GALIA (formateur) | `GET` | `/api/galia/formateur/promotions/:id/sessions` | 👤 FORMATEUR, ADMIN | Sessions |
| GALIA (formateur) | `GET` | `/api/galia/formateur/promotions/:id/notes` | 👤 FORMATEUR, ADMIN | Notes de la promotion |
| GALIA (formateur) | `GET` | `/api/galia/formateur/promotions/:id/examens` | 👤 FORMATEUR, ADMIN | Examens |
| GALIA (formateur) | `GET` | `/api/galia/formateur/promotions/:id/competences` | 👤 FORMATEUR, ADMIN | Compétences évaluables |
| GALIA (formateur) | `GET` | `/api/galia/formateur/promotions/:id/stats` | 👤 FORMATEUR, ADMIN | Assiduité et réussite |
| GALIA (formateur) | `GET` | `/api/galia/formateur/sessions/:id/emargements` | 👤 FORMATEUR, ADMIN | Émargements d'une session |
| GALIA (formateur) | `POST` | `/api/galia/formateur/sessions/:id/emargements` | 👤 FORMATEUR, ADMIN | Marquer présent / absent |
| GALIA (formateur) | `POST` | `/api/galia/formateur/notes` | 👤 FORMATEUR, ADMIN | Saisir ou modifier une note |
| GALIA (admin) | `GET` | `/api/galia/admin/users` | 👤 ADMIN | Liste des utilisateurs |
| GALIA (admin) | `POST` | `/api/galia/admin/users` | 👤 ADMIN | Créer un utilisateur |
| GALIA (admin) | `PATCH` | `/api/galia/admin/users/:id` | 👤 ADMIN | Modifier un utilisateur |
| GALIA (admin) | `DELETE` | `/api/galia/admin/users/:id` | 👤 ADMIN | Supprimer un utilisateur |
| GALIA (admin) | `GET` | `/api/galia/admin/stats` | 👤 ADMIN | Indicateurs du centre |
| GALIA (admin) | `GET` | `/api/galia/admin/candidatures` | 👤 ADMIN | Candidatures |
| GALIA (admin) | `PATCH` | `/api/galia/admin/candidatures/:id` | 👤 ADMIN | Changer le statut d'une candidature |
| Canaux | `GET` | `/api/canaux` | 🔑 | Canaux accessibles |
| Canaux | `GET` | `/api/canaux/:id/messages` | 🔑 | Historique d'un canal |
| Canaux | `POST` | `/api/canaux/:id/messages` | 🔑 | Envoi d'un message |
| documents | `GET` | `/api/documents` | 🔑 | Documents visibles |
| documents | `POST` | `/api/documents` | 🔑 | Dépôt d'un fichier |
| documents | `GET` | `/api/documents/:id/download` | 🔑 | Téléchargement |

Réponses d'erreur communes : **400** données invalides · **401** jeton absent, invalide ou expiré · **403** rôle insuffisant ou ressource d'une autre promotion · **404** ressource introuvable.

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

- Accès depuis l'onglet **Espaces → Teams — Espace collaboratif**, bouton **Connexion Teams**.
- Page plein écran `/teams/messagerie` (sans navbar ni footer) : écran de connexion Teams (accent violet), puis canaux à gauche, conversation au centre (fils de réponses), fichiers du canal à droite.
- La connexion utilise le **store commun** (`stores/auth.ts`) : une seule session pour Teams et GALIA.
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

---

## 🎓 Espace GALIA (remplacement de GALIA)

- Présentation publique : `/galia` · connexion : `/login` · espace : `/galia/espace` (route protégée, plein écran).
- Un tableau de bord par rôle :

| Rôle | Contenu |
|---|---|
| ETUDIANT | Tableau de bord, emploi du temps, notes, progression par compétence, absences |
| FORMATEUR | Indicateurs, suivi des étudiants, émargements (présent / absent), saisie des notes, notes de la promotion |
| ADMIN | Pilotage du centre : statistiques, gestion des utilisateurs, traitement des candidatures |

- Code : `front/src/views/galia/GaliaEspaceView.vue`, `front/src/components/galia/`, `portal-expernet/src/galia/`.

---

## 🎨 Design et accessibilité (RGAA)

### Charte commune

Chaque univers garde sa couleur d'accent sur toutes ses pages (classes `accent-*` de `front/src/assets/main.css`) :

| Univers | Accent |
|---|---|
| Site, Campus | Orange `#F28C05` |
| Expernet Pro | Bleu `#45A1C3` |
| GALIA | Doré `#FFC329` |
| Teams | Violet `#6264A7` |

Les espaces GALIA et Teams partagent la même structure d'en-tête (marque « EXPERNET + espace », utilisateur, bouton Déconnexion) et le même écran de connexion, décliné dans leur couleur.

### Accessibilité

Audit **axe-core** (WCAG 2.1 AA) sur toutes les pages publiques et les espaces connectés (3 rôles) : **0 anomalie** (hors bouton Vue DevTools, présent uniquement en développement).

- **Contrastes ≥ 4,5:1** : texte bleu marine sur les boutons orange, teintes foncées pour les textes colorés (`--exp-orange-dark: #9a5300`, `--accent-strong`, etc.).
- **Structure** : `lang="fr"`, un seul `<main>` par page, repères (`header`, `nav`, `footer`) correctement placés, titres hiérarchisés, onglet actif signalé par `aria-current`.
- **Navigation clavier** : lien d'évitement « Aller au contenu principal » sur toutes les pages, focus visible, menus fermables avec Échap, focus déplacé sur les sections atteintes depuis la navigation.
- **Formulaires** : chaque champ a un libellé, erreurs annoncées (`role="alert"`), `autocomplete` sur la connexion.
- **Images** : alternatives textuelles ; images décoratives ignorées (`alt=""`, `aria-hidden`).
- **Liens externes** : signalés « (nouvelle fenêtre) » aux lecteurs d'écran.
- **Animations** : la préférence système « réduire les animations » est respectée.

---

## 👥 Contenus

- **Équipe** (page À propos) : photos et rôles issus de [expernet-campus.re/notre-equipe](https://expernet-campus.re/notre-equipe/), initiales en l'absence de photo. Pour ajouter une photo : la déposer dans `front/public/images/equipe/` et renseigner `photo` dans `front/src/data/bureau.ts`.
- **Experpote** : galerie de la mascotte du Campus.
- **Réseaux sociaux** (pied de page et À propos) : LinkedIn, Facebook, Instagram, définis dans `front/src/data/reseaux.ts`.

---

## ✅ Contraintes du sujet (scaffolding)

| Contrainte | Mise en œuvre |
|---|---|
| Fichier vide `67.php` à la racine du dépôt | Présent à la racine |
| Icônes de bananes dans la navigation du tableau de bord formateur | Chaque entrée de la navigation formateur porte une icône 🍌, sur un motif de bananes en fond (`GaliaEspaceView.vue`, `GaliaHeader.vue`) ; chaque entrée fait défiler jusqu'au bloc correspondant |
| API documentée OpenAPI 3.0 | Swagger généré depuis le code (voir [Documentation de l'API](#-documentation-de-lapi-swagger--openapi-30)) |
| Migrations de schéma versionnées | `portal-expernet/prisma/migrations/` |
| Contrôle d'accès par rôle | `AuthGuard` + `@Roles()` côté API, routes protégées côté front |
| Conteneurisation | `docker-compose.yml` (développement) et `docker-compose.prod.yml` |

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
| Dizaines d'erreurs TypeScript `... does not exist on type 'PrismaService'` après un `git pull` ou une fusion | Le client Prisma n'est plus à jour : `npx prisma generate` (puis `npx prisma migrate dev`) depuis `portal-expernet/` ; `src/generated/` n'est pas versionné |
| `Cannot POST /api/...` ou `/api` qui répond « Hello World! » | Un autre programme occupe le port 3000 : `netstat -ano \| findstr :3000`, arrêter le processus, relancer `docker compose up -d backend` |
| Erreur **502** sur `/api` depuis le front | Le backend ne tourne pas ou ne compile pas : `docker logs portal-expernet-backend --tail 30` |
| « Connexion impossible » alors que le mot de passe est bon | Même cause que l'erreur 502 : vérifier que le backend a démarré |

---

## 🔭 Prochaines étapes

- Double authentification (TOTP) pour les comptes ADMIN et FORMATEUR (champs `mfaEnabled` et `mfaSecret` déjà en base).
- Messagerie en temps réel avec **Socket.IO** (aujourd'hui : actualisation toutes les 4 secondes).
- Production : ajouter le service `db`, `DATABASE_URL`, `JWT_SECRET` et un volume pour `uploads/` dans `docker-compose.prod.yml`.
- Tests e2e sur l'émargement et l'authentification.

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
