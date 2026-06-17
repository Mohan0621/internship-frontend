import { mockUsers, currentUser, facultyUser, judgeUser, MOCK_CREDENTIALS } from './mockUsers'
import { mockProjects } from './mockProjects'
import { mockEvaluations } from './mockEvaluations'
import { mockNotifications } from './mockNotifications'
import type { User, Project, Evaluation, Notification, ProjectFormData } from '@/types'
import { gradeFromScore } from '@/lib/utils'

// Re-export raw mock data for direct access when needed
export {
  mockUsers,
  currentUser,
  facultyUser,
  judgeUser,
  mockProjects,
  mockEvaluations,
  mockNotifications,
  gradeFromScore,
}

// Simulate async API latency
const delay = (ms = 300) => new Promise<void>(resolve => setTimeout(resolve, ms))

// ─── Auth API ──────────────────────────────────────────────────────────────────

/**
 * Authenticate a user by email and password.
 * Returns { user, token } on success, throws on invalid credentials.
 */
export async function loginUser(
  email: string,
  password: string,
): Promise<{ user: User; token: string }> {
  await delay()
  const cred = MOCK_CREDENTIALS[email]
  if (!cred || cred.password !== password) {
    throw new Error('Invalid email or password')
  }
  const user = mockUsers.find(u => u.id === cred.userId)
  if (!user) throw new Error('User not found')
  return { user, token: `mock-token-${user.id}-${Date.now()}` }
}

/**
 * Register a new user account.
 * Returns { user, token } on success, throws if email already registered.
 */
export async function signupUser(data: {
  fullName: string
  email: string
  password: string
  role: 'student' | 'faculty' | 'judge'
  [key: string]: unknown
}): Promise<{ user: User; token: string }> {
  await delay()
  if (mockUsers.find(u => u.email === data.email)) {
    throw new Error('Email already registered')
  }
  const newUser: User = {
    id: `user-${Date.now()}`,
    fullName: data.fullName,
    email: data.email,
    role: data.role,
    codingProfiles: {},
    createdAt: new Date().toISOString(),
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.fullName)}`,
  }
  mockUsers.push(newUser)
  return { user: newUser, token: `mock-token-${newUser.id}-${Date.now()}` }
}

// ─── User API ─────────────────────────────────────────────────────────────────

/** Get a user by ID. Returns null if not found. */
export async function getUser(id: string): Promise<User | null> {
  await delay()
  return mockUsers.find(u => u.id === id) ?? null
}

/**
 * Get the currently authenticated user.
 * In the mock layer this always returns the default student account.
 */
export async function getCurrentUser(): Promise<User> {
  await delay()
  return currentUser
}

// ─── Projects API ──────────────────────────────────────────────────────────────

/**
 * Get all projects, optionally filtered by studentId.
 * Pass no argument to retrieve all projects.
 */
export async function getProjects(studentId?: string): Promise<Project[]> {
  await delay()
  if (studentId) return mockProjects.filter(p => p.studentId === studentId)
  return [...mockProjects]
}

/** Get a single project by ID. Returns null if not found. */
export async function getProject(id: string): Promise<Project | null> {
  await delay()
  return mockProjects.find(p => p.id === id) ?? null
}

/** @deprecated Use getProject instead */
export async function getProjectById(id: string): Promise<Project | null> {
  return getProject(id)
}

/**
 * Submit a new project.
 * Accepts arbitrary form data — the underlying shape is ProjectFormData.
 */
export async function submitProject(data: ProjectFormData | Record<string, unknown>, studentId?: string): Promise<Project> {
  await delay(500)
  const formData = data as ProjectFormData & { studentId?: string }
  const resolvedStudentId = studentId ?? formData.studentId ?? currentUser.id
  const newProject: Project = {
    id: `proj-${Date.now()}`,
    title: formData.title,
    teamName: formData.teamName,
    domain: formData.domain,
    description: formData.description,
    status: 'Pending',
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    studentId: resolvedStudentId,
    links: {
      github: formData.githubUrl,
      demoVideo: formData.demoVideoUrl,
      deployedUrl: formData.deployedUrl,
    },
    documents: {},
  }
  mockProjects.push(newProject)
  return newProject
}

/** Update an existing project by ID with partial data. Returns the updated project. */
export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
  await delay()
  const idx = mockProjects.findIndex(p => p.id === id)
  if (idx === -1) throw new Error(`Project ${id} not found`)
  mockProjects[idx] = {
    ...mockProjects[idx],
    ...data,
    id, // prevent id mutation
    updatedAt: new Date().toISOString(),
  }
  return mockProjects[idx]
}

/** Delete a project by ID. */
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

export async function getCurrentUser(): Promise<User> {
  await delay()
  return currentUser
}

export async function getProject(id: string): Promise<Project | null> {
  await delay()
  return mockProjects.find(p => p.id === id) ?? null
}

// ─── Evaluations API ──────────────────────────────────────────────────────────

/** Get the evaluation for a given project ID. Returns null if not yet evaluated. */
export async function getEvaluation(projectId: string): Promise<Evaluation | null> {
  await delay()
  return mockEvaluations.find(e => e.projectId === projectId) ?? null
}

/** Get an evaluation by its own ID. Returns null if not found. */
export async function getEvaluationById(id: string): Promise<Evaluation | null> {
  await delay()
  return mockEvaluations.find(e => e.id === id) ?? null
}

// ─── Notifications API ────────────────────────────────────────────────────────

/** Get all notifications for a user, sorted newest first. */
export async function getNotifications(userId: string): Promise<Notification[]> {
  await delay()
  return mockNotifications
    .filter(n => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

/** Mark a single notification as read. */
export async function markNotificationRead(id: string): Promise<void> {
  await delay(100)
  const notif = mockNotifications.find(n => n.id === id)
  if (notif) notif.read = true
}

/** Mark all of a user's notifications as read. */
export async function markAllNotificationsRead(userId: string): Promise<void> {
  await delay(100)
  mockNotifications.filter(n => n.userId === userId).forEach(n => (n.read = true))
}

// ─── Analytics API ────────────────────────────────────────────────────────────

/** Compute aggregated dashboard stats for a student. */
export async function getDashboardStats(studentId: string) {
  await delay()
  const projects = mockProjects.filter(p => p.studentId === studentId)
  const evaluated = projects.filter(p => p.status === 'Evaluated')
  const scores = evaluated.map(p => p.score ?? 0)
  return {
    totalProjects: projects.length,
    projectsEvaluated: evaluated.length,
    averageScore: scores.length
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0,
    pendingEvaluations: projects.filter(
      p => p.status === 'Pending' || p.status === 'Evaluating',
    ).length,
    highestScore: scores.length ? Math.max(...scores) : 0,
  }
}

/** Get the score trend data points for a student's evaluated projects. */
export async function getScoreTrend(studentId: string) {
  await delay()
  return mockProjects
    .filter(p => p.studentId === studentId && p.status === 'Evaluated' && p.score !== undefined)
    .sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime())
    .slice(-10)
    .map(p => ({
      date: p.submittedAt,
      score: p.score!,
      projectName: p.title,
    }))
}
