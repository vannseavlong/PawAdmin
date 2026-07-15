import { z } from 'zod'

const applicationStatusSchema = z.union([
  z.literal('pending'),
  z.literal('approved'),
  z.literal('rejected'),
])
export type ApplicationStatus = z.infer<typeof applicationStatusSchema>

const shopTypeSchema = z.union([
  z.literal('service'),
  z.literal('product'),
  z.literal('both'),
])
export type ShopType = z.infer<typeof shopTypeSchema>

// Speculative shape for the multi-store pivot's `POST /merchant/apply`
// submission, as reviewed by an admin — see admin_portal/TODO.md's "Planned:
// Multi-store / marketplace pivot" Phase 1. Not yet built in `paw_sheetDB` /
// documented in ADMIN_API.md; align this with the real response once the
// `GET /admin/merchant-applications` endpoint ships.
const _merchantApplicationSchema = z.object({
  application_id: z.string(),
  shop_name: z.string(),
  applicant_name: z.string(),
  applicant_email: z.string(),
  phone: z.string().optional(),
  shop_type: shopTypeSchema,
  description: z.string().optional(),
  status: applicationStatusSchema,
  submitted_at: z.string(),
  reviewed_at: z.string().optional(),
  rejection_reason: z.string().optional(),
})
export type MerchantApplication = z.infer<typeof _merchantApplicationSchema>

export const merchantApplicationsListResponseSchema = z.object({
  applications: z.array(_merchantApplicationSchema),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
})
export type MerchantApplicationsListResponse = z.infer<
  typeof merchantApplicationsListResponseSchema
>
