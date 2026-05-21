const jwt = require('jsonwebtoken')
const pool = require('../config/db')

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Token manquant. Veuillez vous connecter.',
    })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const { rows } = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [decoded.userId]
    )

    if (!rows.length) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur introuvable.',
      })
    }

    req.user = rows[0]
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expiré. Veuillez vous reconnecter.',
      })
    }
    return res.status(401).json({
      success: false,
      message: 'Token invalide.',
    })
  }
}

module.exports = { authenticate }
