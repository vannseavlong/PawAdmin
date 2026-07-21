import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ShopsDialogs } from './components/shops-dialogs'
import { ShopsProvider } from './components/shops-provider'
import { ShopsTable } from './components/shops-table'
import { fetchShops } from './data/shops-api'

const route = getRouteApi('/_authenticated/shops/')

const PAGE_LIMIT = 100

export function Shops() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['shops'],
    queryFn: () => fetchShops({ limit: PAGE_LIMIT }),
  })

  return (
    <ShopsProvider>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Shops</h2>
            <p className='text-muted-foreground'>
              Every shop on the marketplace. Suspend or reactivate a shop&apos;s
              storefront here.
            </p>
          </div>
        </div>
        {isError ? (
          <p className='text-destructive'>
            Failed to load shops. Please try again.
          </p>
        ) : (
          <ShopsTable
            data={isLoading ? [] : (data?.shops ?? [])}
            search={search}
            navigate={navigate}
          />
        )}
      </Main>

      <ShopsDialogs />
    </ShopsProvider>
  )
}
