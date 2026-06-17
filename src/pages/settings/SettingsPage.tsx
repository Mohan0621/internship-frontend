import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sun, Moon, Monitor } from 'lucide-react'
import { toast } from 'sonner'
import * as Tabs from '@radix-ui/react-tabs'
import * as Dialog from '@radix-ui/react-dialog'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Theme } from '@/types'

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [github, setGithub] = useState(user?.codingProfiles?.github ?? '')
  const [leetcode, setLeetcode] = useState(user?.codingProfiles?.leetcode ?? '')
  const [linkedin, setLinkedin] = useState(user?.codingProfiles?.linkedin ?? '')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [pwdError, setPwdError] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)

  function handleProfileSave() {
    updateUser({ phone, codingProfiles: { github, leetcode, linkedin } })
    toast.success('Settings saved!')
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) { const url = URL.createObjectURL(file); setAvatarPreview(url) }
  }

  function handlePasswordChange() {
    setPwdError('')
    if (newPwd !== confirmPwd) { setPwdError('Passwords do not match'); return }
    if (newPwd.length < 6) { setPwdError('Password must be at least 6 characters'); return }
    toast.success('Password changed!')
    setCurrentPwd(''); setNewPwd(''); setConfirmPwd('')
  }

  function handleDeleteAccount() {
    logout()
    navigate('/login')
  }

  const themes: { value: Theme; label: string; Icon: React.ElementType }[] = [
    { value: 'light', label: 'Light', Icon: Sun },
    { value: 'dark', label: 'Dark', Icon: Moon },
    { value: 'system', label: 'System', Icon: Monitor },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Settings</h2>
      <Tabs.Root defaultValue="profile">
        <Tabs.List className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
          {['profile', 'account', 'appearance'].map(t => (
            <Tabs.Trigger key={t} value={t} className="px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground">
              {t}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {/* Profile tab */}
        <Tabs.Content value="profile" className="mt-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/20 overflow-hidden flex items-center justify-center text-primary text-xl font-bold">
              {avatarPreview ? <img src={avatarPreview} alt="avatar" className="h-full w-full object-cover" /> : (user?.fullName?.slice(0, 2).toUpperCase() ?? 'U')}
            </div>
            <div>
              <Label htmlFor="avatar-upload">Change Avatar</Label>
              <Input id="avatar-upload" type="file" accept="image/*" className="mt-1 w-auto" onChange={handleAvatarChange} />
            </div>
          </div>
          <div className="space-y-1"><Label>Phone</Label><Input value={phone} onChange={e => setPhone(e.target.value)} /></div>
          <div className="space-y-1"><Label>GitHub URL</Label><Input value={github} onChange={e => setGithub(e.target.value)} /></div>
          <div className="space-y-1"><Label>LeetCode URL</Label><Input value={leetcode} onChange={e => setLeetcode(e.target.value)} /></div>
          <div className="space-y-1"><Label>LinkedIn URL</Label><Input value={linkedin} onChange={e => setLinkedin(e.target.value)} /></div>
          <Button onClick={handleProfileSave}>Save Changes</Button>
        </Tabs.Content>

        {/* Account tab */}
        <Tabs.Content value="account" className="mt-6 space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Change Password</h3>
            <div className="space-y-1"><Label>Current Password</Label><Input type="password" value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} /></div>
            <div className="space-y-1"><Label>New Password</Label><Input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} /></div>
            <div className="space-y-1"><Label>Confirm New Password</Label><Input type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} /></div>
            {pwdError && <p className="text-xs text-destructive">{pwdError}</p>}
            <Button onClick={handlePasswordChange}>Update Password</Button>
          </div>
          <div className="border-t border-border pt-6">
            <h3 className="font-semibold text-destructive mb-2">Danger Zone</h3>
            <p className="text-sm text-muted-foreground mb-3">Deleting your account is permanent and cannot be undone.</p>
            <Button variant="destructive" onClick={() => setDeleteOpen(true)}>Delete Account</Button>
          </div>
        </Tabs.Content>

        {/* Appearance tab */}
        <Tabs.Content value="appearance" className="mt-6 space-y-4">
          <h3 className="font-semibold text-foreground">Theme</h3>
          <div className="grid grid-cols-3 gap-3">
            {themes.map(({ value, label, Icon }) => (
              <Card key={value} onClick={() => setTheme(value)}
                className={cn('cursor-pointer transition-all', theme === value ? 'ring-2 ring-primary' : 'hover:border-primary/50')}>
                <CardContent className="flex flex-col items-center gap-2 p-4">
                  <Icon className={cn('h-8 w-8', theme === value ? 'text-primary' : 'text-muted-foreground')} />
                  <span className={cn('text-sm font-medium', theme === value ? 'text-primary' : 'text-foreground')}>{label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </Tabs.Content>
      </Tabs.Root>

      <Dialog.Root open={deleteOpen} onOpenChange={setDeleteOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-xl p-6 w-full max-w-sm z-50 space-y-4">
            <Dialog.Title className="text-lg font-bold text-destructive">Delete Account</Dialog.Title>
            <p className="text-sm text-muted-foreground">This will permanently delete your account and all your data. This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteAccount}>Confirm Delete</Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
