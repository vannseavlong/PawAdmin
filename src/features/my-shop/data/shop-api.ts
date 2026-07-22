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
  contact_email: string
  contact_phone: string
  hours: string
  category_id: string
  // string ('' clears it, unchanged if omitted) or a new file to upload
  logo: string | File
  banner: string | File
}>

// Always sent as multipart/form-data — logo/banner may be a File (upload), an
// empty string (clear), or omitted (leave unchanged); see ADMIN_API.md's
// "Merchant shop profile" section for the server-side contract.
export function updateMyShop(payload: ShopUpdatePayload) {
  const formData = new FormData()
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined) continue
    formData.append(key, value)
  }
  return apiClient.patchForm<{ shop: Shop }>('/merchant/shop', formData)
}
