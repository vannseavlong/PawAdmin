import { apiClient } from '@/lib/api-client'
import {
  type Shop,
  type ShopStatus,
  type ShopsListResponse,
} from './schema'

export type ShopFilters = {
  status?: ShopStatus
  search?: string
  limit?: number
  offset?: number
}

export function fetchShops(filters: ShopFilters = {}) {
  return apiClient.get<ShopsListResponse>('/admin/shops', {
    status: filters.status,
    search: filters.search,
    limit: filters.limit,
    offset: filters.offset,
  })
}

export function updateShopStatus(shopId: string, status: ShopStatus) {
  return apiClient.patch<{ shop: Shop }>(`/admin/shops/${shopId}`, { status })
}
