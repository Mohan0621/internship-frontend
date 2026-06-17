import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Lightbulb, TrendingUp, Zap, Quote } from 'lucide-react'
import { useEvaluations } from '@/hooks/useEvaluations'
import { getProjectById } from '@/data'
import { ScoreRing } from '@/components/ui/ScoreRing'
import { CategoryScoreBar } from '@/components/ui/CategoryScoreBar'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import type { Project } from '@/types'

export default function EvaluationDetailPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const { evaluation, loading } = useEvaluations(projectId)
  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    if (projectId) getProjectById(projectId).then(setProject)
  }, [projectId])

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>

  if (!evaluation) return (
    <div className="text-center py-16 space-y-3">
      <p className="text-muted-foreground">No evaluation found for this project yet.</p>
      <Link to="/projects" className="text-primary hover:underline text-sm">← Back to Projects</Link>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/projects" className="p-2 rounded-md hover:bg-accent text-muted-foreground"><ArrowLeft className="h-5 w-5" /></Link>
        <div>
          <h2 className="text-xl font-semibold text-foreground">{project?.title ?? 'Evaluation Details'}</h2>
          <div className="flex items-center gap-2 mt-1">
            {project && <StatusBadge status={project.status} />}
            <span className="text-sm text-muted-foreground">{project?.domain}</span>
            {evaluation.evaluatedAt && <span className="text-sm text-muted-foreground">· Evaluated {formatDate(evaluation.evaluatedAt)}</span>}
          </div>
        </div>
      </div>

      {/* Score ring */}
      <Card>
        <CardContent className="flex flex-col items-center py-8">
          <ScoreRing score={evaluation.overallScore} grade={evaluation.grade} size="lg" animated />
          <p className="mt-4 text-sm text-muted-foreground">Overall Score</p>
        </CardContent>
      </Card>

      {/* Category scores */}
      <Card>
        <CardHeader><CardTitle className="text-base">Category Breakdown</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {evaluation.categoryScores.map(cs => (
            <CategoryScoreBar key={cs.category} category={cs.category} score={cs.score} maxScore={cs.maxScore} />
          ))}
        </CardContent>
      </Card>

      {/* AI Feedback */}
      <Card>
        <CardHeader><CardTitle className="text-base">AI Feedback</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="border-l-4 border-primary pl-4 bg-primary/5 py-3 rounded-r-lg">
            <Quote className="h-4 w-4 text-primary mb-1" />
            <p className="text-sm text-foreground italic">{evaluation.aiFeedback.overallComment}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-600"><Lightbulb className="h-4 w-4" /><h4 className="font-semibold text-sm">Strengths</h4></div>
              <ul className="space-y-1">{evaluation.aiFeedback.strengths.map((s, i) => <li key={i} className="text-sm text-muted-foreground flex gap-2"><span className="text-green-500 shrink-0">✓</span>{s}</li>)}</ul>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-yellow-600"><TrendingUp className="h-4 w-4" /><h4 className="font-semibold text-sm">Improvements</h4></div>
              <ul className="space-y-1">{evaluation.aiFeedback.areasOfImprovement.map((s, i) => <li key={i} className="text-sm text-muted-foreground flex gap-2"><span className="text-yellow-500 shrink-0">→</span>{s}</li>)}</ul>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-600"><Zap className="h-4 w-4" /><h4 className="font-semibold text-sm">Suggestions</h4></div>
              <ul className="space-y-1">{evaluation.aiFeedback.suggestions.map((s, i) => <li key={i} className="text-sm text-muted-foreground flex gap-2"><span className="text-blue-500 shrink-0">💡</span>{s}</li>)}</ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
