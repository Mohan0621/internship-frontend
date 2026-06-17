import { useState, useEffect, useCallback } from 'react'
import type { Notification } from '@/types'
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '@/data'

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }
    setLoading(true)
    getNotifications(userId).then(data => {
      setNotifications(data)
      setLoading(false)
    })
  }, [userId])

  const unreadCount = notifications.filter(n => !n.read).length

  const markRead = useCallback(async (id: string) => {
    await markNotificationRead(id)
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n)),
    )
  }, [])

  const markAllRead = useCallback(async () => {
    if (!userId) return
    await markAllNotificationsRead(userId)
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [userId])

  return { notifications, loading, unreadCount, markRead, markAllRead }
}
