const router = require('express').Router()
const { body, param } = require('express-validator')
const { validate } = require('../middlewares/validate')
const { authenticate } = require('../middlewares/auth')
const {
  getAllProjects, getProject, createProject, updateProject, deleteProject,
} = require('../controllers/projectsController')

router.use(authenticate)

// GET /api/projects
router.get('/', getAllProjects)

// GET /api/projects/:id
router.get('/:id', [
  param('id').isInt({ min: 1 }).withMessage('ID invalide.'),
  validate,
], getProject)

// POST /api/projects
router.post('/', [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom du projet est requis.')
    .isLength({ max: 150 }).withMessage('Nom trop long.'),
  body('description').optional().trim(),
  body('color')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/).withMessage('Couleur invalide (format attendu: #RRGGBB).'),
  validate,
], createProject)

// PATCH /api/projects/:id
router.patch('/:id', [
  param('id').isInt({ min: 1 }).withMessage('ID invalide.'),
  body('name').optional().trim().isLength({ max: 150 }),
  body('description').optional().trim(),
  body('color').optional().matches(/^#[0-9A-Fa-f]{6}$/),
  validate,
], updateProject)

// DELETE /api/projects/:id
router.delete('/:id', [
  param('id').isInt({ min: 1 }).withMessage('ID invalide.'),
  validate,
], deleteProject)

module.exports = router
