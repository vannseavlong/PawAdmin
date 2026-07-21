import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type CatalogItem } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

type CatalogItemsColumnActions = {
  onToggleActive: (item: CatalogItem) => void
  isToggling: boolean
}

export function createCatalogItemsColumns({
  onToggleActive,
  isToggling,
}: CatalogItemsColumnActions): ColumnDef<CatalogItem>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Name' />
      ),
      cell: ({ row }) => (
        <LongText className='max-w-48 ps-3'>{row.getValue('name')}</LongText>
      ),
      enableHiding: false,
    },
    {
      accessorKey: 'item_type',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Type' />
      ),
      cell: ({ row }) => (
        <Badge variant='outline' className='capitalize'>
          {row.getValue('item_type')}
        </Badge>
      ),
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: 'category',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Category' />
      ),
      cell: ({ row }) => (
        <span className='text-muted-foreground'>
          {row.getValue('category') || '—'}
        </span>
      ),
    },
    {
      accessorKey: 'price_from',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Price from' />
      ),
      cell: ({ row }) => {
        const price = row.getValue<number>('price_from')
        return <div>${price.toFixed(2)}</div>
      },
    },
    {
      id: 'stock',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Stock/Capacity' />
      ),
      cell: ({ row }) => {
        const item = row.original
        const value =
          item.item_type === 'product' ? item.quantity : item.daily_capacity
        return (
          <span className='text-muted-foreground'>
            {value ?? 'Unlimited'}
          </span>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Description' />
      ),
      cell: ({ row }) => (
        <LongText className='max-w-64 text-muted-foreground'>
          {row.getValue('description') || '—'}
        </LongText>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'active',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Active' />
      ),
      cell: ({ row }) => (
        <Switch
          checked={row.original.active}
          disabled={isToggling}
          onCheckedChange={() => onToggleActive(row.original)}
          aria-label={`Toggle ${row.original.name} active state`}
        />
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id) ? 'active' : 'inactive')
      },
      enableSorting: false,
    },
    {
      id: 'actions',
      cell: DataTableRowActions,
    },
  ]
}
