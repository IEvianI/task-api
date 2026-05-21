const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskAPI',
      version: '1.0.0',
      description: 'API REST de gestion de tâches avec authentification JWT — Evan Allain',
      contact: {
        name: 'Evan Allain',
        url: 'https://portfolio-evan-allain.vercel.app',
      },
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Local' },
      { url: 'https://task-api-weld.vercel.app', description: 'Production' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Entrez votre token JWT obtenu via /api/auth/login',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Evan Allain' },
            email: { type: 'string', example: 'evan@example.com' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Task: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Revoir le CV' },
            description: { type: 'string', example: 'Mettre à jour les dates' },
            status: { type: 'string', enum: ['todo', 'in_progress', 'done'], example: 'todo' },
            priority: { type: 'string', enum: ['low', 'medium', 'high'], example: 'high' },
            due_date: { type: 'string', format: 'date', example: '2026-06-01' },
            project_id: { type: 'integer', example: 1 },
            user_id: { type: 'integer', example: 1 },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Project: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Portfolio' },
            description: { type: 'string', example: 'Refonte du portfolio' },
            color: { type: 'string', example: '#3b82f6' },
            user_id: { type: 'integer', example: 1 },
            task_count: { type: 'integer', example: 5 },
            done_count: { type: 'integer', example: 2 },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Message d\'erreur' },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Inscription, connexion et profil' },
      { name: 'Tasks', description: 'CRUD des tâches' },
      { name: 'Projects', description: 'CRUD des projets' },
    ],
    paths: {
      '/api/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Créer un compte',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string', example: 'Evan Allain' },
                    email: { type: 'string', example: 'evan@example.com' },
                    password: { type: 'string', example: 'secret123', minLength: 6 },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Compte créé avec succès' },
            400: { description: 'Données invalides' },
            409: { description: 'Email déjà utilisé' },
          },
        },
      },
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Se connecter et obtenir un token JWT',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', example: 'evan@example.com' },
                    password: { type: 'string', example: 'secret123' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Connexion réussie — token JWT retourné' },
            401: { description: 'Email ou mot de passe incorrect' },
          },
        },
      },
      '/api/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Récupérer son profil',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Profil utilisateur' },
            401: { description: 'Non authentifié' },
          },
        },
        patch: {
          tags: ['Auth'],
          summary: 'Modifier son profil',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', example: 'Evan Allain' },
                    email: { type: 'string', example: 'evan@example.com' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Profil mis à jour' },
            401: { description: 'Non authentifié' },
          },
        },
      },
      '/api/tasks': {
        get: {
          tags: ['Tasks'],
          summary: 'Lister les tâches',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'status', in: 'query', schema: { type: 'string', enum: ['todo', 'in_progress', 'done'] } },
            { name: 'priority', in: 'query', schema: { type: 'string', enum: ['low', 'medium', 'high'] } },
            { name: 'project_id', in: 'query', schema: { type: 'integer' } },
            { name: 'search', in: 'query', schema: { type: 'string' } },
          ],
          responses: {
            200: { description: 'Liste des tâches' },
            401: { description: 'Non authentifié' },
          },
        },
        post: {
          tags: ['Tasks'],
          summary: 'Créer une tâche',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title'],
                  properties: {
                    title: { type: 'string', example: 'Revoir le CV' },
                    description: { type: 'string', example: 'Mettre à jour les dates' },
                    status: { type: 'string', enum: ['todo', 'in_progress', 'done'], default: 'todo' },
                    priority: { type: 'string', enum: ['low', 'medium', 'high'], default: 'medium' },
                    due_date: { type: 'string', format: 'date', example: '2026-06-01' },
                    project_id: { type: 'integer', example: 1 },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Tâche créée' },
            400: { description: 'Données invalides' },
            401: { description: 'Non authentifié' },
          },
        },
      },
      '/api/tasks/stats': {
        get: {
          tags: ['Tasks'],
          summary: 'Statistiques des tâches',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Compteurs todo / in_progress / done / overdue' },
            401: { description: 'Non authentifié' },
          },
        },
      },
      '/api/tasks/{id}': {
        get: {
          tags: ['Tasks'],
          summary: 'Détail d\'une tâche',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Tâche trouvée' },
            404: { description: 'Tâche introuvable' },
          },
        },
        patch: {
          tags: ['Tasks'],
          summary: 'Modifier une tâche',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    status: { type: 'string', enum: ['todo', 'in_progress', 'done'] },
                    priority: { type: 'string', enum: ['low', 'medium', 'high'] },
                    due_date: { type: 'string', format: 'date' },
                    project_id: { type: 'integer' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Tâche mise à jour' },
            404: { description: 'Tâche introuvable' },
          },
        },
        delete: {
          tags: ['Tasks'],
          summary: 'Supprimer une tâche',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Tâche supprimée' },
            404: { description: 'Tâche introuvable' },
          },
        },
      },
      '/api/projects': {
        get: {
          tags: ['Projects'],
          summary: 'Lister les projets',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Liste des projets avec compteurs de tâches' },
            401: { description: 'Non authentifié' },
          },
        },
        post: {
          tags: ['Projects'],
          summary: 'Créer un projet',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name'],
                  properties: {
                    name: { type: 'string', example: 'Portfolio' },
                    description: { type: 'string', example: 'Refonte du portfolio' },
                    color: { type: 'string', example: '#3b82f6' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Projet créé' },
            400: { description: 'Données invalides' },
          },
        },
      },
      '/api/projects/{id}': {
        get: {
          tags: ['Projects'],
          summary: 'Détail d\'un projet',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Projet trouvé' },
            404: { description: 'Projet introuvable' },
          },
        },
        patch: {
          tags: ['Projects'],
          summary: 'Modifier un projet',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    color: { type: 'string', example: '#3b82f6' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Projet mis à jour' },
            404: { description: 'Projet introuvable' },
          },
        },
        delete: {
          tags: ['Projects'],
          summary: 'Supprimer un projet',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Projet supprimé' },
            404: { description: 'Projet introuvable' },
          },
        },
      },
    },
  },
  apis: [],
}

module.exports = swaggerJsdoc(options)