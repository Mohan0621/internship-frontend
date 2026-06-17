import { useState, useEffect } from 'react'
import type { Evaluation } from '@/types'
import { getEvaluation } from '@/data'

export function useEvaluations(projectId?: string) {
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!projectId) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    getEvaluation(projectId)
      .then(data => {
        setEvaluation(data)
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'Failed to fetch evaluation')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [projectId])

  return { evaluation, loading, error }
}

// Keep backward-compatible named export for any existing callers
export { useEvaluations as useEvaluation }
