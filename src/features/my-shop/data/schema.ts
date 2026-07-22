import { z } from 'zod'

const shopStatusSchema = z.union([
  z.literal('pending'),
  z.literal('active'),
  z.literal('suspended'),
])
export type ShopStatus = z.infer<typeof shopStatusSchema>

// Matches the `Shop` object documented in ADMIN_API.md § 5 — the same shape
// `/admin/shops` returns, just fetched/edited via the merchant-scoped
// `GET/PATCH /merchant/shop` instead (always the caller's own shop, no
// `shop_id` ever sent in the request). `status` is read-only here — only an
// admin can change it (`PATCH /admin/shops/:id`).
const _shopSchema = z.object({
  shop_id: z.string(),
  application_id: z.string().optional(),
  owner_user_id: z.string(),
  category_id: z.string().optional().default(''),
  name: z.string(),
  description: z.string().optional().default(''),
  logo: z.string().optional().default(''),
  banner: z.string().optional().default(''),
  contact_email: z.string().optional().default(''),
  contact_phone: z.string().optional().default(''),
  hours: z.string().optional().default(''),
  status: shopStatusSchema,
})
export type Shop = z.infer<typeof _shopSchema>

export const shopResponseSchema = z.object({
  shop: _shopSchema,
})
export type ShopResponse = z.infer<typeof shopResponseSchema>
