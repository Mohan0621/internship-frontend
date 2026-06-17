import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusBadge } from '../ui/StatusBadge'
import type { ProjectStatus } from '@/types'

const statuses: ProjectStatus[] = ['Pending', 'Evaluating', 'Evaluated', 'Rejected']

describe('StatusBadge', () => {
  statuses.forEach(status => {
    it(`renders ${status} badge`, () => {
      const { container } = render(<StatusBadge status={status} />)
      expect(screen.getByText(status)).toBeTruthy()
      expect(container.firstChild).toBeTruthy()
    })
  })

  it('renders non-empty for all statuses', () => {
    statuses.forEach(s => {
      const { container } = render(<StatusBadge status={s} />)
      expect(container.innerHTML).not.toBe('')
    })
  })
})
