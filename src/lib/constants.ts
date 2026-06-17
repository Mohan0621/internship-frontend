import type { ProjectDomain, EvaluationCategory, NotificationType, Grade } from '@/types'

// ─── Domain & Category Lists ──────────────────────────────────────────────────

export const PROJECT_DOMAINS: ProjectDomain[] = [
  'ML',
  'Deep Learning',
  'NLP',
  'Computer Vision',
  'Generative AI',
  'Web AI',
  'Other',
]

export const EVALUATION_CATEGORIES: EvaluationCategory[] = [
  'Innovation',
  'Code Quality',
  'Documentation',
  'Presentation',
  'Technical Implementation',
  'Scalability',
  'Security',
  'Impact',
]

export const VALID_GRADES: Grade[] = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'F']

// ─── Navigation ───────────────────────────────────────────────────────────────

export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'My Profile', href: '/profile', icon: 'User' },
  { label: 'Submit Project', href: '/submit', icon: 'Upload' },
  { label: 'My Projects', href: '/projects', icon: 'FolderOpen' },
  { label: 'Evaluations', href: '/evaluations', icon: 'ClipboardList' },
  { label: 'Analytics', href: '/analytics', icon: 'BarChart2' },
  { label: 'Notifications', href: '/notifications', icon: 'Bell' },
  { label: 'Settings', href: '/settings', icon: 'Settings' },
]

// ─── Notification Config ──────────────────────────────────────────────────────

export const NOTIFICATION_TYPE_CONFIG: Record<
  NotificationType,
  { label: string; icon: string; color: string }
> = {
  project_evaluated: {
    label: 'Project Evaluated',
    icon: 'CheckCircle',
    color: 'green',
  },
  new_feedback: {
    label: 'New Feedback',
    icon: 'MessageSquare',
    color: 'blue',
  },
  submission_deadline: {
    label: 'Submission Deadline',
    icon: 'Clock',
    color: 'orange',
  },
  project_accepted: {
    label: 'Project Accepted',
    icon: 'Star',
    color: 'green',
  },
  project_rejected: {
    label: 'Project Rejected',
    icon: 'XCircle',
    color: 'red',
  },
}

// ─── Status Config ────────────────────────────────────────────────────────────

export const STATUS_CONFIG = {
  Pending: { color: 'yellow', label: 'Pending' },
  Evaluating: { color: 'blue', label: 'Evaluating' },
  Evaluated: { color: 'green', label: 'Evaluated' },
  Rejected: { color: 'red', label: 'Rejected' },
}

// ─── Domain Colors (for charts) ───────────────────────────────────────────────

export const DOMAIN_COLORS: Record<ProjectDomain, string> = {
  'ML': '#6366f1',
  'Deep Learning': '#8b5cf6',
  'NLP': '#06b6d4',
  'Computer Vision': '#0ea5e9',
  'Generative AI': '#f59e0b',
  'Web AI': '#10b981',
  'Other': '#6b7280',
}
