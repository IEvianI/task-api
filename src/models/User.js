const pool = require('../config/db')
const bcrypt = require('bcryptjs')

const User = {
  async findByEmail(email) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )
    return rows[0] || null
  },

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT id, name, email, created_at, updated_at FROM users WHERE id = $1',
      [id]
    )
    return rows[0] || null
  },

  async create({ name, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 12)
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email, hashedPassword]
    )
    return rows[0]
  },

  async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword)
  },

  async updateProfile(id, { name, email }) {
    const { rows } = await pool.query(
      `UPDATE users
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           updated_at = NOW()
       WHERE id = $3
       RETURNING id, name, email, updated_at`,
      [name, email, id]
    )
    return rows[0] || null
  },
}

module.exports = User
