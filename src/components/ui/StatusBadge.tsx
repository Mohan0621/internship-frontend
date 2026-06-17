import { cn } from '@/lib/utils'
import type { ProjectStatus } from '@/types'

const config: Record<ProjectStatus, string> = {
  Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  Evaluating: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  Evaluated: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', config[status])}>
      {status}
    </span>
  )
}
