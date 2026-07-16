import { createFileRoute } from '@tanstack/react-router'
import { requireMerchantRole } from '@/lib/route-guards'
import { MyShop } from '@/features/my-shop'

export const Route = createFileRoute('/_authenticated/my-shop/')({
  beforeLoad: requireMerchantRole,
  component: MyShop,
})
