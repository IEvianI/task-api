const jwt = require('jsonwebtoken')
const User = require('../models/User')

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    const existing = await User.findByEmail(email)
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Un compte existe déjà avec cet email.',
      })
    }

    const user = await User.create({ name, email, password })
    const token = generateToken(user.id)

    return res.status(201).json({
      success: true,
      message: 'Compte créé avec succès.',
      data: { user, token },
    })
  } catch (err) {
    console.error('register error:', err)
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur.',
    })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findByEmail(email)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect.',
      })
    }

    const isValid = await User.comparePassword(password, user.password)
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect.',
      })
    }

    const token = generateToken(user.id)
    const { password: _, ...userWithoutPassword } = user

    return res.json({
      success: true,
      message: 'Connexion réussie.',
      data: { user: userWithoutPassword, token },
    })
  } catch (err) {
    console.error('login error:', err)
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur.',
    })
  }
}

const me = async (req, res) => {
  return res.json({
    success: true,
    data: { user: req.user },
  })
}

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body

    if (email && email !== req.user.email) {
      const existing = await User.findByEmail(email)
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'Cet email est déjà utilisé.',
        })
      }
    }

    const updated = await User.updateProfile(req.user.id, { name, email })
    return res.json({
      success: true,
      message: 'Profil mis à jour.',
      data: { user: updated },
    })
  } catch (err) {
    console.error('updateProfile error:', err)
    return res.status(500).json({ success: false, message: 'Erreur serveur.' })
  }
}

module.exports = { register, login, me, updateProfile }
