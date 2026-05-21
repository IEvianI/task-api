const Project = require('../models/Project')

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAllByUser(req.user.id)
    return res.json({
      success: true,
      data: { projects, count: projects.length },
    })
  } catch (err) {
    console.error('getAllProjects error:', err)
    return res.status(500).json({ success: false, message: 'Erreur serveur.' })
  }
}

const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id, req.user.id)
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Projet introuvable.',
      })
    }
    return res.json({ success: true, data: { project } })
  } catch (err) {
    console.error('getProject error:', err)
    return res.status(500).json({ success: false, message: 'Erreur serveur.' })
  }
}

const createProject = async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      user_id: req.user.id,
    })
    return res.status(201).json({
      success: true,
      message: 'Projet créé.',
      data: { project },
    })
  } catch (err) {
    console.error('createProject error:', err)
    return res.status(500).json({ success: false, message: 'Erreur serveur.' })
  }
}

const updateProject = async (req, res) => {
  try {
    const project = await Project.update(req.params.id, req.user.id, req.body)
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Projet introuvable ou non autorisé.',
      })
    }
    return res.json({
      success: true,
      message: 'Projet mis à jour.',
      data: { project },
    })
  } catch (err) {
    console.error('updateProject error:', err)
    return res.status(500).json({ success: false, message: 'Erreur serveur.' })
  }
}

const deleteProject = async (req, res) => {
  try {
    const deleted = await Project.delete(req.params.id, req.user.id)
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Projet introuvable ou non autorisé.',
      })
    }
    return res.json({
      success: true,
      message: 'Projet supprimé.',
    })
  } catch (err) {
    console.error('deleteProject error:', err)
    return res.status(500).json({ success: false, message: 'Erreur serveur.' })
  }
}

module.exports = { getAllProjects, getProject, createProject, updateProject, deleteProject }
