'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabaseClient'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleUpdate(e) {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Password tidak sama')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    setMessage('Password berhasil diubah. Mengalihkan ke login...')
    setTimeout(() => router.push('/login'), 1500)
  }

  return (
    <div className="auth-container">
      <form onSubmit={handleUpdate} className="auth-form">
        <h1>Set Password Baru</h1>
        {error && <div className="error-box">{error}</div>}
        {message && <div className="success-box">{message}</div>}
        <label>Password Baru</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        <label>Konfirmasi Password</label>
        <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={6} />
        <button type="submit" disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan Password'}</button>
      </form>
    </div>
  )
}
