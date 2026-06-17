import { Menu, Bell, User, Sun, Moon, Monitor, LogOut, Settings } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import * as Popover from '@radix-ui/react-popover'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Avatar from '@radix-ui/react-avatar'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useNotifications } from '@/hooks/useNotifications'
import { cn } from '@/lib/utils'
import { formatRelativeTime } from '@/lib/utils'

interface HeaderProps {
  title: string
  onMobileMenuToggle: () => void
}

export function Header({ title, onMobileMenuToggle }: HeaderProps) {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const { notifications, unreadCount } = useNotifications(user?.id ?? '')
  const navigate = useNavigate()
  const recent5 = notifications.slice(0, 5)
  const initials = user?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? 'U'

  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor
  const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'

  return (
    <header className="h-16 flex items-center gap-3 px-4 border-b border-border bg-card shrink-0">
      {/* Mobile hamburger */}
      <button onClick={onMobileMenuToggle} aria-label="Open menu" className="lg:hidden p-2 rounded-md hover:bg-accent text-muted-foreground">
        <Menu className="h-5 w-5" />
      </button>

      {/* Title */}
      <h1 className="flex-1 text-lg font-semibold text-foreground truncate">{title}</h1>

      {/* Notifications */}
      <Popover.Root>
        <Popover.Trigger asChild>
          <button aria-label="Notifications" className="relative p-2 rounded-md hover:bg-accent text-muted-foreground transition-colors">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4 min-w-4 px-0.5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content align="end" sideOffset={8} className="w-80 bg-card border border-border rounded-lg shadow-lg z-50 p-2">
            <p className="text-sm font-semibold px-2 py-1 text-foreground">Notifications</p>
            {recent5.length === 0 ? (
              <p className="text-sm text-muted-foreground px-2 py-3">No notifications</p>
            ) : (
              recent5.map(n => (
                <div key={n.id} className={cn('px-2 py-2 rounded-md text-sm', !n.read && 'bg-primary/5')}>
                  <p className="font-medium text-foreground truncate">{n.title}</p>
                  <p className="text-muted-foreground text-xs truncate">{n.message}</p>
                  <p className="text-muted-foreground text-xs mt-0.5">{formatRelativeTime(n.createdAt)}</p>
                </div>
              ))
            )}
            <div className="border-t border-border mt-1 pt-1">
              <Link to="/notifications" className="block text-xs text-primary text-center py-1 hover:underline">View all</Link>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {/* Theme toggle */}
      <button onClick={() => setTheme(nextTheme)} aria-label="Toggle theme" className="p-2 rounded-md hover:bg-accent text-muted-foreground transition-colors">
        <ThemeIcon className="h-5 w-5" />
      </button>

      {/* Avatar + dropdown */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button aria-label="User menu" className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring">
            <Avatar.Root className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
              {user?.avatarUrl ? (
                <Avatar.Image src={user.avatarUrl} alt={user.fullName} className="h-full w-full object-cover" />
              ) : null}
              <Avatar.Fallback className="text-xs font-bold text-primary">{initials}</Avatar.Fallback>
            </Avatar.Root>
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content align="end" sideOffset={8} className="w-48 bg-card border border-border rounded-lg shadow-lg z-50 p-1">
            <div className="px-2 py-1.5 text-sm font-medium text-foreground truncate">{user?.fullName}</div>
            <div className="px-2 pb-1 text-xs text-muted-foreground truncate">{user?.email}</div>
            <DropdownMenu.Separator className="my-1 h-px bg-border" />
            <DropdownMenu.Item onSelect={() => navigate('/profile')} className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md cursor-pointer hover:bg-accent text-foreground outline-none">
              <User className="h-4 w-4" /> Profile
            </DropdownMenu.Item>
            <DropdownMenu.Item onSelect={() => navigate('/settings')} className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md cursor-pointer hover:bg-accent text-foreground outline-none">
              <Settings className="h-4 w-4" /> Settings
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="my-1 h-px bg-border" />
            <DropdownMenu.Item onSelect={() => { logout(); navigate('/login') }} className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md cursor-pointer hover:bg-destructive/10 text-destructive outline-none">
              <LogOut className="h-4 w-4" /> Log out
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </header>
  )
}
