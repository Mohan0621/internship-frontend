import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatDate } from '@/lib/utils'
import type { ScoreTrendPoint } from '@/types'

export function ScoreTrendChart({ data }: { data: ScoreTrendPoint[] }) {
  if (data.length < 2) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        Not enough data to display trend. Submit more projects.
      </div>
    )
  }
  const chartData = data.map(d => ({ ...d, dateLabel: formatDate(d.date) }))
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="dateLabel" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
        <Tooltip
          contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
          formatter={(v: unknown, _: unknown, props: { payload?: ScoreTrendPoint }) => [v, props.payload?.projectName ?? 'Score']}
        />
        <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
