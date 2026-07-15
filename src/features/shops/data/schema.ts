import { z } from 'zod'

const shopStatusSchema = z.union([
  z.literal('pending'),
  z.literal('active'),
  z.literal('suspended'),
])
export type ShopStatus = z.infer<typeof shopStatusSchema>

// Matches `schemas/admin/shops.ts` / `GET /admin/shops` in paw_sheetDB (see
// ADMIN_API.md § 5). `owner_user_id` is blank until the shop reaches `active`
// (the merchant redeemed their invite) — there is no owner-name/email
// denormalization on this endpoint, unlike `/admin/bookings`'s user_name/user_email.
const _shopSchema = z.object({
  shop_id: z.string(),
  owner_user_id: z.string(),
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
