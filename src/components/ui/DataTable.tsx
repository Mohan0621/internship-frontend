import { useState } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Column<T> {
  key: keyof T | string
  header: string
  sortable?: boolean
  render?: (value: unknown, row: T) => React.ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (row: T) => void
  keyExtractor?: (row: T) => string
}

export function DataTable<T extends Record<string, unknown>>({ data, columns, loading, emptyMessage = 'No data found', onRowClick, keyExtractor }: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  function handleSort(key: string) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const sorted = sortKey
    ? [...data].sort((a, b) => {
        const av = a[sortKey]; const bv = b[sortKey]
        const cmp = av < bv ? -1 : av > bv ? 1 : 0
        return sortDir === 'asc' ? cmp : -cmp
      })
    : data

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            {columns.map(col => (
              <th key={String(col.key)}
                className={cn('px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap', col.sortable && 'cursor-pointer select-none hover:text-foreground')}
                onClick={() => col.sortable && handleSort(String(col.key))}>
                <div className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && (
                    sortKey === String(col.key) ? (
                      sortDir === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    ) : <ChevronsUpDown className="h-4 w-4 opacity-40" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-t border-border">
                {columns.map((col, j) => (
                  <td key={j} className="px-4 py-3">
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  </td>
                ))}
              </tr>
            ))
          ) : sorted.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-muted-foreground">{emptyMessage}</td>
            </tr>
          ) : (
            sorted.map((row, i) => (
              <tr key={keyExtractor ? keyExtractor(row) : i}
                onClick={() => onRowClick?.(row)}
                className={cn('border-t border-border transition-colors', onRowClick && 'cursor-pointer hover:bg-muted/50')}>
                {columns.map(col => (
                  <td key={String(col.key)} className="px-4 py-3 whitespace-nowrap">
                    {col.render ? col.render(row[col.key as keyof T], row) : String(row[col.key as keyof T] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
