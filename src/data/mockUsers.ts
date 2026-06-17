import type { User } from '@/types'

// ─── Student ──────────────────────────────────────────────────────────────────

export const currentUser: User = {
  id: 'user-1',
  fullName: 'Alex Johnson',
  email: 'alex@example.com',
  phone: '+1 555-0100',
  college: 'Tech University',
  department: 'Computer Science',
  yearOfStudy: 3,
  dateOfBirth: '2002-04-15',
  role: 'student',
  avatarUrl: undefined,
  codingProfiles: {
    github: 'https://github.com/alexjohnson',
    leetcode: 'https://leetcode.com/alexjohnson',
    linkedin: 'https://linkedin.com/in/alexjohnson',
  },
  createdAt: '2024-01-10T08:00:00Z',
}

// ─── Faculty ──────────────────────────────────────────────────────────────────

export const facultyUser: User = {
  id: 'user-2',
  fullName: 'Dr. Priya Nair',
  email: 'priya.nair@faculty.edu',
  phone: '+1 555-0200',
  college: 'Tech University',
  department: 'Computer Science',
  role: 'faculty',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
  codingProfiles: {
    linkedin: 'https://linkedin.com/in/priyanair',
    github: 'https://github.com/priyanair',
  },
  createdAt: '2023-06-01T08:00:00Z',
}

// ─── Judge ────────────────────────────────────────────────────────────────────

export const judgeUser: User = {
  id: 'user-3',
  fullName: 'Rahul Verma',
  email: 'rahul@judge.edu',
  phone: '+1 555-0300',
  role: 'judge',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul',
  codingProfiles: {
    linkedin: 'https://linkedin.com/in/rahulverma',
  },
  createdAt: '2023-08-15T08:00:00Z',
}

// ─── All Users ────────────────────────────────────────────────────────────────

export const mockUsers: User[] = [currentUser, facultyUser, judgeUser]

// ─── Mock Credentials (email → password) ─────────────────────────────────────

export const MOCK_CREDENTIALS: Record<string, { password: string; userId: string }> = {
  'alex@example.com': { password: 'password123', userId: 'user-1' },
  'priya.nair@faculty.edu': { password: 'password123', userId: 'user-2' },
  'rahul@judge.edu': { password: 'password123', userId: 'user-3' },
}
