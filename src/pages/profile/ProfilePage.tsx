import { useState, useEffect } from 'react'
import { Github, Linkedin, ExternalLink, Edit2, Save, X } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { getDashboardStats } from '@/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [stats, setStats] = useState({ totalProjects: 0, averageScore: 0, highestScore: 0, pendingEvaluations: 0 })
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', college: '', department: '', yearOfStudy: '', dateOfBirth: '', github: '', leetcode: '', linkedin: '' })

  useEffect(() => {
    if (user) {
      setForm({ fullName: user.fullName ?? '', email: user.email ?? '', phone: user.phone ?? '', college: user.college ?? '', department: user.department ?? '', yearOfStudy: String(user.yearOfStudy ?? ''), dateOfBirth: user.dateOfBirth ?? '', github: user.codingProfiles?.github ?? '', leetcode: user.codingProfiles?.leetcode ?? '', linkedin: user.codingProfiles?.linkedin ?? '' })
      getDashboardStats(user.id).then(setStats)
    }
  }, [user])

  function handleSave() {
    updateUser({ fullName: form.fullName, phone: form.phone, college: form.college, department: form.department, yearOfStudy: Number(form.yearOfStudy), dateOfBirth: form.dateOfBirth, codingProfiles: { github: form.github, leetcode: form.leetcode, linkedin: form.linkedin } })
    setEditing(false)
    toast.success('Profile updated!')
  }

  function handleCancel() {
    setEditing(false)
    if (user) setForm({ fullName: user.fullName ?? '', email: user.email ?? '', phone: user.phone ?? '', college: user.college ?? '', department: user.department ?? '', yearOfStudy: String(user.yearOfStudy ?? ''), dateOfBirth: user.dateOfBirth ?? '', github: user.codingProfiles?.github ?? '', leetcode: user.codingProfiles?.leetcode ?? '', linkedin: user.codingProfiles?.linkedin ?? '' })
  }

  const initials = user?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? 'U'

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Profile</CardTitle>
            {editing ? (
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave}><Save className="h-4 w-4 mr-1" />Save</Button>
                <Button size="sm" variant="outline" onClick={handleCancel}><X className="h-4 w-4 mr-1" />Cancel</Button>
              </div>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setEditing(true)}><Edit2 className="h-4 w-4 mr-1" />Edit Profile</Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6">
            <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold shrink-0">{initials}</div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Full Name', key: 'fullName' }, { label: 'Email', key: 'email', disabled: true },
                { label: 'Phone', key: 'phone' }, { label: 'Date of Birth', key: 'dateOfBirth', type: 'date' },
              ].map(({ label, key, disabled, type }) => (
                <div key={key} className="space-y-1">
                  <Label>{label}</Label>
                  {editing && !disabled ? <Input type={type ?? 'text'} value={form[key as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                    : <p className="text-sm text-foreground py-2">{form[key as keyof typeof form] || '—'}</p>}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic details */}
      <Card>
        <CardHeader><CardTitle className="text-base">Academic Details</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[{ label: 'College', key: 'college' }, { label: 'Department', key: 'department' }, { label: 'Year of Study', key: 'yearOfStudy', type: 'number' }].map(({ label, key, type }) => (
            <div key={key} className="space-y-1">
              <Label>{label}</Label>
              {editing ? <Input type={type ?? 'text'} value={form[key as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                : <p className="text-sm text-foreground py-2">{form[key as keyof typeof form] || '—'}</p>}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Coding profiles */}
      <Card>
        <CardHeader><CardTitle className="text-base">Coding Profiles</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[{ label: 'GitHub', key: 'github', Icon: Github }, { label: 'LeetCode', key: 'leetcode', Icon: ExternalLink }, { label: 'LinkedIn', key: 'linkedin', Icon: Linkedin }].map(({ label, key, Icon }) => (
            <div key={key} className="flex items-center gap-3">
              <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="flex-1 space-y-1">
                <Label>{label}</Label>
                {editing ? <Input value={form[key as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={`https://${key}.com/...`} />
                  : form[key as keyof typeof form] ? (
                    <a href={form[key as keyof typeof form]} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">{form[key as keyof typeof form]}</a>
                  ) : <p className="text-sm text-muted-foreground">Not connected</p>}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[{ label: 'Total Projects', value: stats.totalProjects }, { label: 'Avg Score', value: stats.averageScore || '—' }, { label: 'Best Score', value: stats.highestScore || '—' }, { label: 'Pending', value: stats.pendingEvaluations }].map(({ label, value }) => (
          <Card key={label}><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-primary">{value}</p><p className="text-xs text-muted-foreground mt-1">{label}</p></CardContent></Card>
        ))}
      </div>
    </div>
  )
}
