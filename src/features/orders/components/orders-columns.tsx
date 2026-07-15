import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { formatDate, statusLabels, statusStyles } from '../data/data'
import { type Booking } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const ordersColumns: ColumnDef<Booking>[] = [
  {
    accessorKey: 'booking_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Booking' />
    ),
    cell: ({ row }) => (
      <span className='font-mono text-xs text-muted-foreground'>
        {row.getValue('booking_id')}
      </span>
    ),
    enableSorting: false,
  },
  {
    id: 'pet',
    accessorFn: (row) => `${row.pet_name} (${row.pet_type})`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Pet' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>
        {row.original.pet_name}{' '}
        <span className='text-muted-foreground'>({row.original.pet_type})</span>
      </LongText>
    ),
  },
  {
    accessorKey: 'service_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Service' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-40'>{row.getValue('service_name')}</LongText>
    ),
  },
  {
    id: 'dates',
    accessorFn: (row) => `${row.start_date} to ${row.end_date}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Dates' />
    ),
    cell: ({ row }) => (
      <div className='text-nowrap'>
        {formatDate(row.original.start_date)} →{' '}
        {formatDate(row.original.end_date)}
      </div>
    ),
    enableSorting: false,
  },
  {
    id: 'owner',
    accessorFn: (row) => `${row.user_name} ${row.user_email}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Owner' />
    ),
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span>{row.original.user_name}</span>
        <span className='text-xs text-muted-foreground'>
          {row.original.user_email}
        </span>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'total',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Total' />
    ),
    cell: ({ row }) => <div>${row.original.total.toFixed(2)}</div>,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const { status } = row.original
      return (
        <Badge variant='outline' className={cn('capitalize', statusStyles.get(status))}>
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
