const router = require('express').Router()
const { body, param } = require('express-validator')
const { validate } = require('../middlewares/validate')
const { authenticate } = require('../middlewares/auth')
const {
  getAllTasks, getTask, createTask, updateTask, deleteTask, getStats,
} = require('../controllers/tasksController')

router.use(authenticate)

// GET /api/tasks/stats
router.get('/stats', getStats)

// GET /api/tasks
router.get('/', getAllTasks)

// GET /api/tasks/:id
router.get('/:id', [
  param('id').isInt({ min: 1 }).withMessage('ID invalide.'),
  validate,
], getTask)

// POST /api/tasks
router.post('/', [
  body('title')
    .trim()
    .notEmpty().withMessage('Le titre est requis.')
    .isLength({ max: 255 }).withMessage('Titre trop long.'),
  body('description').optional().trim(),
  body('status')
    .optional()
    .isIn(['todo', 'in_progress', 'done']).withMessage('Statut invalide.'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Priorité invalide.'),
  body('due_date')
    .optional()
    .isISO8601().withMessage('Date invalide (format attendu: YYYY-MM-DD).'),
  body('project_id')
    .optional()
    .isInt({ min: 1 }).withMessage('project_id invalide.'),
  validate,
], createTask)

// PATCH /api/tasks/:id
router.patch('/:id', [
  param('id').isInt({ min: 1 }).withMessage('ID invalide.'),
  body('title').optional().trim().isLength({ max: 255 }),
  body('description').optional().trim(),
  body('status').optional().isIn(['todo', 'in_progress', 'done']),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('due_date').optional().isISO8601(),
  body('project_id').optional().isInt({ min: 1 }),
  validate,
], updateTask)

// DELETE /api/tasks/:id
router.delete('/:id', [
  param('id').isInt({ min: 1 }).withMessage('ID invalide.'),
  validate,
], deleteTask)

module.exports = router
