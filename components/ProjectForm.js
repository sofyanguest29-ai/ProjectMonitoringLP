'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabaseClient'

export const STATUS_OPTIONS = [
  { value: 'not_started', label: 'Belum Mulai' },
  { value: 'in_progress', label: 'Berjalan' },
  { value: 'done', label: 'Selesai' },
  { value: 'delayed', label: 'Delay' },
]

export default function ProjectForm({ onCreated }) {
  const [name, setName] = useState('')
  const [deadline, setDeadline] = useState('')
  const [status, setStatus] = useState('not_started')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    const { error } = await supabase.from('projects').insert({
      name,
      deadline,
      status,
      created_by: user?.id,
    })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    setName('')
    setDeadline('')
    setStatus('not_started')
    onCreated?.()
  }

  return (
    <form onSubmit={handleSubmit} className="project-form">
      <h2>Buat Project Baru</h2>
      {error && <div className="error-box">{error}</div>}
      <div className="form-row">
        <div>
          <label>Nama Project</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Tanggal Deadline</label>
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
        </div>
        <div>
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Tambah'}
        </button>
      </div>
    </form>
  )
}
