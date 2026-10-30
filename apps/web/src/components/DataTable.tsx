import type { ReactNode } from 'react'

export interface Column<T> {
  header: string
  render: (row: T) => ReactNode
  className?: string
}

interface DataTableProps<T> {
  rows: T[]
  columns: Column<T>[]
  getRowKey: (row: T) => string
  getRowClassName?: (row: T) => string
}

const CELL_CLASSES = 'px-4 md:px-6 py-4 whitespace-nowrap'

export function DataTable<T>({ rows, columns, getRowKey, getRowClassName }: DataTableProps<T>) {
  return (
    <div className="glass-card px-2 md:px-6 py-2 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map((column) => (
              <th key={column.header} className={`${CELL_CLASSES} text-left text-sm font-medium text-muted`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={getRowKey(row)}
              className={`border-b border-border transition-colors last:border-0 hover:bg-surface-hover ${getRowClassName?.(row) ?? ''}`}
            >
              {columns.map((column) => (
                <td key={column.header} className={`${CELL_CLASSES} ${column.className ?? ''}`}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}