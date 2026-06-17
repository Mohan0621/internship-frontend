import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { User, SignupFormData } from '@/types'
import { loginUser, signupUser } from '@/data'

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ error?: string }>
  signup: (data: SignupFormData) => Promise<{ error?: string }>
  logout: () => void
  updateUser: (updated: Partial<User>) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Restore session from localStorage
    const storedToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user')
    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch {
        // ignore parse errors
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string, rememberMe = false) => {
    const result = await loginUser(email, password)
    if (!result) return { error: 'Invalid email or password' }
    setUser(result.user)
    setToken(result.token)
    const storage = rememberMe ? localStorage : sessionStorage
    storage.setItem('auth_token', result.token)
    storage.setItem('auth_user', JSON.stringify(result.user))
    return {}
  }, [])

  const signup = useCallback(async (data: SignupFormData) => {
    if (data.password !== data.confirmPassword) {
      return { error: 'Passwords do not match' }
    }
    const result = await signupUser({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      role: data.role,
    })
    if ('error' in result) return { error: result.error }
    setUser(result.user)
    setToken(result.token)
    sessionStorage.setItem('auth_token', result.token)
    sessionStorage.setItem('auth_user', JSON.stringify(result.user))
    return {}
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    sessionStorage.removeItem('auth_token')
    sessionStorage.removeItem('auth_user')
  }, [])

  const updateUser = useCallback((updated: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev
      const next = { ...prev, ...updated }
      // Persist updated user
      if (localStorage.getItem('auth_token')) {
        localStorage.setItem('auth_user', JSON.stringify(next))
      } else {
        sessionStorage.setItem('auth_user', JSON.stringify(next))
      }
      return next
    })
  }, [])

  const isAuthenticated = !!user && !!token

  return (
    <AuthContext.Provider value={{ user, isLoading, token, isAuthenticated, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
