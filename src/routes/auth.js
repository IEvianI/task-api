const router = require('express').Router()
const { body } = require('express-validator')
const { validate } = require('../middlewares/validate')
const { authenticate } = require('../middlewares/auth')
const { register, login, me, updateProfile } = require('../controllers/authController')

// POST /api/auth/register
router.post('/register', [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom est requis.')
    .isLength({ min: 2, max: 100 }).withMessage('Le nom doit faire entre 2 et 100 caractères.'),
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis.')
    .isEmail().withMessage('Email invalide.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis.')
    .isLength({ min: 6 }).withMessage('Le mot de passe doit faire au moins 6 caractères.'),
  validate,
], register)

// POST /api/auth/login
router.post('/login', [
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis.')
    .isEmail().withMessage('Email invalide.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis.'),
  validate,
], login)

// GET /api/auth/me
router.get('/me', authenticate, me)

// PATCH /api/auth/me
router.patch('/me', authenticate, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Le nom doit faire entre 2 et 100 caractères.'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Email invalide.')
    .normalizeEmail(),
  validate,
], updateProfile)

module.exports = router
