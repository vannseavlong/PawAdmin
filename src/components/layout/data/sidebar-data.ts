import {
  LayoutDashboard,
  ClipboardList,
  ClipboardCheck,
  PawPrint,
  Store,
  Users,
  Monitor,
  Bell,
  Palette,
  Settings,
  UserCog,
  Wrench,
  Command,
} from 'lucide-react'
import { type NavGroup, type SidebarData } from '../types'

const settingsNavGroup: NavGroup = {
  title: 'Other',
  items: [
    {
      title: 'Settings',
      icon: Settings,
      items: [
        {
          title: 'Profile',
          url: '/settings',
          icon: UserCog,
        },
        {
          title: 'Account',
          url: '/settings/account',
          icon: Wrench,
        },
        {
          title: 'Appearance',
          url: '/settings/appearance',
          icon: Palette,
        },
        {
          title: 'Notifications',
          url: '/settings/notifications',
          icon: Bell,
        },
        {
          title: 'Display',
          url: '/settings/display',
          icon: Monitor,
        },
      ],
    },
  ],
}

const baseSidebarData = {
  user: {
    name: 'Admin',
    email: 'admin@paw.local',
    avatar: '',
  },
  teams: [
    {
      name: 'Paw Admin',
      logo: Command,
      plan: 'Orders & Content',
    },
  ],
}

// Full admin nav — Dashboard/Orders/Content/Users hit `/admin/*` endpoints
// that 403 for a merchant JWT, so a merchant account never sees this group.
const adminSidebarData: SidebarData = {
  ...baseSidebarData,
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Orders',
          url: '/orders',
          icon: ClipboardList,
        },
        {
          title: 'Content',
          url: '/content',
          icon: PawPrint,
        },
        {
          title: 'Users',
          url: '/users',
          icon: Users,
        },
      ],
    },
    {
      title: 'Marketplace',
      items: [
        {
          title: 'Merchant Applications',
          url: '/merchant-applications',
          icon: ClipboardCheck,
        },
        {
          title: 'Shops',
          url: '/shops',
          icon: Store,
        },
      ],
    },
    settingsNavGroup,
  ],
}

// Merchant nav — scoped to the two merchant-facing pages
// (`/merchant/shop` → My Shop, `/merchant/catalog-items` → My Catalog) plus
// the generic Settings group. No Dashboard: the existing Dashboard page is
// built entirely from admin-only stats (`/admin/bookings`, `/admin/services`,
// `/admin/users`), so there's nothing on it a merchant account could load —
// dropped rather than shown empty/erroring.
const merchantSidebarData: SidebarData = {
  ...baseSidebarData,
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'My Shop',
          url: '/my-shop',
          icon: Store,
        },
        {
          title: 'My Catalog',
          url: '/my-catalog',
          icon: PawPrint,
        },
        {
          title: 'My Orders',
          url: '/my-orders',
          icon: ClipboardList,
        },
      ],
    },
    settingsNavGroup,
  ],
}

/** Backward-compatible default export — admin nav, same shape as before. */
export const sidebarData: SidebarData = adminSidebarData

export function getSidebarData(role?: string): SidebarData {
  return role === 'merchant' ? merchantSidebarData : adminSidebarData
}
