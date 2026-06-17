import { CheckCircle, MessageSquare, Clock, Star, XCircle, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatRelativeTime } from '@/lib/utils'
import type { Notification } from '@/types'

const iconMap = {
  project_evaluated: { Icon: CheckCircle, cls: 'text-green-500' },
  new_feedback: { Icon: MessageSquare, cls: 'text-blue-500' },
  submission_deadline: { Icon: Clock, cls: 'text-orange-500' },
  project_accepted: { Icon: Star, cls: 'text-green-500' },
  project_rejected: { Icon: XCircle, cls: 'text-red-500' },
}

interface NotificationCardProps {
  notification: Notification
  onMarkRead: (id: string) => void
}

export function NotificationCard({ notification, onMarkRead }: NotificationCardProps) {
  const { Icon, cls } = iconMap[notification.type] ?? { Icon: CheckCircle, cls: 'text-muted-foreground' }

  return (
    <div className={cn('flex gap-3 p-3 rounded-lg border border-border transition-colors', !notification.read && 'bg-primary/5 border-primary/20')}>
      <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', cls)} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{notification.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notification.message}</p>
        <p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(notification.createdAt)}</p>
      </div>
      {!notification.read && (
        <button onClick={() => onMarkRead(notification.id)} aria-label="Mark as read"
          className="shrink-0 p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
          <Check className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
