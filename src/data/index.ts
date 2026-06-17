import { mockUsers, currentUser, facultyUser, judgeUser, MOCK_CREDENTIALS } from './mockUsers'
import { mockProjects } from './mockProjects'
import { mockEvaluations } from './mockEvaluations'
import { mockNotifications } from './mockNotifications'
import type { User, Project, Evaluation, Notification, ProjectFormData } from '@/types'
import { gradeFromScore } from '@/lib/utils'

export {
  mockUsers, currentUser, facultyUser, judgeUser,
  mockProjects, mockEvaluations, mockNotifications,
  gradeFromScore,
}

const delay = (ms = 300) => new Promise<void>(resolve => setTimeout(resolve, ms))

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function loginUser(email: string, password: string): Promise<{ user: User; token: string }> {
  await delay()
  const cred = MOCK_CREDENTIALS[email]
  if (!cred || cred.password !== password) throw new Error('Invalid email or password')
  const user = mockUsers.find(u => u.id === cred.userId)
  if (!user) throw new Error('User not found')
  return { user, token: `mock-token-${user.id}-${Date.now()}` }
}

export async function signupUser(data: { fullName: string; email: string; password: string; role: 'student' | 'faculty' | 'judge'; [key: string]: unknown }): Promise<{ user: User; token: string }> {
  await delay()
  if (mockUsers.find(u => u.email === data.email)) throw new Error('Email already registered')
  const newUser: User = {
    id: `user-${Date.now()}`, fullName: data.fullName, email: data.email, role: data.role,
    codingProfiles: {}, createdAt: new Date().toISOString(),
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.fullName)}`,
  }
  mockUsers.push(newUser)
  return { user: newUser, token: `mock-token-${newUser.id}-${Date.now()}` }
}

// ─── Users ───────────────────────────────────────────────────────────────────

export async function getUser(id: string): Promise<User | null> {
  await delay()
  return mockUsers.find(u => u.id === id) ?? null
}

export async function getCurrentUser(): Promise<User> {
  await delay()
  return currentUser
}

// ─── Projects ────────────────────────────────────────────────────────────────

export async function getProjects(studentId?: string): Promise<Project[]> {
  await delay()
  if (studentId) return mockProjects.filter(p => p.studentId === studentId)
  return [...mockProjects]
}

export async function getProject(id: string): Promise<Project | null> {
  await delay()
  return mockProjects.find(p => p.id === id) ?? null
}

export async function getProjectById(id: string): Promise<Project | null> {
  return getProject(id)
}

export async function submitProject(data: ProjectFormData | Record<string, unknown>, studentId?: string): Promise<Project> {
  await delay(500)
  const fd = data as ProjectFormData & { studentId?: string }
  const sid = studentId ?? fd.studentId ?? currentUser.id
  const newProject: Project = {
    id: `proj-${Date.now()}`, title: fd.title, teamName: fd.teamName, domain: fd.domain,
    description: fd.description, status: 'Pending',
    submittedAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    studentId: sid,
    links: { github: fd.githubUrl, demoVideo: fd.demoVideoUrl, deployedUrl: fd.deployedUrl },
    documents: {},
  }
  mockProjects.push(newProject)
  return newProject
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
  await delay()
  const idx = mockProjects.findIndex(p => p.id === id)
  if (idx === -1) throw new Error(`Project ${id} not found`)
  mockProjects[idx] = { ...mockProjects[idx], ...data, id, updatedAt: new Date().toISOString() }
  return mockProjects[idx]
}

export async function deleteProject(id: string): Promise<void> {
  await delay()
  const idx = mockProjects.findIndex(p => p.id === id)
  if (idx !== -1) mockProjects.splice(idx, 1)
}

// ─── Evaluations ─────────────────────────────────────────────────────────────

export async function getEvaluation(projectId: string): Promise<Evaluation | null> {
  await delay()
  return mockEvaluations.find(e => e.projectId === projectId) ?? null
}

export async function getEvaluationById(id: string): Promise<Evaluation | null> {
  await delay()
  return mockEvaluations.find(e => e.id === id) ?? null
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function getNotifications(userId: string): Promise<Notification[]> {
  await delay()
  return mockNotifications
    .filter(n => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function markNotificationRead(id: string): Promise<void> {
  await delay(100)
  const notif = mockNotifications.find(n => n.id === id)
  if (notif) notif.read = true
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  await delay(100)
  mockNotifications.filter(n => n.userId === userId).forEach(n => (n.read = true))
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export async function getDashboardStats(studentId: string) {
  await delay()
  const projects = mockProjects.filter(p => p.studentId === studentId)
  const evaluated = projects.filter(p => p.status === 'Evaluated')
  const scores = evaluated.map(p => p.score ?? 0)
  return {
    totalProjects: projects.length,
    projectsEvaluated: evaluated.length,
    averageScore: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
    pendingEvaluations: projects.filter(p => p.status === 'Pending' || p.status === 'Evaluating').length,
    highestScore: scores.length ? Math.max(...scores) : 0,
  }
}

export async function getScoreTrend(studentId: string) {
  await delay()
  return mockProjects
    .filter(p => p.studentId === studentId && p.status === 'Evaluated' && p.score !== undefined)
    .sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime())
    .slice(-10)
    .map(p => ({ date: p.submittedAt, score: p.score!, projectName: p.title }))
}
