import { Sun, Moon, Monitor } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  variant?: 'icon' | 'dropdown'
}

export function ThemeToggle({ variant = 'icon' }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const Icon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor
  const cycle = () => setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light')

  if (variant === 'icon') {
    return (
      <button onClick={cycle} aria-label="Toggle theme" className="p-2 rounded-md hover:bg-accent text-muted-foreground transition-colors">
        <Icon className="h-5 w-5" />
      </button>
    )
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button aria-label="Toggle theme" className="p-2 rounded-md hover:bg-accent text-muted-foreground transition-colors">
          <Icon className="h-5 w-5" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={8} className="w-36 bg-card border border-border rounded-lg shadow-lg z-50 p-1">
          {(['light', 'dark', 'system'] as const).map(t => (
            <DropdownMenu.Item key={t} onSelect={() => setTheme(t)}
              className={cn('flex items-center gap-2 px-2 py-1.5 text-sm rounded-md cursor-pointer outline-none capitalize',
                theme === t ? 'bg-primary/10 text-primary' : 'hover:bg-accent text-foreground')}>
              {t === 'light' ? <Sun className="h-4 w-4" /> : t === 'dark' ? <Moon className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
              {t}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
