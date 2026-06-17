import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useAuth } from '@/contexts/AuthContext'
import { useNotifications } from '@/hooks/useNotifications'

const TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/profile': 'My Profile',
  '/submit': 'Submit Project',
  '/projects': 'My Projects',
  '/evaluations': 'Evaluations',
  '/analytics': 'Analytics',
  '/notifications': 'Notifications',
  '/settings': 'Settings',
}

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { user } = useAuth()
  const { unreadCount } = useNotifications(user?.id ?? '')
  const pathname = '/' + location.pathname.split('/')[1]
  const title = TITLES[pathname] ?? 'Dashboard'

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar isCollapsed={collapsed} onToggle={() => setCollapsed(c => !c)} unreadCount={unreadCount} />
      </div>

      {/* Mobile drawer */}
      <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40 lg:hidden" />
          <Dialog.Content className="fixed left-0 top-0 h-full z-50 lg:hidden focus:outline-none" aria-label="Navigation">
            <Sidebar isCollapsed={false} onToggle={() => setMobileOpen(false)} unreadCount={unreadCount} />
            <Dialog.Close className="absolute top-4 right-4 p-1 rounded-md bg-card text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Main */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header title={title} onMobileMenuToggle={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
