import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import LoginPage from '@/pages/auth/LoginPage'

const navigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => navigate }
})

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MemoryRouter initialEntries={['/login']}>{children}</MemoryRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

describe('Auth flow integration', () => {
  it('shows validation errors on empty submit', async () => {
    render(<Wrapper><LoginPage /></Wrapper>)
    const btn = screen.getByRole('button', { name: /sign in/i })
    fireEvent.click(btn)
    await waitFor(() => {
      expect(screen.queryByText(/valid email/i) || screen.queryByText(/required/i)).toBeTruthy()
    })
  })

  it('shows error for invalid credentials', async () => {
    render(<Wrapper><LoginPage /></Wrapper>)
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'wrong@test.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpass' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeTruthy()
    })
  })
})
