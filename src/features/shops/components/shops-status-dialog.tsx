import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { handleServerError } from '@/lib/handle-server-error'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { statusLabels } from '../data/data'
import { type Shop, type ShopStatus } from '../data/schema'
import { updateShopStatus } from '../data/shops-api'

type ShopsStatusDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Shop
  targetStatus: ShopStatus
}

export function ShopsStatusDialog({
  open,
  onOpenChange,
  currentRow,
  targetStatus,
}: ShopsStatusDialogProps) {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => updateShopStatus(currentRow.shop_id, targetStatus),
    onSuccess: () => {
      toast.success(
        `${currentRow.name} is now ${statusLabels[targetStatus].toLowerCase()}.`
      )
      queryClient.invalidateQueries({ queryKey: ['shops'] })
      onOpenChange(false)
    },
    onError: (error) => handleServerError(error),
  })

  const destructive = targetStatus === 'suspended'

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`${destructive ? 'Suspend' : 'Reactivate'} ${currentRow.name}?`}
      desc={
        <p>
          This moves <span className='font-bold'>{currentRow.name}</span> from{' '}
          <span className='font-bold'>{statusLabels[currentRow.status]}</span>{' '}
          to <span className='font-bold'>{statusLabels[targetStatus]}</span>.
          {destructive &&
            " The shop's catalog is hidden from customers while suspended."}
        </p>
      }
      confirmText={destructive ? 'Suspend' : 'Reactivate'}
      destructive={destructive}
      isLoading={isPending}
      handleConfirm={() => mutate()}
    />
  )
}
