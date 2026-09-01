'use client'
import { createClient } from '@/lib/supabaseClient'
import { STATUS_OPTIONS } from './ProjectForm'

function statusLabel(value) {
  return STATUS_OPTIONS.find((o) => o.value === value)?.label ?? value
}

export default function ProjectList({ projects, onChanged }) {
  const supabase = createClient()

  async function handleDelete(id) {
    if (!confirm('Hapus project ini?')) return
    await supabase.from('projects').delete().eq('id', id)
    onChanged?.()
  }

  if (!projects.length) {
    return <p className="empty-state">Belum ada project.</p>
  }

  return (
    <table className="project-table">
      <thead>
        <tr>
          <th>Nama Project</th>
          <th>Deadline</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {projects.map((p) => (
          <tr key={p.id}>
            <td>{p.name}</td>
            <td>{p.deadline}</td>
            <td>
              <span className={`badge badge-${p.status}`}>{statusLabel(p.status)}</span>
            </td>
            <td>
              <button className="delete-btn" onClick={() => handleDelete(p.id)}>
                Hapus
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
