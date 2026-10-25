import { Router } from 'express'
import mongoose from 'mongoose'
import Project from '../models/Project.js'

const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 }).lean()
    res.json(projects)
  } catch (error) { next(error) }
})

router.post('/', async (req, res, next) => {
  try {
    const project = await Project.create(cleanPayload(req.body))
    res.status(201).json(project)
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ message: error.message })
    next(error)
  }
})

router.patch('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid project ID' })
    const project = await Project.findByIdAndUpdate(req.params.id, cleanPayload(req.body), { new: true, runValidators: true })
    if (!project) return res.status(404).json({ message: 'Project not found' })
    res.json(project)
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ message: error.message })
    next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid project ID' })
    const project = await Project.findByIdAndDelete(req.params.id)
    if (!project) return res.status(404).json({ message: 'Project not found' })
    res.json({ message: 'Project deleted' })
  } catch (error) { next(error) }
})

function cleanPayload(body = {}) {
  const allowed = ['title', 'category', 'status', 'skills', 'dueDate', 'description']
  const payload = {}
  for (const key of allowed) if (body[key] !== undefined) payload[key] = body[key]
  if (payload.dueDate === '') payload.dueDate = null
  if (typeof payload.title === 'string') payload.title = payload.title.trim()
  if (typeof payload.description === 'string') payload.description = payload.description.trim()
  if (Array.isArray(payload.skills)) payload.skills = payload.skills.map(s => String(s).trim()).filter(Boolean).slice(0, 30)
  return payload
}

export default router
