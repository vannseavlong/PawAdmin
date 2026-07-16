import { apiClient } from '@/lib/api-client'
import { type Shop } from './schema'

// `GET/PATCH /merchant/shop` (ADMIN_API.md § 5) — always scoped server-side to
// the caller's own shop from the JWT. Never send a `shop_id` here.
export function fetchMyShop() {
  return apiClient.get<{ shop: Shop }>('/merchant/shop')
}

export type ShopUpdatePayload = Partial<{
  name: string
  description: string
  logo: string
  contact_email: string
  contact_phone: string
  hours: string
}>

export function updateMyShop(payload: ShopUpdatePayload) {
  return apiClient.patch<{ shop: Shop }>('/merchant/shop', payload)
}
