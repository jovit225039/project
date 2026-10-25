import { useEffect, useMemo, useState } from 'react'
import { BookOpen, BriefcaseBusiness, CheckCircle2, Clock3, Plus, Search, Trash2, Pencil, X, GraduationCap, Sparkles, Target, Code2 } from 'lucide-react'


const API = import.meta.env.PROD
  ? 'https://student-skill-project-tracker-api.onrender.com/api'
  : 'http://localhost:5000/api'

const demoProjects = [
  { _id: 'demo-1', title: 'Campus Event Portal', category: 'Web Development', status: 'In Progress', skills: ['React', 'CSS', 'REST API'], dueDate: '2026-11-20', description: 'A portal to publish campus events and manage registrations.' },
  { _id: 'demo-2', title: 'Personal Portfolio', category: 'UI/UX', status: 'Completed', skills: ['Figma', 'HTML', 'JavaScript'], dueDate: '2026-10-12', description: 'A portfolio to showcase coursework and projects.' },
  { _id: 'demo-3', title: 'Smart Attendance App', category: 'Mobile App', status: 'Planning', skills: ['Node.js', 'MongoDB'], dueDate: '2026-12-05', description: 'Explore a simple attendance workflow for student teams.' },
]
const emptyForm = { title: '', category: 'Web Development', status: 'Planning', skills: '', dueDate: '', description: '' }

export default function App() {
  const [projects, setProjects] = useState([])
  const [usingDemo, setUsingDemo] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  async function loadProjects() {
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API}/projects`)
      if (!res.ok) throw new Error('API unavailable')
      const data = await res.json()
      setProjects(data); setUsingDemo(false)
    } catch {
      setProjects(demoProjects); setUsingDemo(true)
      setError('Backend not connected — showing demo projects. Start the server and MongoDB to save real data.')
    } finally { setLoading(false) }
  }
  useEffect(() => { loadProjects() }, [])

  const visible = useMemo(() => projects.filter(p => {
    const q = search.toLowerCase()
    const matches = `${p.title} ${p.category} ${(p.skills || []).join(' ')}`.toLowerCase().includes(q)
    return matches && (filter === 'All' || p.status === filter)
  }), [projects, search, filter])

  const stats = [
    { label: 'Total projects', value: projects.length, icon: BriefcaseBusiness, tone: 'purple' },
    { label: 'In progress', value: projects.filter(p => p.status === 'In Progress').length, icon: Clock3, tone: 'blue' },
    { label: 'Completed', value: projects.filter(p => p.status === 'Completed').length, icon: CheckCircle2, tone: 'green' },
    { label: 'Skills tracked', value: new Set(projects.flatMap(p => p.skills || [])).size, icon: Sparkles, tone: 'orange' },
  ]

  function openNew() { setEditing(null); setForm(emptyForm); setModal(true) }
  function openEdit(p) { setEditing(p); setForm({ ...p, skills: (p.skills || []).join(', '), dueDate: p.dueDate ? p.dueDate.slice(0,10) : '' }); setModal(true) }
  function updateField(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })) }

  async function saveProject(e) {
    e.preventDefault(); setSaving(true)
    const payload = { ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean) }
    try {
      const url = editing ? `${API}/projects/${editing._id}` : `${API}/projects`
      const res = await fetch(url, { method: editing ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error('Could not save project')
      const saved = await res.json()
      setProjects(current => editing ? current.map(p => p._id === saved._id ? saved : p) : [saved, ...current])
      setUsingDemo(false); setError(''); setModal(false)
    } catch {
      setError('Could not save. Make sure the backend and MongoDB are running. Demo projects cannot be saved.')
    } finally { setSaving(false) }
  }

  async function deleteProject(p) {
    if (!window.confirm(`Delete "${p.title}"?`)) return
    try {
      const res = await fetch(`${API}/projects/${p._id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setProjects(current => current.filter(item => item._id !== p._id))
    } catch { setError('Could not delete this project. Check the backend connection.') }
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-icon"><GraduationCap size={22}/></div><div><b>SkillTrack</b><small>STUDENT WORKSPACE</small></div></div>
      <div className="nav-label">WORKSPACE</div>
      <div className="nav-item active"><BriefcaseBusiness size={18}/> My projects <span className="nav-count">{projects.length}</span></div>
      <div className="nav-item"><Target size={18}/> Skill development</div>
      <div className="nav-item"><BookOpen size={18}/> Learning journal</div>
      <div className="sidebar-bottom"><div className="mini-avatar">ST</div><div><b>Student workspace</b><small>Capstone project</small></div></div>
    </aside>
    <main className="main">
      <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <b>My projects</b></div><div className="profile"><div className="profile-avatar">S</div><div><b>Student</b><small>Personal dashboard</small></div></div></header>
      <section className="welcome">
        <div><div className="eyebrow"><Sparkles size={14}/> YOUR LEARNING, IN ONE PLACE</div><h1>Build skills. Track progress.</h1><p>Keep your projects organized and turn your learning goals into real outcomes.</p></div>
        <div className="welcome-art"><div className="art-circle"><Code2 size={34}/></div><div className="art-tag">Keep growing <span>↗</span></div></div>
      </section>
      {error && <div className="notice">{error}<button onClick={() => setError('')} aria-label="Dismiss"><X size={15}/></button></div>}
      <section className="stats-grid">{stats.map(s => <div className="stat-card" key={s.label}><div className={`stat-icon ${s.tone}`}><s.icon size={19}/></div><div className="stat-label">{s.label}</div><div className="stat-value">{s.value}</div><div className="stat-foot">Across your workspace</div></div>)}</section>
      <section className="projects-section">
        <div className="section-heading"><div><h2>My projects <span className="total-pill">{projects.length}</span></h2><p>Manage your work from first idea to final delivery.</p></div><button className="primary-btn" onClick={openNew}><Plus size={17}/> Add project</button></div>
        <div className="toolbar"><div className="searchbox"><Search size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects or skills..."/></div><div className="filters">{['All','Planning','In Progress','Completed'].map(f => <button key={f} onClick={() => setFilter(f)} className={filter === f ? 'filter active-filter' : 'filter'}>{f}</button>)}</div></div>
        {loading ? <div className="empty-state">Loading your workspace…</div> : visible.length === 0 ? <div className="empty-state"><div className="empty-icon"><BriefcaseBusiness size={25}/></div><h3>No projects found</h3><p>Add a project or change your search filters.</p><button className="primary-btn" onClick={openNew}><Plus size={16}/> Add project</button></div> :
          <div className="project-grid">{visible.map((p, i) => <article className="project-card" key={p._id}><div className="project-card-top"><div className={`project-symbol symbol-${i%3}`}><Code2 size={21}/></div><button className="icon-btn" title="Edit project" onClick={() => openEdit(p)}><Pencil size={16}/></button><button className="icon-btn delete-btn" title="Delete project" onClick={() => deleteProject(p)}><Trash2 size={16}/></button></div><div className="category">{p.category}</div><h3>{p.title}</h3><p className="description">{p.description || 'No description added yet.'}</p><div className="skills">{(p.skills || []).slice(0,4).map(skill => <span key={skill}>{skill}</span>)}</div><div className="project-footer"><span className={`status status-${p.status.toLowerCase().replace(' ','-')}`}><i/> {p.status}</span><span className="due-date">{p.dueDate ? `Due ${new Date(p.dueDate).toLocaleDateString(undefined,{month:'short',day:'numeric'})}` : 'No due date'}</span></div></article>)}</div>}
      </section>
      <footer>SkillTrack <span>•</span> Student Skill & Project Tracker <span className="footer-right">Learn something. Build something.</span></footer>
    </main>
    {modal && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setModal(false)}><form className="modal" onSubmit={saveProject}><div className="modal-head"><div><h2>{editing ? 'Edit project' : 'Add a project'}</h2><p>Capture the details and keep moving forward.</p></div><button type="button" className="icon-btn" onClick={() => setModal(false)}><X size={19}/></button></div>
      <label>Project title *<input required name="title" value={form.title} onChange={updateField} placeholder="e.g. Student Portfolio"/></label>
      <div className="form-row"><label>Category<select name="category" value={form.category} onChange={updateField}>{['Web Development','Mobile App','Data Science','UI/UX','AI / Machine Learning','IoT','Other'].map(x=><option key={x}>{x}</option>)}</select></label><label>Status<select name="status" value={form.status} onChange={updateField}>{['Planning','In Progress','Completed'].map(x=><option key={x}>{x}</option>)}</select></label></div>
      <label>Skills <span className="label-hint">(comma separated)</span><input name="skills" value={form.skills} onChange={updateField} placeholder="React, Node.js, MongoDB"/></label>
      <label>Due date<input type="date" name="dueDate" value={form.dueDate} onChange={updateField}/></label>
      <label>Description<textarea name="description" rows="3" value={form.description} onChange={updateField} placeholder="What are you building?"/></label>
      <div className="modal-actions"><button type="button" className="secondary-btn" onClick={() => setModal(false)}>Cancel</button><button className="primary-btn" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Create project'}</button></div>
    </form></div>}
    {usingDemo && <div className="demo-pill"><span/> Demo mode</div>}
  </div>
}
