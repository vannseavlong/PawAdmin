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
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
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
    {
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
    },
  ],
}
