import { apiClient } from '@/lib/api-client'
import { type MerchantApplyInput } from './schema'

type MerchantApplicationResponse = {
  application: {
    application_id: string
    shop_name: string
    status: string
  }
}

export function applyMerchant(data: MerchantApplyInput) {
  return apiClient.post<MerchantApplicationResponse>('/merchant/apply', data)
}
