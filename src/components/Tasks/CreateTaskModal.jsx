import { useState } from 'react'
import api from '../../utils/api'

function CreateTaskModal({ isOpen, onClose, onTaskCreated, projectId }) { 

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium', 
    status: 'todo', 
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!formData.title.trim()) {
      setError('Task title is required')
      return
    }
    setIsLoading(true)
    try {
      const res = await api.post(`/projects/${projectId}/tasks`, formData)
      onTaskCreated(res.data.data)
      setFormData({ title: '', description: '', priority: 'medium', status: 'todo' })
      onClose()
    } catch(err) {
      setError(err.response?.data?.error || 'Failed to create task')
    } finally {
      setIsLoading(false)
    }
  }

  if(!isOpen) return null;

return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Create New Task</h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        {/* Error */}
        {error && <div style={styles.error}>❌ {error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          
          {/* Title */}
          <div style={styles.field}>
            <label style={styles.label}>Task Title *</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="My Awesome Task"
              style={styles.input}
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div style={styles.field}>
            <label style={styles.label}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What is this task about?"
              style={{ ...styles.input, height: 80, resize: "none" }}
              disabled={isLoading}
            />
          </div>

          {/* Priority */}
          <div style={styles.field}>
            <label style={styles.label}>Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              style={styles.input}
              disabled={isLoading}
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
          </div>

          {/* Status */}
          <div style={styles.field}>
            <label style={styles.label}>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={styles.input}
              disabled={isLoading}
            >
              <option value="todo">📋 Todo</option>
              <option value="in-progress">⚙️ In Progress</option>
              <option value="done">✅ Done</option>
            </select>
          </div>

          {/* Buttons */}
          <div style={styles.buttons}>
            <button
              type="button"
              onClick={onClose}
              style={styles.cancelBtn}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                ...styles.createBtn,
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              {isLoading ? "Creating..." : "Create →"}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#1e293b",
    borderRadius: 16,
    padding: 32,
    width: "100%",
    maxWidth: 480,
    border: "1px solid #334155",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 800,
    color: "#e2e8f0",
    margin: 0,
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#64748b",
    fontSize: 20,
    cursor: "pointer",
    padding: 4,
  },
  error: {
    background: "#450a0a",
    border: "1px solid #dc2626",
    color: "#fca5a5",
    padding: "10px 14px",
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 16,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  input: {
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: 8,
    padding: "12px 14px",
    color: "#e2e8f0",
    fontSize: 15,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  buttons: {
    display: "flex",
    gap: 12,
    justifyContent: "flex-end",
  },
  cancelBtn: {
    background: "transparent",
    border: "1px solid #334155",
    color: "#94a3b8",
    borderRadius: 8,
    padding: "10px 20px",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
  },
  createBtn: {
    background: "#2563eb",
    border: "none",
    color: "#fff",
    borderRadius: 8,
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 700,
  },
}

export default CreateTaskModal