import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

const colorMap = {
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
}

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  trend?: { value: number; direction: 'up' | 'down' | 'neutral' }
  color?: keyof typeof colorMap
}

export function StatCard({ title, value, icon: Icon, trend, color = 'blue' }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center shrink-0', colorMap[color])}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground truncate">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {trend && (
              <div className={cn('flex items-center gap-1 text-xs mt-0.5',
                trend.direction === 'up' ? 'text-green-600' : trend.direction === 'down' ? 'text-red-500' : 'text-muted-foreground'
              )}>
                {trend.direction === 'up' ? <TrendingUp className="h-3 w-3" /> :
                 trend.direction === 'down' ? <TrendingDown className="h-3 w-3" /> :
                 <Minus className="h-3 w-3" />}
                <span>{trend.value}% from last month</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
