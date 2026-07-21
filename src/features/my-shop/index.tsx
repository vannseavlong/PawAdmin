import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ShopEditDialog } from './components/shop-edit-dialog'
import { ShopProfilePreview } from './components/shop-profile-preview'
import { fetchMyShop } from './data/shop-api'

export function MyShop() {
  const [editOpen, setEditOpen] = useState(false)
  // Bumped on every Edit click to force a fresh `ShopEditDialog` mount (fresh
  // form/image state from the current `shop`, no stale edits from last time).
  const [editKey, setEditKey] = useState(0)
  const { data, isLoading, isError } = useQuery({
    queryKey: ['my-shop'],
    queryFn: () => fetchMyShop(),
  })

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>My Shop</h2>
          <p className='text-muted-foreground'>
            Preview of the storefront details customers see in the mobile app.
          </p>
        </div>

        {isError && (
          <p className='text-destructive'>
            Failed to load your shop. Please try again.
          </p>
        )}
        {isLoading && (
          <p className='text-muted-foreground'>Loading your shop…</p>
        )}
        {data?.shop && (
          <>
            <ShopProfilePreview
              shop={data.shop}
              onEdit={() => {
                setEditKey((k) => k + 1)
                setEditOpen(true)
              }}
            />
            <ShopEditDialog
              key={editKey}
              shop={data.shop}
              open={editOpen}
              onOpenChange={setEditOpen}
            />
          </>
        )}
      </Main>
    </>
  )
}
