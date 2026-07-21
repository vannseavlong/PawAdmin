import { apiClient } from '@/lib/api-client'
import { type Order, type OrderStatus } from './schema'

export type OrderFilters = {
  status?: OrderStatus
  limit?: number
  offset?: number
}

export type OrdersListResponse = {
  orders: Order[]
  total: number
  limit: number
  offset: number
}

// Shop-scoped server-side from the caller's JWT — never accepts/sends a shop_id.
export function fetchMyOrders(filters: OrderFilters = {}) {
  return apiClient.get<OrdersListResponse>('/merchant/orders', {
    status: filters.status,
    limit: filters.limit,
    offset: filters.offset,
  })
}

export function updateOrderStatus(
  bookingId: string,
  userId: string,
  status: OrderStatus
) {
  return apiClient.patch<{ order: Order }>(`/merchant/orders/${bookingId}`, {
    user_id: userId,
    status,
  })
}
