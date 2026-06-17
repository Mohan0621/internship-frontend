import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface CategoryScoreBarProps {
  category: string
  score: number
  maxScore?: number
  showLabel?: boolean
}

export function CategoryScoreBar({ category, score, maxScore = 100, showLabel = true }: CategoryScoreBarProps) {
  const [width, setWidth] = useState(0)
  const pct = Math.min(100, Math.max(0, (score / maxScore) * 100))
  const color = pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-red-500'

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 100)
    return () => clearTimeout(t)
  }, [pct])

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-foreground font-medium">{category}</span>
          <span className="text-sm font-bold text-foreground">{score}/{maxScore}</span>
        </div>
      )}
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-700', color)}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}
