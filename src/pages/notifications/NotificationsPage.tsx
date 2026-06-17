import { useState } from 'react'
import { Bell } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useNotifications } from '@/hooks/useNotifications'
import { NotificationCard } from '@/components/ui/NotificationCard'
import { Button } from '@/components/ui/button'

type Tab = 'All' | 'Unread'

export default function NotificationsPage() {
  const { user } = useAuth()
  const { notifications, loading, unreadCount, markRead, markAllRead } = useNotifications(user?.id ?? '')
  const [tab, setTab] = useState<Tab>('All')

  const filtered = tab === 'Unread' ? notifications.filter(n => !n.read) : notifications
  const allRead = unreadCount === 0

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Bell className="h-5 w-5" />Notifications
          {unreadCount > 0 && <span className="text-sm bg-destructive text-destructive-foreground rounded-full px-2 py-0.5">{unreadCount}</span>}
        </h2>
        <Button variant="outline" size="sm" onClick={markAllRead} disabled={allRead}>Mark all as read</Button>
      </div>

      <div className="flex gap-1">
        {(['All', 'Unread'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${tab === t ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'}`}>
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 space-y-2">
          <Bell className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">{tab === 'Unread' ? 'All caught up! No unread notifications.' : 'No notifications yet.'}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(n => <NotificationCard key={n.id} notification={n} onMarkRead={markRead} />)}
        </div>
      )}
    </div>
  )
}
