require('dotenv').config()
const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./config/swagger')

const authRoutes = require('./routes/auth')
const tasksRoutes = require('./routes/tasks')
const projectsRoutes = require('./routes/projects')

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares globaux
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Logging simple en dev
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`)
    next()
  })
}

// Documentation Swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'TaskAPI Docs',
  customCss: '.swagger-ui .topbar { background: #0f172a }',
}))
app.get('/api/docs.json', (_req, res) => res.json(swaggerSpec))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/tasks', tasksRoutes)
app.use('/api/projects', projectsRoutes)

// Health check
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'TaskAPI is running 🚀',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  })
})

// Documentation des routes
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'TaskAPI — REST API de gestion de tâches',
    version: '1.0.0',
    docs: `${process.env.APP_URL || 'http://localhost:3000'}/api/docs`,
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Créer un compte',
        'POST /api/auth/login': 'Se connecter',
        'GET /api/auth/me': 'Profil utilisateur (auth requise)',
        'PATCH /api/auth/me': 'Modifier le profil (auth requise)',
      },
      tasks: {
        'GET /api/tasks': 'Lister les tâches (filtres: status, priority, project_id, search)',
        'GET /api/tasks/stats': 'Statistiques des tâches',
        'GET /api/tasks/:id': 'Détail d\'une tâche',
        'POST /api/tasks': 'Créer une tâche',
        'PATCH /api/tasks/:id': 'Modifier une tâche',
        'DELETE /api/tasks/:id': 'Supprimer une tâche',
      },
      projects: {
        'GET /api/projects': 'Lister les projets',
        'GET /api/projects/:id': 'Détail d\'un projet',
        'POST /api/projects': 'Créer un projet',
        'PATCH /api/projects/:id': 'Modifier un projet',
        'DELETE /api/projects/:id': 'Supprimer un projet',
      },
    },
  })
})

// 404
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route introuvable.',
  })
})

// Erreur globale
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({
    success: false,
    message: 'Erreur serveur inattendue.',
  })
})

app.listen(PORT, () => {
  console.log(`🚀 TaskAPI démarré sur http://localhost:${PORT}`)
  console.log(`📋 Swagger docs : http://localhost:${PORT}/api/docs`)
  console.log(`❤️  Health check : http://localhost:${PORT}/health`)
})

module.exports = app