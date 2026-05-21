# TaskAPI — REST API de gestion de tâches

API REST complète avec authentification JWT, gestion de tâches et de projets. Développée en Node.js / Express / PostgreSQL.

🔗 **[Demo live](https://task-api-weld.vercel.app/api/docs)**

---

## Stack technique

- **Node.js** + **Express** — serveur HTTP et routing
- **PostgreSQL** — base de données relationnelle
- **JWT** (jsonwebtoken) — authentification stateless
- **bcryptjs** — hashage des mots de passe
- **express-validator** — validation des données entrantes
- **Railway** — déploiement et base de données hébergée

## Fonctionnalités

- ✅ Inscription / Connexion avec JWT
- ✅ CRUD complet sur les tâches (titre, description, statut, priorité, date d'échéance)
- ✅ CRUD complet sur les projets
- ✅ Filtrage des tâches par statut, priorité, projet, recherche full-text
- ✅ Statistiques (todo / en cours / terminé / en retard)
- ✅ Validation des données avec messages d'erreur clairs
- ✅ Sécurité : hash bcrypt, JWT, ownership des ressources

## Architecture

```
src/
├── config/
│   ├── db.js          # Connexion PostgreSQL (pool)
│   └── migrate.js     # Script de migration (création des tables)
├── controllers/
│   ├── authController.js
│   ├── tasksController.js
│   └── projectsController.js
├── middlewares/
│   ├── auth.js        # Vérification JWT
│   └── validate.js    # Gestion des erreurs de validation
├── models/
│   ├── User.js
│   ├── Task.js
│   └── Project.js
├── routes/
│   ├── auth.js
│   ├── tasks.js
│   └── projects.js
└── index.js           # Point d'entrée, config Express
```

## Installation

```bash
git clone https://github.com/IEvianI/taskapi.git
cd taskapi
npm install
cp .env.example .env
# Remplir les variables dans .env
npm run migrate
npm run dev
```

## Variables d'environnement

```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/taskapi
JWT_SECRET=votre_secret_jwt
JWT_EXPIRES_IN=7d
```

## Endpoints

### Auth
| Méthode | Route | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Créer un compte | ❌ |
| POST | `/api/auth/login` | Se connecter | ❌ |
| GET | `/api/auth/me` | Profil utilisateur | ✅ |
| PATCH | `/api/auth/me` | Modifier le profil | ✅ |

### Tâches
| Méthode | Route | Description | Auth |
|---|---|---|---|
| GET | `/api/tasks` | Lister les tâches | ✅ |
| GET | `/api/tasks/stats` | Statistiques | ✅ |
| GET | `/api/tasks/:id` | Détail d'une tâche | ✅ |
| POST | `/api/tasks` | Créer une tâche | ✅ |
| PATCH | `/api/tasks/:id` | Modifier une tâche | ✅ |
| DELETE | `/api/tasks/:id` | Supprimer une tâche | ✅ |

### Projets
| Méthode | Route | Description | Auth |
|---|---|---|---|
| GET | `/api/projects` | Lister les projets | ✅ |
| GET | `/api/projects/:id` | Détail d'un projet | ✅ |
| POST | `/api/projects` | Créer un projet | ✅ |
| PATCH | `/api/projects/:id` | Modifier un projet | ✅ |
| DELETE | `/api/projects/:id` | Supprimer un projet | ✅ |

## Exemples de requêtes

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Evan", "email": "evan@example.com", "password": "secret123"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "evan@example.com", "password": "secret123"}'
```

### Créer une tâche
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Revoir le CV", "priority": "high", "status": "in_progress"}'
```

### Filtrer les tâches
```bash
curl "http://localhost:3000/api/tasks?status=todo&priority=high" \
  -H "Authorization: Bearer <token>"
```

## Déploiement sur Railway

1. Créer un projet sur [railway.app](https://railway.app)
2. Ajouter un service PostgreSQL
3. Connecter le repo GitHub
4. Ajouter les variables d'environnement
5. `npm run migrate` via la console Railway

---

Développé par **Evan Allain** — [Portfolio](https://portfolio-evan-allain.vercel.app) · Mai 2026
