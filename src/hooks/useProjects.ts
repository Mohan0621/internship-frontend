import { useState, useEffect, useCallback } from 'react'
import type { Project, ProjectFormData } from '@/types'
import { getProjects, submitProject, updateProject, deleteProject } from '@/data'
import { useAuth } from '@/contexts/AuthContext'

export function useProjects(studentId?: string) {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Resolve which studentId to use: explicit arg wins, then authed user
  const resolvedStudentId = studentId ?? user?.id

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getProjects(resolvedStudentId)
      setProjects(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }, [resolvedStudentId])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const createProject = useCallback(async (data: ProjectFormData) => {
    const targetId = resolvedStudentId
    if (!targetId) throw new Error('No student ID available')
    const project = await submitProject(data, targetId)
    setProjects(prev => [...prev, project])
    return project
  }, [resolvedStudentId])

  const editProject = useCallback(async (id: string, data: Partial<Project>) => {
    const updated = await updateProject(id, data)
    setProjects(prev => prev.map(p => p.id === id ? updated : p))
    return updated
  }, [])

  const removeProject = useCallback(async (id: string) => {
    await deleteProject(id)
    setProjects(prev => prev.filter(p => p.id !== id))
  }, [])

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    editProject,
    removeProject,
  }
}
