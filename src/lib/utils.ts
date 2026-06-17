import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, parseISO } from 'date-fns'
import type { Grade } from '@/types'

// ─── Class Name Utility ───────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

// ─── Date Utilities ───────────────────────────────────────────────────────────

/** Format an ISO date string as "Jan 15, 2025" */
export function formatDate(iso: string): string {
  try {
    return format(parseISO(iso), 'MMM dd, yyyy')
  } catch {
    return iso
  }
}

/** Format an ISO date string as relative time: "2 hours ago", "3 days ago" */
export function formatRelativeTime(iso: string): string {
  try {
    return formatDistanceToNow(parseISO(iso), { addSuffix: true })
  } catch {
    return iso
  }
}

// ─── Score / Grade Utilities ──────────────────────────────────────────────────

/**
 * Convert a numeric score (0–100) to a Grade letter.
 * A+ >= 95, A >= 90, A- >= 85, B+ >= 80, B >= 75, B- >= 70,
 * C+ >= 65, C >= 60, D >= 50, F < 50
 */
export function gradeFromScore(score: number): Grade {
  if (score >= 95) return 'A+'
  if (score >= 90) return 'A'
  if (score >= 85) return 'A-'
  if (score >= 80) return 'B+'
  if (score >= 75) return 'B'
  if (score >= 70) return 'B-'
  if (score >= 65) return 'C+'
  if (score >= 60) return 'C'
  if (score >= 50) return 'D'
  return 'F'
}

/**
 * Map a score to a semantic color token.
 * green >= 80, yellow >= 60, red < 60
 */
export function scoreToColor(score: number): 'green' | 'yellow' | 'red' {
  if (score >= 80) return 'green'
  if (score >= 60) return 'yellow'
  return 'red'
}

/**
 * Map a score to an actual hex color for use in charts.
 * green >= 80, yellow >= 60, red < 60
 */
export function scoreToHex(score: number): string {
  if (score >= 80) return '#22c55e'
  if (score >= 60) return '#eab308'
  return '#ef4444'
}

// ─── String Utilities ─────────────────────────────────────────────────────────

/** Format bytes as a human-readable file size: "1.5 MB", "500 KB", "800 B" */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Truncate a string to maxLength characters, appending "..." if truncated */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '...'
}
