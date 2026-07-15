import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { statusLabels, statusStyles } from '../data/data'
import { type Shop } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const shopsColumns: ColumnDef<Shop>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Shop' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-48 ps-3'>{row.getValue('name')}</LongText>
    ),
    enableHiding: false,
  },
  {
    id: 'owner',
    accessorFn: (row) => `${row.owner_name ?? ''} ${row.owner_email ?? ''}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Owner' />
    ),
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span>{row.original.owner_name || '—'}</span>
        {row.original.owner_email && (
          <span className='text-xs text-muted-foreground'>
            {row.original.owner_email}
          </span>
        )}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'contact_phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Contact' />
    ),
    cell: ({ row }) => (
      <span className='text-sm text-muted-foreground'>
        {row.getValue('contact_phone') || '—'}
      </span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const { status } = row.original
      return (
        <Badge
          variant='outline'
          className={cn('capitalize', statusStyles.get(status))}
        >
          {statusLabels[status]}
        </Badge>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
