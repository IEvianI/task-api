const Task = require('../models/Task')

const getAllTasks = async (req, res) => {
  try {
    const { status, priority, project_id, search } = req.query
    const tasks = await Task.findAllByUser(req.user.id, {
      status, priority, project_id, search,
    })
    return res.json({
      success: true,
      data: { tasks, count: tasks.length },
    })
  } catch (err) {
    console.error('getAllTasks error:', err)
    return res.status(500).json({ success: false, message: 'Erreur serveur.' })
  }
}

const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id, req.user.id)
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tâche introuvable.',
      })
    }
    return res.json({ success: true, data: { task } })
  } catch (err) {
    console.error('getTask error:', err)
    return res.status(500).json({ success: false, message: 'Erreur serveur.' })
  }
}

const createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      user_id: req.user.id,
    })
    return res.status(201).json({
      success: true,
      message: 'Tâche créée.',
      data: { task },
    })
  } catch (err) {
    console.error('createTask error:', err)
    return res.status(500).json({ success: false, message: 'Erreur serveur.' })
  }
}

const updateTask = async (req, res) => {
  try {
    const task = await Task.update(req.params.id, req.user.id, req.body)
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tâche introuvable ou non autorisée.',
      })
    }
    return res.json({
      success: true,
      message: 'Tâche mise à jour.',
      data: { task },
    })
  } catch (err) {
    console.error('updateTask error:', err)
    return res.status(500).json({ success: false, message: 'Erreur serveur.' })
  }
}

const deleteTask = async (req, res) => {
  try {
    const deleted = await Task.delete(req.params.id, req.user.id)
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Tâche introuvable ou non autorisée.',
      })
    }
    return res.json({
      success: true,
      message: 'Tâche supprimée.',
    })
  } catch (err) {
    console.error('deleteTask error:', err)
    return res.status(500).json({ success: false, message: 'Erreur serveur.' })
  }
}

const getStats = async (req, res) => {
  try {
    const stats = await Task.getStats(req.user.id)
    return res.json({ success: true, data: { stats } })
  } catch (err) {
    console.error('getStats error:', err)
    return res.status(500).json({ success: false, message: 'Erreur serveur.' })
  }
}

module.exports = { getAllTasks, getTask, createTask, updateTask, deleteTask, getStats }
