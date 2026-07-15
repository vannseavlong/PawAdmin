import { apiClient } from '@/lib/api-client'
import { type Booking, type BookingStatus } from './schema'

export type BookingFilters = {
  status?: BookingStatus
  limit?: number
  offset?: number
}

export type BookingsListResponse = {
  bookings: Booking[]
  total: number
  limit: number
  offset: number
}

export function fetchBookings(filters: BookingFilters = {}) {
  return apiClient.get<BookingsListResponse>('/admin/bookings', {
    status: filters.status,
    limit: filters.limit,
    offset: filters.offset,
  })
}

export function updateBookingStatus(
  bookingId: string,
  userId: string,
  status: BookingStatus
) {
  return apiClient.patch<{ booking: Booking }>(`/admin/bookings/${bookingId}`, {
    user_id: userId,
    status,
  })
}
