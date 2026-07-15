import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { statusLabels, statusStyles } from '../data/data'
import { type Shop } from '../data/schema'

type ShopsDetailDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Shop
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className='grid grid-cols-3 gap-2 py-1.5 text-sm'>
      <dt className='text-muted-foreground'>{label}</dt>
      <dd className='col-span-2'>{value}</dd>
    </div>
  )
}

export function ShopsDetailDialog({
  open,
  onOpenChange,
  currentRow,
}: ShopsDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle className='flex items-center gap-2'>
            {currentRow.name}
            <Badge
              variant='outline'
              className={cn('capitalize', statusStyles.get(currentRow.status))}
            >
              {statusLabels[currentRow.status]}
            </Badge>
          </DialogTitle>
          <DialogDescription>Shop {currentRow.shop_id}.</DialogDescription>
        </DialogHeader>
        <dl className='divide-y'>
          <Field
            label='Owner'
            value={currentRow.owner_user_id || 'Invite not yet redeemed'}
          />
          <Field label='Description' value={currentRow.description || '—'} />
          <Field label='Contact email' value={currentRow.contact_email || '—'} />
          <Field label='Contact phone' value={currentRow.contact_phone || '—'} />
          <Field label='Hours' value={currentRow.hours || '—'} />
        </dl>
      </DialogContent>
    </Dialog>
  )
}
