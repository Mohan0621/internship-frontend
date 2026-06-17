import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { DOMAIN_COLORS } from '@/lib/constants'
import type { DomainDistribution } from '@/types'

export function DomainPieChart({ data }: { data: DomainDistribution[] }) {
  const total = data.reduce((s, d) => s + d.count, 0)
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={data} dataKey="count" nameKey="domain" cx="50%" cy="45%" outerRadius={80} label={({ percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}>
          {data.map((d, i) => <Cell key={i} fill={DOMAIN_COLORS[d.domain] ?? '#6b7280'} />)}
        </Pie>
        <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
          formatter={(v: unknown, name: unknown) => [`${v} (${((Number(v) / total) * 100).toFixed(1)}%)`, name]} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
