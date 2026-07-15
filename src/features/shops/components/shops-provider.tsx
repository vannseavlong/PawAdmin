import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Shop, type ShopStatus } from '../data/schema'

type ShopsDialogType = 'detail' | 'status'

type ShopsContextType = {
  open: ShopsDialogType | null
  setOpen: (str: ShopsDialogType | null) => void
  currentRow: Shop | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Shop | null>>
  targetStatus: ShopStatus | null
  setTargetStatus: React.Dispatch<React.SetStateAction<ShopStatus | null>>
}

const ShopsContext = React.createContext<ShopsContextType | null>(null)

export function ShopsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<ShopsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Shop | null>(null)
  const [targetStatus, setTargetStatus] = useState<ShopStatus | null>(null)

  return (
    <ShopsContext
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
    </ShopsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useShops = () => {
  const shopsContext = React.useContext(ShopsContext)

  if (!shopsContext) {
    throw new Error('useShops has to be used within <ShopsContext>')
  }

  return shopsContext
}
