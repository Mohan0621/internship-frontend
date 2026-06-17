import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FolderOpen, CheckCircle, TrendingUp, Clock, Award } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useNotifications } from '@/hooks/useNotifications'
import { StatCard } from '@/components/ui/StatCard'
import { DataTable, Column } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { NotificationCard } from '@/components/ui/NotificationCard'
import { ScoreTrendChart } from '@/components/charts/ScoreTrendChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getDashboardStats, getProjects, getScoreTrend } from '@/data'
import { formatDate } from '@/lib/utils'
import type { Project, ScoreTrendPoint } from '@/types'

export default function DashboardHome() {
  const { user } = useAuth()
  const { notifications, unreadCount, markRead } = useNotifications(user?.id ?? '')
  const [stats, setStats] = useState({ totalProjects: 0, projectsEvaluated: 0, averageScore: 0, pendingEvaluations: 0, highestScore: 0 })
  const [projects, setProjects] = useState<Project[]>([])
  const [trend, setTrend] = useState<ScoreTrendPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    Promise.all([getDashboardStats(user.id), getProjects(user.id), getScoreTrend(user.id)]).then(([s, p, t]) => {
      setStats(s); setProjects(p); setTrend(t); setLoading(false)
    })
  }, [user?.id])

  const recent5 = [...projects].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()).slice(0, 5)
  const latestEval = projects.filter(p => p.status === 'Evaluated').sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0]
  const unread3 = notifications.filter(n => !n.read).slice(0, 3)

  const columns: Column<Project>[] = [
    { key: 'title', header: 'Project Name', render: (_, r) => <span className="font-medium text-foreground">{r.title}</span> },
    { key: 'domain', header: 'Domain' },
    { key: 'status', header: 'Status', render: (_, r) => <StatusBadge status={r.status} /> },
    { key: 'score', header: 'Score', render: (_, r) => r.score != null ? <span className="font-bold">{r.score}</span> : <span className="text-muted-foreground">—</span> },
    { key: 'submittedAt', header: 'Submitted', render: (_, r) => formatDate(r.submittedAt) },
    { key: 'id', header: 'Action', render: (_, r) => <Link to={`/evaluations/${r.id}`} className="text-primary hover:underline text-sm">View</Link> },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Welcome back, {user?.fullName?.split(' ')[0]} 👋</h2>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Projects" value={stats.totalProjects} icon={FolderOpen} color="blue" />
        <StatCard title="Evaluated" value={stats.projectsEvaluated} icon={CheckCircle} color="green" />
        <StatCard title="Avg Score" value={stats.averageScore || '—'} icon={TrendingUp} color="purple" />
        <StatCard title="Pending" value={stats.pendingEvaluations} icon={Clock} color="orange" />
        <StatCard title="Best Score" value={stats.highestScore || '—'} icon={Award} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent projects */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Recent Projects</h3>
          <DataTable data={recent5 as unknown as Record<string, unknown>[]} columns={columns as Column<Record<string, unknown>>[]} loading={loading}
            emptyMessage="No projects yet. Submit your first project!" keyExtractor={r => String(r.id)} />
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Latest evaluation */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Latest Evaluation</CardTitle></CardHeader>
            <CardContent>
              {latestEval ? (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground truncate">{latestEval.title}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-foreground">{latestEval.score}</span>
                    <span className="text-sm text-muted-foreground">/ 100</span>
                    <span className="ml-auto text-lg font-bold text-primary">{latestEval.grade}</span>
                  </div>
                  <Link to={`/evaluations/${latestEval.id}`} className="text-xs text-primary hover:underline">View Details →</Link>
                </div>
              ) : <p className="text-sm text-muted-foreground">No evaluations yet</p>}
            </CardContent>
          </Card>

          {/* Unread notifications */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-semibold">Notifications {unreadCount > 0 && <span className="ml-1 text-xs bg-destructive text-destructive-foreground rounded-full px-1.5">{unreadCount}</span>}</CardTitle>
                <Link to="/notifications" className="text-xs text-primary hover:underline">View all</Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {unread3.length === 0 ? <p className="text-sm text-muted-foreground">All caught up!</p> :
                unread3.map(n => <NotificationCard key={n.id} notification={n} onMarkRead={markRead} />)}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Score trend */}
      <Card>
        <CardHeader><CardTitle className="text-sm font-semibold">Score Trend</CardTitle></CardHeader>
        <CardContent><ScoreTrendChart data={trend} /></CardContent>
      </Card>
    </div>
  )
}
