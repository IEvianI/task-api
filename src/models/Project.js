const pool = require('../config/db')

const Project = {
  async findAllByUser(userId) {
    const { rows } = await pool.query(
      `SELECT
        p.*,
        COUNT(t.id) AS task_count,
        COUNT(t.id) FILTER (WHERE t.status = 'done') AS done_count
       FROM projects p
       LEFT JOIN tasks t ON t.project_id = p.id
       WHERE p.user_id = $1
       GROUP BY p.id
       ORDER BY p.created_at DESC`,
      [userId]
    )
    return rows
  },

  async findById(id, userId) {
    const { rows } = await pool.query(
      `SELECT p.*,
        COUNT(t.id) AS task_count,
        COUNT(t.id) FILTER (WHERE t.status = 'done') AS done_count
       FROM projects p
       LEFT JOIN tasks t ON t.project_id = p.id
       WHERE p.id = $1 AND p.user_id = $2
       GROUP BY p.id`,
      [id, userId]
    )
    return rows[0] || null
  },

  async create({ name, description, color, user_id }) {
    const { rows } = await pool.query(
      `INSERT INTO projects (name, description, color, user_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, description || null, color || '#3b82f6', user_id]
    )
    return rows[0]
  },

  async update(id, userId, { name, description, color }) {
    const { rows } = await pool.query(
      `UPDATE projects
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           color = COALESCE($3, color),
           updated_at = NOW()
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [name, description, color, id, userId]
    )
    return rows[0] || null
  },

  async delete(id, userId) {
    const { rowCount } = await pool.query(
      'DELETE FROM projects WHERE id = $1 AND user_id = $2',
      [id, userId]
    )
    return rowCount > 0
  },
}

module.exports = Project
