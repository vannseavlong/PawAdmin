import { z } from 'zod'

const itemTypeSchema = z.union([z.literal('service'), z.literal('product')])
export type CatalogItemType = z.infer<typeof itemTypeSchema>

// Matches the `CatalogItem` object documented in ADMIN_API.md § 6
// (`/merchant/catalog-items`) — services or physical products a shop sells.
// `shop_id` is always the caller's own shop, set server-side; never sent by
// the client.
const _catalogItemSchema = z.object({
  item_id: z.string(),
  shop_id: z.string(),
  item_type: itemTypeSchema,
  name: z.string(),
  description: z.string().optional().default(''),
  price_from: z.number(),
  icon: z.string().optional().default(''),
  color: z.string().optional().default(''),
  category: z.string().optional().default(''),
  active: z.boolean(),
  sort_order: z.number(),
})
export type CatalogItem = z.infer<typeof _catalogItemSchema>

export const catalogItemsListResponseSchema = z.object({
  items: z.array(_catalogItemSchema),
})
