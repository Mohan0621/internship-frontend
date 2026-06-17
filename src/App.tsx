import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AppShell } from '@/components/layout/AppShell'
import { Toaster } from 'sonner'

// Lazy page imports
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'))
const SignupPage = React.lazy(() => import('./pages/auth/SignupPage'))
const DashboardHome = React.lazy(() => import('./pages/dashboard/DashboardHome'))
const ProfilePage = React.lazy(() => import('./pages/profile/ProfilePage'))
const SubmitProjectPage = React.lazy(() => import('./pages/projects/SubmitProjectPage'))
const MyProjectsPage = React.lazy(() => import('./pages/projects/MyProjectsPage'))
const EvaluationDetailPage = React.lazy(() => import('./pages/projects/EvaluationDetailPage'))
const AnalyticsPage = React.lazy(() => import('./pages/analytics/AnalyticsPage'))
const NotificationsPage = React.lazy(() => import('./pages/notifications/NotificationsPage'))
const SettingsPage = React.lazy(() => import('./pages/settings/SettingsPage'))
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'))

function Spinner() {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  )
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  if (isLoading) return <Spinner />
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function PublicGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  if (isLoading) return <Spinner />
  if (user) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AppShell>
        <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>}>
          {children}
        </Suspense>
      </AppShell>
    </AuthGuard>
  )
}

function AppRoutes() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<PublicGuard><LoginPage /></PublicGuard>} />
        <Route path="/signup" element={<PublicGuard><SignupPage /></PublicGuard>} />
        <Route path="/dashboard" element={<ProtectedLayout><DashboardHome /></ProtectedLayout>} />
        <Route path="/profile" element={<ProtectedLayout><ProfilePage /></ProtectedLayout>} />
        <Route path="/submit" element={<ProtectedLayout><SubmitProjectPage /></ProtectedLayout>} />
        <Route path="/projects" element={<ProtectedLayout><MyProjectsPage /></ProtectedLayout>} />
        <Route path="/evaluations/:projectId" element={<ProtectedLayout><EvaluationDetailPage /></ProtectedLayout>} />
        <Route path="/analytics" element={<ProtectedLayout><AnalyticsPage /></ProtectedLayout>} />
        <Route path="/notifications" element={<ProtectedLayout><NotificationsPage /></ProtectedLayout>} />
        <Route path="/settings" element={<ProtectedLayout><SettingsPage /></ProtectedLayout>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster richColors position="top-right" />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
