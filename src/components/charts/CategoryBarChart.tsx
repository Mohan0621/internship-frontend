import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { scoreToHex } from '@/lib/utils'
import type { CategoryAverage } from '@/types'

export function CategoryBarChart({ data }: { data: CategoryAverage[] }) {
  const short: Record<string, string> = {
    'Innovation': 'Innov', 'Code Quality': 'Code', 'Documentation': 'Docs',
    'Presentation': 'Pres', 'Technical Implementation': 'Tech', 'Scalability': 'Scale',
    'Security': 'Sec', 'Impact': 'Impact',
  }
  const chartData = data.map(d => ({ ...d, label: short[d.category] ?? d.category }))
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
        <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
          formatter={(v: unknown) => [v, 'Avg Score']} />
        <Bar dataKey="avgScore" radius={[4, 4, 0, 0]}>
          {chartData.map((d, i) => <Cell key={i} fill={scoreToHex(d.avgScore)} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
