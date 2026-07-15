import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Booking, type BookingStatus } from '../data/schema'

type OrdersDialogType = 'detail' | 'status'

type OrdersContextType = {
  open: OrdersDialogType | null
  setOpen: (str: OrdersDialogType | null) => void
  currentRow: Booking | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Booking | null>>
  targetStatus: BookingStatus | null
  setTargetStatus: React.Dispatch<React.SetStateAction<BookingStatus | null>>
}

const OrdersContext = React.createContext<OrdersContextType | null>(null)

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<OrdersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Booking | null>(null)
  const [targetStatus, setTargetStatus] = useState<BookingStatus | null>(null)

  return (
    <OrdersContext
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        targetStatus,
        setTargetStatus,
      }}
    >
      {children}
    </OrdersContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useOrders = () => {
  const ordersContext = React.useContext(OrdersContext)

  if (!ordersContext) {
    throw new Error('useOrders has to be used within <OrdersContext>')
  }

  return ordersContext
}
