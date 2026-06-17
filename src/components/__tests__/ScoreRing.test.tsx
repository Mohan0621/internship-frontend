import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ScoreRing } from '../ui/ScoreRing'

// Mock recharts
vi.mock('recharts', () => ({
  RadialBarChart: ({ children }: any) => <div>{children}</div>,
  RadialBar: () => <div />,
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
}))

describe('ScoreRing', () => {
  it('displays score', () => {
    render(<ScoreRing score={84} grade="B+" />)
    expect(screen.getByText('84')).toBeTruthy()
  })

  it('displays grade', () => {
    render(<ScoreRing score={91} grade="A" />)
    expect(screen.getByText('A')).toBeTruthy()
  })

  it('renders for score 0', () => {
    render(<ScoreRing score={0} grade="F" />)
    expect(screen.getByText('0')).toBeTruthy()
  })
})
