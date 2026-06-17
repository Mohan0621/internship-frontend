import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NotificationCard } from '../ui/NotificationCard'
import type { Notification } from '@/types'

const base: Notification = {
  id: 'n1',
  userId: 'user-1',
  type: 'project_evaluated',
  title: 'Test Notification',
  message: 'Your project was evaluated',
  read: false,
  createdAt: new Date().toISOString(),
}

describe('NotificationCard', () => {
  it('shows title and message', () => {
    render(<NotificationCard notification={base} onMarkRead={vi.fn()} />)
    expect(screen.getByText('Test Notification')).toBeTruthy()
    expect(screen.getByText('Your project was evaluated')).toBeTruthy()
  })

  it('shows mark-as-read button when unread', () => {
    render(<NotificationCard notification={{ ...base, read: false }} onMarkRead={vi.fn()} />)
    expect(screen.getByLabelText('Mark as read')).toBeTruthy()
  })

  it('hides mark-as-read button when read', () => {
    render(<NotificationCard notification={{ ...base, read: true }} onMarkRead={vi.fn()} />)
    expect(screen.queryByLabelText('Mark as read')).toBeNull()
  })
})
