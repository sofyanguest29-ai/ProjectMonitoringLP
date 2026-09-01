'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import CalendarView from '@/components/CalendarView'
import { createClient } from '@/lib/supabaseClient'

export default function CalendarPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('projects').select('*')
      setProjects(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <>
      <Navbar />
      <main className="container">
        {loading ? <p>Memuat...</p> : <CalendarView projects={projects} />}
      </main>
    </>
  )
}
