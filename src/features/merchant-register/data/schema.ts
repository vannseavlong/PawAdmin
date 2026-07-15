import { z } from 'zod'

// Matches `POST /merchant/apply` in paw_sheetDB (see ADMIN_API.md § 7) — public,
// unauthenticated shop-owner application submission.
export const merchantApplySchema = z.object({
  shop_name: z.string().min(1, 'Shop name is required.'),
  applicant_name: z.string().min(1, 'Your name is required.'),
  contact_email: z.email('Enter a valid email.'),
  contact_phone: z.string().optional(),
  description: z.string().optional(),
})
export type MerchantApplyInput = z.infer<typeof merchantApplySchema>
