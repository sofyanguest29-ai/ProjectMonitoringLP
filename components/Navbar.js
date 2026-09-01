'use client'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabaseClient'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">Project Monitor</div>
      <div className="navbar-links">
        <Link href="/dashboard" className={pathname === '/dashboard' ? 'active' : ''}>
          List Project
        </Link>
        <Link href="/dashboard/calendar" className={pathname === '/dashboard/calendar' ? 'active' : ''}>
          Calendar
        </Link>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  )
}
