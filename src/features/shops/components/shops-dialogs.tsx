import { ShopsDetailDialog } from './shops-detail-dialog'
import { useShops } from './shops-provider'
import { ShopsStatusDialog } from './shops-status-dialog'

export function ShopsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow, targetStatus } = useShops()

  if (!currentRow) return null

  return (
    <>
      <ShopsDetailDialog
        key={`shop-detail-${currentRow.shop_id}`}
        open={open === 'detail'}
        onOpenChange={() => {
          setOpen('detail')
          setTimeout(() => setCurrentRow(null), 500)
        }}
        currentRow={currentRow}
      />

      {targetStatus && (
        <ShopsStatusDialog
          key={`shop-status-${currentRow.shop_id}-${targetStatus}`}
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
