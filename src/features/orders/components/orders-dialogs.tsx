import { OrdersDetailDialog } from './orders-detail-dialog'
import { useOrders } from './orders-provider'
import { OrdersStatusDialog } from './orders-status-dialog'

export function OrdersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow, targetStatus } =
    useOrders()

  if (!currentRow) return null

  return (
    <>
      <OrdersDetailDialog
        key={`booking-detail-${currentRow.booking_id}`}
        open={open === 'detail'}
        onOpenChange={() => {
          setOpen('detail')
          setTimeout(() => setCurrentRow(null), 500)
        }}
        currentRow={currentRow}
      />

      {targetStatus && (
        <OrdersStatusDialog
          key={`booking-status-${currentRow.booking_id}-${targetStatus}`}
          open={open === 'status'}
          onOpenChange={() => {
            setOpen('status')
            setTimeout(() => setCurrentRow(null), 500)
          }}
          currentRow={currentRow}
          targetStatus={targetStatus}
        />
      )}
    </>
  )
}
