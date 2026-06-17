import type { LucideIcon } from 'lucide-react'

// ─── User ────────────────────────────────────────────────────────────────────

/** Possible roles a user can hold in the system */
export type UserRole = 'student' | 'faculty' | 'judge'

/** External coding/professional profile links for a user */
export interface CodingProfiles {
  github?: string
  leetcode?: string
  linkedin?: string
}

/** Represents an authenticated user of the platform */
export interface User {
  id: string
  fullName: string
  email: string
  phone?: string
  college?: string
  department?: string
  yearOfStudy?: number
  /** ISO 8601 date string, e.g. "2002-05-14" */
  dateOfBirth?: string
  role: UserRole
  avatarUrl?: string
  codingProfiles: CodingProfiles
  /** ISO 8601 datetime string */
  createdAt: string
}

// ─── Project ─────────────────────────────────────────────────────────────────

/** Lifecycle status of a project submission */
export type ProjectStatus = 'Pending' | 'Evaluating' | 'Evaluated' | 'Rejected'

/** AI/ML domain a project belongs to */
export type ProjectDomain =
  | 'ML'
  | 'Deep Learning'
  | 'NLP'
  | 'Computer Vision'
  | 'Generative AI'
  | 'Web AI'
  | 'Other'

/** External URL links associated with a project */
export interface ProjectLinks {
  github?: string
  demoVideo?: string
  deployedUrl?: string
}

/** Uploaded document URLs for a project */
export interface ProjectDocuments {
  reportUrl?: string
  presentationUrl?: string
  additionalUrls?: string[]
}

/** A student project submission */
export interface Project {
  id: string
  title: string
  teamName: string
  domain: ProjectDomain
  description?: string
  status: ProjectStatus
  /** Overall score 0–100, present once evaluated */
  score?: number
  /** Grade string (e.g. "A+"), present once evaluated */
  grade?: string
  /** ISO 8601 datetime string */
  submittedAt: string
  /** ISO 8601 datetime string */
  updatedAt: string
  studentId: string
  links: ProjectLinks
  documents: ProjectDocuments
  /** Reference to the associated Evaluation record */
  evaluationId?: string
}

// ─── Evaluation ───────────────────────────────────────────────────────────────

/** The 8 categories scored during project evaluation */
export type EvaluationCategory =
  | 'Innovation'
  | 'Code Quality'
  | 'Documentation'
  | 'Presentation'
  | 'Technical Implementation'
  | 'Scalability'
  | 'Security'
  | 'Impact'

/** Score entry for a single evaluation category */
export interface CategoryScore {
  category: EvaluationCategory
  /** Score value between 0 and maxScore */
  score: number
  /** Maximum possible score for this category */
  maxScore: number
  comment?: string
}

/** AI-generated qualitative feedback for a project */
export interface AIFeedback {
  strengths: string[]
  areasOfImprovement: string[]
  suggestions: string[]
  overallComment: string
}

/** Full evaluation record for a submitted project */
export interface Evaluation {
  id: string
  projectId: string
  /** Aggregate score 0–100 */
  overallScore: number
  /** Grade derived from overallScore, e.g. "A+", "B", "F" */
  grade: string
  /** Exactly one entry per EvaluationCategory (8 total) */
  categoryScores: CategoryScore[]
  aiFeedback: AIFeedback
  /** ISO 8601 datetime string */
  evaluatedAt: string
  /** ID of the judge/faculty who reviewed, if manually evaluated */
  evaluatedBy?: string
}

// ─── Grade ────────────────────────────────────────────────────────────────────

/**
 * The complete set of valid grade values used by the evaluation system.
 * gradeFromScore() must always return a value from this union.
 */
export type Grade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'D' | 'F'

// ─── Notification ─────────────────────────────────────────────────────────────

/** Discriminated event type for a notification */
export type NotificationType =
  | 'project_evaluated'
  | 'new_feedback'
  | 'submission_deadline'
  | 'project_accepted'
  | 'project_rejected'

/** A notification delivered to a user */
export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  /** ISO 8601 datetime string */
  createdAt: string
  /** Optional deep-link URL, e.g. "/evaluations/proj-123" */
  actionUrl?: string
  /** Additional typed payload specific to the notification type */
  metadata?: Record<string, unknown>
}

// ─── Form Data ────────────────────────────────────────────────────────────────

/**
 * Accumulated data across all 4 steps of the project submission wizard.
 * File fields are only present client-side and are stripped before API calls.
 */
export interface ProjectFormData {
  // Step 1 – Basic Details
  title: string
  teamName: string
  domain: ProjectDomain
  description?: string
  // Step 2 – Project Links
  githubUrl?: string
  demoVideoUrl?: string
  deployedUrl?: string
  // Step 3 – Document Uploads
  reportFile?: File
  presentationFile?: File
  additionalFiles?: File[]
}

// ─── Upload ──────────────────────────────────────────────────────────────────

/** Tracks the state of a single file in the upload zone UI */
export interface UploadedFile {
  id: string
  name: string
  /** File size in bytes */
  size: number
  type: string
  status: 'uploading' | 'done' | 'error'
  /** Original File object, only present before upload completes */
  file?: File
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

/**
 * A sidebar navigation entry.
 * icon accepts a LucideIcon component or a plain string icon name for flexibility.
 */
export interface NavItem {
  label: string
  /** LucideIcon component reference, or icon name string as fallback */
  icon: LucideIcon | string
  href: string
  /** Optional badge count, e.g. unread notification count */
  badge?: number
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

/** Trend indicator for a StatCard metric */
export interface StatCardTrend {
  /** Percentage change value (absolute) */
  value: number
  direction: 'up' | 'down' | 'neutral'
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

/** Payload for the login form */
export interface LoginFormData {
  email: string
  password: string
  rememberMe?: boolean
}

/** Payload for the signup form */
export interface SignupFormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  role: UserRole
}

/** Shape of the AuthContext state */
export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

// ─── Theme ───────────────────────────────────────────────────────────────────

/** Available theme modes */
export type Theme = 'light' | 'dark' | 'system'

// ─── Analytics / Stats ────────────────────────────────────────────────────────

/** Aggregated stats shown on Dashboard and Analytics pages */
export interface DashboardStats {
  totalProjects: number
  projectsEvaluated: number
  averageScore: number
  pendingEvaluations: number
  highestScore: number
}

/** A single data point on the score trend line chart */
export interface ScoreTrendPoint {
  /** ISO 8601 date string */
  date: string
  /** Score 0–100 */
  score: number
  projectName: string
}

/** A single bar on the monthly submissions chart */
export interface MonthlySubmissionPoint {
  /** Month label, e.g. "Jan 2025" */
  month: string
  count: number
}

/** A single slice of the domain distribution pie chart */
export interface DomainDistribution {
  domain: ProjectDomain
  count: number
}

/** Average score per evaluation category for the category bar chart */
export interface CategoryAverage {
  category: string
  avgScore: number
}
