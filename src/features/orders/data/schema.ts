import { z } from 'zod'

export const bookingStatusSchema = z.union([
  z.literal('pending'),
  z.literal('confirmed'),
  z.literal('active'),
  z.literal('completed'),
  z.literal('cancelled'),
])
export type BookingStatus = z.infer<typeof bookingStatusSchema>

// Matches the `AdminBooking` object documented in ADMIN_API.md
// (`/admin/bookings`) — a cross-user view of every booking, fanned out from
// each user's own per-user sheet and merged by the backend.
const _bookingSchema = z.object({
  booking_id: z.string(),
  pet_name: z.string(),
  pet_type: z.string(),
  service_id: z.string(),
  service_name: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  daily_rate: z.number(),
  notes: z.string().optional(),
  status: bookingStatusSchema,
  nights: z.number(),
  total: z.number(),
  user_id: z.string(),
  user_name: z.string(),
  user_email: z.string(),
})
export type Booking = z.infer<typeof _bookingSchema>

export const bookingsListResponseSchema = z.object({
  bookings: z.array(_bookingSchema),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
})

// The admin-only status state machine documented in ADMIN_API.md:
//   pending -> confirmed -> active -> completed
//      \-------\----------\----------> cancelled (from any non-terminal state)
// `completed` and `cancelled` are terminal.
export const nextStatusOptions: Record<BookingStatus, BookingStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['active', 'cancelled'],
  active: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
}
