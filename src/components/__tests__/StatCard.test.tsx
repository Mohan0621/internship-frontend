import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatCard } from '../ui/StatCard'
import { FolderOpen } from 'lucide-react'

describe('StatCard', () => {
  it('renders title and value', () => {
    render(<StatCard title="Total Projects" value={10} icon={FolderOpen} />)
    expect(screen.getByText('Total Projects')).toBeTruthy()
    expect(screen.getByText('10')).toBeTruthy()
  })

  it('renders trend up', () => {
    render(<StatCard title="Score" value={85} icon={FolderOpen} trend={{ value: 5, direction: 'up' }} />)
    expect(screen.getByText(/5%/)).toBeTruthy()
  })

  it('renders trend down', () => {
    render(<StatCard title="Score" value={70} icon={FolderOpen} trend={{ value: 3, direction: 'down' }} />)
    expect(screen.getByText(/3%/)).toBeTruthy()
  })
})
