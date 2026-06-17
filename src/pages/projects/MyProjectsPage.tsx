import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import * as Dialog from '@radix-ui/react-dialog'
import { useProjects } from '@/hooks/useProjects'
import { DataTable, Column } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import type { Project } from '@/types'

type StatusFilter = 'All' | 'Pending' | 'Evaluating' | 'Evaluated' | 'Rejected'

export default function MyProjectsPage() {
  const navigate = useNavigate()
  const { projects, loading, removeProject } = useProjects()
  const [filter, setFilter] = useState<StatusFilter>('All')
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)

  const filtered = filter === 'All' ? projects : projects.filter(p => p.status === filter)

  const columns: Column<Project>[] = [
    { key: 'title', header: 'Project Name', render: (_, r) => <span className="font-medium text-foreground">{r.title}</span> },
    { key: 'domain', header: 'Domain' },
    { key: 'status', header: 'Status', render: (_, r) => <StatusBadge status={r.status} /> },
    { key: 'score', header: 'Score', sortable: true, render: (_, r) => r.score != null ? <span className="font-bold">{r.score}</span> : <span className="text-muted-foreground">—</span> },
    { key: 'submittedAt', header: 'Submitted', sortable: true, render: (_, r) => formatDate(r.submittedAt) },
    {
      key: 'id', header: 'Actions', render: (_, r) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => navigate(`/evaluations/${r.id}`)}>View</Button>
          {r.status === 'Rejected' && <Button size="sm" variant="outline" onClick={() => navigate('/submit')}>Resubmit</Button>}
          {r.status === 'Pending' && <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => setDeleteTarget(r)}><Trash2 className="h-4 w-4" /></Button>}
        </div>
      )
    },
  ]

  async function handleDelete() {
    if (!deleteTarget) return
    await removeProject(deleteTarget.id)
    toast.success('Project deleted')
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-foreground">My Projects</h2>
        <Button onClick={() => navigate('/submit')}><Plus className="h-4 w-4 mr-1" />Submit New</Button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Filter:</span>
        <div className="flex gap-1 flex-wrap">
          {(['All', 'Pending', 'Evaluating', 'Evaluated', 'Rejected'] as StatusFilter[]).map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filter === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        data={filtered as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        loading={loading}
        emptyMessage="No projects found. Submit your first project!"
        keyExtractor={r => String(r.id)}
      />

      <Dialog.Root open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-xl p-6 w-full max-w-sm z-50 space-y-4">
            <Dialog.Title className="text-lg font-bold text-foreground">Delete Project</Dialog.Title>
            <p className="text-sm text-muted-foreground">Are you sure you want to delete "<strong>{deleteTarget?.title}</strong>"? This cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
