import { z } from 'zod'

const shopStatusSchema = z.union([
  z.literal('pending'),
  z.literal('active'),
  z.literal('suspended'),
])
export type ShopStatus = z.infer<typeof shopStatusSchema>

// Speculative shape for the multi-store pivot's `shops` table — see
// admin_portal/TODO.md's "Planned: Multi-store / marketplace pivot" Phase 1.
// Not yet built in `paw_sheetDB` / documented in ADMIN_API.md; `owner_name`/
// `owner_email` are assumed denormalized onto the list response the same way
// `/admin/bookings` enriches bookings with `user_name`/`user_email` — align
// with the real response once `GET /admin/shops` ships.
const _shopSchema = z.object({
  shop_id: z.string(),
  owner_user_id: z.string(),
  owner_name: z.string().optional(),
  owner_email: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  logo: z.string().optional(),
  contact_email: z.string().optional(),
  contact_phone: z.string().optional(),
  hours: z.string().optional(),
  status: shopStatusSchema,
})
export type Shop = z.infer<typeof _shopSchema>

export const shopsListResponseSchema = z.object({
  shops: z.array(_shopSchema),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
})
export type ShopsListResponse = z.infer<typeof shopsListResponseSchema>

// Admin can only suspend an active shop or reactivate a suspended one —
// `pending` shops are waiting on the merchant to accept their invite and
// aren't a state an admin transitions manually.
export const nextStatusOptions: Record<ShopStatus, ShopStatus[]> = {
  pending: [],
  active: ['suspended'],
  suspended: ['active'],
}
