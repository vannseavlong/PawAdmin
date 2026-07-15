import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { handleServerError } from '@/lib/handle-server-error'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { updateBookingStatus } from '../data/bookings-api'
import { statusLabels } from '../data/data'
import { type Booking, type BookingStatus } from '../data/schema'

type OrdersStatusDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Booking
  targetStatus: BookingStatus
}

export function OrdersStatusDialog({
  open,
  onOpenChange,
  currentRow,
  targetStatus,
}: OrdersStatusDialogProps) {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      updateBookingStatus(
        currentRow.booking_id,
        currentRow.user_id,
        targetStatus
      ),
    onSuccess: () => {
      toast.success(
        `Booking for ${currentRow.pet_name} moved to "${statusLabels[targetStatus]}".`
      )
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      onOpenChange(false)
    },
    onError: (error) => handleServerError(error),
  })

  const destructive = targetStatus === 'cancelled'

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Move booking to "${statusLabels[targetStatus]}"?`}
      desc={
        <p>
          Booking <span className='font-mono'>{currentRow.booking_id}</span> for{' '}
          <span className='font-bold'>{currentRow.pet_name}</span> (
          {currentRow.service_name}) will move from{' '}
          <span className='font-bold'>{statusLabels[currentRow.status]}</span>{' '}
          to <span className='font-bold'>{statusLabels[targetStatus]}</span>.
          {destructive && ' This cancels the booking.'}
        </p>
      }
      confirmText={`Move to ${statusLabels[targetStatus]}`}
      destructive={destructive}
      isLoading={isPending}
      handleConfirm={() => mutate()}
    />
  )
}
