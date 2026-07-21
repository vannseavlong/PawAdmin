import { z } from 'zod'

// Matches the `CatalogItem` object documented in ADMIN_API.md § 6, scoped
// client-side to `item_type: 'service'` rows only — physical products live
// in My Products (`src/features/my-products/data/schema.ts`), over the same
// underlying table. `shop_id` is always the caller's own shop, set
// server-side; never sent by the client.
const _catalogItemSchema = z.object({
  item_id: z.string(),
  shop_id: z.string(),
  item_type: z.literal('service'),
  name: z.string(),
  description: z.string().optional().default(''),
  price_from: z.number(),
  icon: z.string().optional().default(''),
  color: z.string().optional().default(''),
  category: z.string().optional().default(''),
  active: z.boolean(),
  sort_order: z.number(),
  // Optional — absent/undefined means "unlimited" concurrent bookings.
  daily_capacity: z.number().optional(),
})
export type CatalogItem = z.infer<typeof _catalogItemSchema>

export const catalogItemsListResponseSchema = z.object({
  items: z.array(_catalogItemSchema),
})
