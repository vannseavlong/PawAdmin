import { redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'

/**
 * Role-based page-content guards, layered on top of `_authenticated/route.tsx`'s
 * existing token-only check. There are only two roles that ever reach this
 * portal (email/password login and the admin Google OAuth flow both reject
 * anything else — see `user-auth-form.tsx` / `use-session-bootstrap.ts`), so
 * these are simple two-way splits rather than a general RBAC matrix.
 */

/** Use in `beforeLoad` on admin-only routes (Dashboard, Orders, Content, Users,
 * Merchant Applications, Shops) — a merchant JWT gets a 403 from all of those
 * admin endpoints today, so bounce them to their own dashboard instead. */
export function requireAdminRole() {
  const { user } = useAuthStore.getState().auth
  if (user?.role === 'merchant') {
    throw redirect({ to: '/my-shop' })
  }
}

/** Use in `beforeLoad` on merchant-only routes (My Shop, My Catalog). */
export function requireMerchantRole() {
  const { user } = useAuthStore.getState().auth
  if (user?.role !== 'merchant') {
    throw redirect({ to: '/' })
  }
}
