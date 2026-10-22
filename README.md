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

### 1. Lancer l'environnement de développement
Pour construire et démarrer les conteneurs (Frontend + Backend) avec rechargement à chaud (Hot-Reload) :

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

## 🗄️ Base de données (Optionnelle)

Une configuration pour **PostgreSQL** est pré-intégrée dans le fichier `docker-compose.yml`.  
Si vous avez besoin d'une base de données, décommentez simplement la section `postgres` dans `docker-compose.yml`.

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
