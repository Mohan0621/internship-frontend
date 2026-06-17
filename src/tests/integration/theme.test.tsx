import { describe, it, expect } from 'vitest'
import { render, fireEvent, screen } from '@testing-library/react'
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext'

function ThemeButton() {
  const { theme, setTheme } = useTheme()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('system')}>System</button>
    </div>
  )
}

describe('Theme toggle integration', () => {
  it('applies dark class on dark theme', () => {
    render(<ThemeProvider><ThemeButton /></ThemeProvider>)
    fireEvent.click(screen.getByText('Dark'))
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('removes dark class on light theme', () => {
    render(<ThemeProvider><ThemeButton /></ThemeProvider>)
    fireEvent.click(screen.getByText('Light'))
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
