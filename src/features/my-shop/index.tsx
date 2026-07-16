import { useQuery } from '@tanstack/react-query'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { MyShopForm } from './components/my-shop-form'
import { fetchMyShop } from './data/shop-api'

export function MyShop() {
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
            Manage the storefront details customers see in the mobile app.
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
        {data?.shop && <MyShopForm shop={data.shop} />}
      </Main>
    </>
  )
}
