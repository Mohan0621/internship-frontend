import { useEffect, useState } from 'react'
import { FolderOpen, TrendingUp, Award, BarChart2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getDashboardStats, getScoreTrend, getProjects } from '@/data'
import { StatCard } from '@/components/ui/StatCard'
import { ScoreTrendChart } from '@/components/charts/ScoreTrendChart'
import { CategoryBarChart } from '@/components/charts/CategoryBarChart'
import { DomainPieChart } from '@/components/charts/DomainPieChart'
import { MonthlySubmissionsChart } from '@/components/charts/MonthlySubmissionsChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ScoreTrendPoint, CategoryAverage, DomainDistribution, MonthlySubmissionPoint } from '@/types'
import { EVALUATION_CATEGORIES } from '@/lib/constants'
import { getEvaluation } from '@/data'

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ totalProjects: 0, projectsEvaluated: 0, averageScore: 0, pendingEvaluations: 0, highestScore: 0 })
  const [trend, setTrend] = useState<ScoreTrendPoint[]>([])
  const [catData, setCatData] = useState<CategoryAverage[]>([])
  const [domainData, setDomainData] = useState<DomainDistribution[]>([])
  const [monthlyData, setMonthlyData] = useState<MonthlySubmissionPoint[]>([])

  useEffect(() => {
    if (!user?.id) return
    Promise.all([getDashboardStats(user.id), getScoreTrend(user.id), getProjects(user.id)]).then(async ([s, t, projects]) => {
      setStats(s)
      setTrend(t)

      // Domain distribution
      const domMap: Record<string, number> = {}
      projects.forEach(p => { domMap[p.domain] = (domMap[p.domain] ?? 0) + 1 })
      setDomainData(Object.entries(domMap).map(([domain, count]) => ({ domain: domain as never, count })))

      // Monthly submissions
      const monthMap: Record<string, number> = {}
      projects.forEach(p => {
        const m = new Date(p.submittedAt).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
        monthMap[m] = (monthMap[m] ?? 0) + 1
      })
      setMonthlyData(Object.entries(monthMap).map(([month, count]) => ({ month, count })))

      // Category averages from evaluations
      const evalProjects = projects.filter(p => p.evaluationId)
      const catTotals: Record<string, { sum: number; count: number }> = {}
      for (const p of evalProjects) {
        const ev = await getEvaluation(p.id)
        if (ev) {
          ev.categoryScores.forEach(cs => {
            if (!catTotals[cs.category]) catTotals[cs.category] = { sum: 0, count: 0 }
            catTotals[cs.category].sum += cs.score
            catTotals[cs.category].count += 1
          })
        }
      }
      setCatData(EVALUATION_CATEGORIES.map(cat => ({ category: cat, avgScore: catTotals[cat] ? Math.round(catTotals[cat].sum / catTotals[cat].count) : 0 })))
    })
  }, [user?.id])

  const improvePct = trend.length >= 2 ? Math.round(((trend[trend.length - 1].score - trend[0].score) / (trend[0].score || 1)) * 100) : 0

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Analytics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Submissions" value={stats.totalProjects} icon={FolderOpen} color="blue" />
        <StatCard title="Average Score" value={stats.averageScore || '—'} icon={TrendingUp} color="purple" />
        <StatCard title="Best Score" value={stats.highestScore || '—'} icon={Award} color="green" />
        <StatCard title="Improvement" value={`${improvePct > 0 ? '+' : ''}${improvePct}%`} icon={BarChart2} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle className="text-sm">Score Trend</CardTitle></CardHeader><CardContent><ScoreTrendChart data={trend} /></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Category Scores</CardTitle></CardHeader><CardContent><CategoryBarChart data={catData} /></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Domain Distribution</CardTitle></CardHeader><CardContent>{domainData.length > 0 ? <DomainPieChart data={domainData} /> : <p className="text-sm text-muted-foreground text-center py-16">No data yet</p>}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Monthly Submissions</CardTitle></CardHeader><CardContent>{monthlyData.length > 0 ? <MonthlySubmissionsChart data={monthlyData} /> : <p className="text-sm text-muted-foreground text-center py-16">No data yet</p>}</CardContent></Card>
      </div>
    </div>
  )
}
