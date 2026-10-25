import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import projectRoutes from './routes/projects.js'

const app = express()
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' })
})
app.use('/api/projects', projectRoutes)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
})

const port = process.env.PORT || 5000
try {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student_skill_tracker')
  console.log('MongoDB connected')
} catch (error) {
  console.error('MongoDB connection failed:', error.message)
  console.error('Check your MONGO_URI and ensure MongoDB is running.')
  process.exit(1)
}
app.listen(port, () => console.log(`API running at http://localhost:${port}`))
