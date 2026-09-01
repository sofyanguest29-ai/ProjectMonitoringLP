'use client'
import { useEffect, useState, useCallback } from 'react'
import Navbar from '@/components/Navbar'
import ProjectForm from '@/components/ProjectForm'
import ProjectList from '@/components/ProjectList'
import { createClient } from '@/lib/supabaseClient'

export default function DashboardPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const loadProjects = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('projects').select('*').order('deadline', { ascending: true })
    setProjects(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  return (
    <>
      <Navbar />
      <main className="container">
        <ProjectForm onCreated={loadProjects} />
        <h2>Daftar Project</h2>
        {loading ? <p>Memuat...</p> : <ProjectList projects={projects} onChanged={loadProjects} />}
      </main>
    </>
  )
}
