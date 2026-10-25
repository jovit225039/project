import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  category: { type: String, default: 'Web Development', trim: true },
  status: { type: String, enum: ['Planning', 'In Progress', 'Completed'], default: 'Planning' },
  skills: { type: [String], default: [] },
  dueDate: { type: Date, default: null },
  description: { type: String, default: '', maxlength: 2000, trim: true },
}, { timestamps: true })

export default mongoose.model('Project', projectSchema)
