import { apiClient } from '@/lib/api-client'
import { type CatalogItem, type CatalogItemType } from './schema'

export type CatalogItemFilters = {
  item_type?: CatalogItemType
  active?: boolean
}

// `/merchant/catalog-items` (ADMIN_API.md § 6) — always scoped server-side to
// the caller's own shop from the JWT. Never send a `shop_id` here.
export function fetchCatalogItems(filters: CatalogItemFilters = {}) {
  return apiClient.get<{ items: CatalogItem[] }>('/merchant/catalog-items', {
    item_type: filters.item_type,
    active: filters.active,
  })
}

export type CatalogItemPayload = {
  name: string
  description?: string
  price_from: number
  item_type?: CatalogItemType
  icon?: string
  color?: string
  category?: string
  active?: boolean
  sort_order?: number
  quantity?: number
  daily_capacity?: number
}

export function createCatalogItem(payload: CatalogItemPayload) {
  return apiClient.post<{ item: CatalogItem }>(
    '/merchant/catalog-items',
    payload
  )
}

export function updateCatalogItem(
  itemId: string,
  payload: Partial<CatalogItemPayload>
) {
  return apiClient.patch<{ item: CatalogItem }>(
    `/merchant/catalog-items/${itemId}`,
    payload
  )
}

export function deleteCatalogItem(itemId: string) {
  return apiClient.delete<void>(`/merchant/catalog-items/${itemId}`)
}
