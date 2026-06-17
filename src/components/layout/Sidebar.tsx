import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, User, PlusCircle, FolderOpen, ClipboardCheck,
  BarChart2, Bell, Settings, LogOut, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

const NAV = [
  { label: 'Dashboard', href: '/dashboard', Icon: LayoutDashboard },
  { label: 'My Profile', href: '/profile', Icon: User },
  { label: 'Submit Project', href: '/submit', Icon: PlusCircle },
  { label: 'My Projects', href: '/projects', Icon: FolderOpen },
  { label: 'Evaluations', href: '/evaluations', Icon: ClipboardCheck },
  { label: 'Analytics', href: '/analytics', Icon: BarChart2 },
  { label: 'Notifications', href: '/notifications', Icon: Bell, isNotif: true },
  { label: 'Settings', href: '/settings', Icon: Settings },
]

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  unreadCount?: number
}

export function Sidebar({ isCollapsed, onToggle, unreadCount = 0 }: SidebarProps) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return (
    <aside className={cn(
      'flex flex-col h-screen bg-card border-r border-border transition-all duration-300 shrink-0',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      {/* Logo */}
      <div className={cn('flex items-center h-16 px-3 border-b border-border', isCollapsed ? 'justify-center' : 'justify-between')}>
        {!isCollapsed && <span className="font-bold text-primary text-lg truncate">EvalSystem</span>}
        <button onClick={onToggle} aria-label="Toggle sidebar"
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {NAV.map(({ label, href, Icon, isNotif }) => (
          <NavLink key={href} to={href}
            className={({ isActive }) => cn(
              'flex items-center gap-3 rounded-md px-2 py-2.5 text-sm font-medium transition-colors',
              isCollapsed ? 'justify-center' : '',
              isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            )}>
            <span className="relative shrink-0">
              <Icon className="h-5 w-5" />
              {isNotif && unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-0.5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </span>
            {!isCollapsed && <span className="flex-1 truncate">{label}</span>}
            {!isCollapsed && isNotif && unreadCount > 0 && (
              <span className="ml-auto h-5 min-w-5 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-border px-2 py-3">
        <button onClick={() => { logout(); navigate('/login') }}
          aria-label="Log out"
          className={cn(
            'flex items-center gap-3 w-full rounded-md px-2 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors',
            isCollapsed ? 'justify-center' : ''
          )}>
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Log out</span>}
        </button>
      </div>
    </aside>
  )
}
