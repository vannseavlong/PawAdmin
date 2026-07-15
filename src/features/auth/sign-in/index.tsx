import { useSearch } from '@tanstack/react-router'
import { AuthLayout } from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'

export function SignIn() {
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })

  return (
    <AuthLayout>
      <div className='space-y-1'>
        <h1 className='text-2xl font-bold tracking-tight'>Sign in</h1>
        <p className='text-sm text-muted-foreground'>
          Access your Paw admin portal
        </p>
      </div>

      <div className='mt-6'>
        <UserAuthForm redirectTo={redirect} />
      </div>

      <p className='mt-6 text-center text-xs text-muted-foreground'>
        By continuing, you agree to our Terms of Use and Privacy Policy.
        <br />
        Access is restricted to authorised admin accounts only.
      </p>
    </AuthLayout>
  )
}
