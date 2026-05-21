const pool = require('../config/db')

const Task = {
  async findAllByUser(userId, filters = {}) {
    let query = `
      SELECT
        t.*,
        p.name AS project_name,
        p.color AS project_color
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      WHERE t.user_id = $1
    `
    const params = [userId]
    let i = 2

    if (filters.status) {
      query += ` AND t.status = $${i++}`
      params.push(filters.status)
    }
    if (filters.priority) {
      query += ` AND t.priority = $${i++}`
      params.push(filters.priority)
    }
    if (filters.project_id) {
      query += ` AND t.project_id = $${i++}`
      params.push(filters.project_id)
    }
    if (filters.search) {
      query += ` AND (t.title ILIKE $${i} OR t.description ILIKE $${i})`
      params.push(`%${filters.search}%`)
      i++
    }

    query += ' ORDER BY t.created_at DESC'

    const { rows } = await pool.query(query, params)
    return rows
  },

  async findById(id, userId) {
    const { rows } = await pool.query(
      `SELECT t.*, p.name AS project_name, p.color AS project_color
       FROM tasks t
       LEFT JOIN projects p ON t.project_id = p.id
       WHERE t.id = $1 AND t.user_id = $2`,
      [id, userId]
    )
    return rows[0] || null
  },

  async create({ title, description, status, priority, due_date, project_id, user_id }) {
    const { rows } = await pool.query(
      `INSERT INTO tasks (title, description, status, priority, due_date, project_id, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, description, status || 'todo', priority || 'medium', due_date || null, project_id || null, user_id]
    )
    return rows[0]
  },

  async update(id, userId, fields) {
    const allowed = ['title', 'description', 'status', 'priority', 'due_date', 'project_id']
    const updates = []
    const params = []
    let i = 1

    for (const key of allowed) {
      if (fields[key] !== undefined) {
        updates.push(`${key} = $${i++}`)
        params.push(fields[key])
      }
    }

    if (!updates.length) return null

    updates.push(`updated_at = NOW()`)
    params.push(id, userId)

    const { rows } = await pool.query(
      `UPDATE tasks SET ${updates.join(', ')}
       WHERE id = $${i++} AND user_id = $${i}
       RETURNING *`,
      params
    )
    return rows[0] || null
  },

  async delete(id, userId) {
    const { rowCount } = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2',
      [id, userId]
    )
    return rowCount > 0
  },

  async getStats(userId) {
    const { rows } = await pool.query(
      `SELECT
        COUNT(*) FILTER (WHERE status = 'todo') AS todo,
        COUNT(*) FILTER (WHERE status = 'in_progress') AS in_progress,
        COUNT(*) FILTER (WHERE status = 'done') AS done,
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE due_date < NOW() AND status != 'done') AS overdue
       FROM tasks
       WHERE user_id = $1`,
      [userId]
    )
    return rows[0]
  },
}

module.exports = Task
