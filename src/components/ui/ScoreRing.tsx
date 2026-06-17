import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'

const sizeMap = { sm: 120, md: 180, lg: 240 }

interface ScoreRingProps {
  score: number
  maxScore?: number
  grade?: string
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

export function ScoreRing({ score, maxScore = 100, grade, size = 'md', animated = true }: ScoreRingProps) {
  const pct = Math.min(100, Math.max(0, (score / maxScore) * 100))
  const color = pct >= 80 ? '#22c55e' : pct >= 60 ? '#eab308' : '#ef4444'
  const px = sizeMap[size]
  const data = [{ name: 'score', value: pct, fill: color }]

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: px, height: px }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart cx="50%" cy="50%" innerRadius="65%" outerRadius="90%" data={data} startAngle={90} endAngle={-270}>
          <RadialBar dataKey="value" cornerRadius={8} background={{ fill: 'hsl(var(--muted))' }} isAnimationActive={animated} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('font-bold text-foreground', size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-3xl' : 'text-xl')}>{score}</span>
        {grade && <span className={cn('font-semibold text-muted-foreground', size === 'lg' ? 'text-lg' : 'text-sm')}>{grade}</span>}
      </div>
    </div>
  )
}
