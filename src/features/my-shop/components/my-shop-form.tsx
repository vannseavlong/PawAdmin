import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { handleServerError } from '@/lib/handle-server-error'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { type Shop } from '../data/schema'
import { updateMyShop } from '../data/shop-api'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  description: z.string().optional(),
  logo: z.string().optional(),
  contact_email: z.email('Enter a valid email.').optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  hours: z.string().optional(),
})
type ShopFormValues = z.infer<typeof formSchema>

const statusStyles: Record<Shop['status'], string> = {
  pending: 'bg-amber-100/40 text-amber-900 dark:text-amber-200 border-amber-300',
  active: 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200',
  suspended: 'bg-neutral-300/40 border-neutral-300',
}

function toFormValues(shop: Shop): ShopFormValues {
  return {
    name: shop.name,
    description: shop.description ?? '',
    logo: shop.logo ?? '',
    contact_email: shop.contact_email ?? '',
    contact_phone: shop.contact_phone ?? '',
    hours: shop.hours ?? '',
  }
}

export function MyShopForm({ shop }: { shop: Shop }) {
  const queryClient = useQueryClient()

  const form = useForm<ShopFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: toFormValues(shop),
  })

  // Re-sync the form whenever a fresh `shop` arrives (e.g. after refetch) —
  // this page has no separate "edit mode", the form is always live.
  useEffect(() => {
    form.reset(toFormValues(shop))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shop])

  const { mutate, isPending } = useMutation({
    mutationFn: (values: ShopFormValues) => updateMyShop(values),
    onSuccess: (data) => {
      toast.success('Shop details updated.')
      queryClient.setQueryData(['my-shop'], data)
    },
    onError: (error) => handleServerError(error),
  })

  const onSubmit = (values: ShopFormValues) => mutate(values)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardContent className='space-y-4'>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-muted-foreground'>Status:</span>
              <Badge
                variant='outline'
                className={statusStyles[shop.status] + ' capitalize'}
              >
                {shop.status}
              </Badge>
              <span className='text-xs text-muted-foreground'>
                (set by an admin — not editable here)
              </span>
            </div>

            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shop name</FormLabel>
                  <FormControl>
                    <Input placeholder='Whiskers & Wags Grooming' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Mobile pet grooming, serving the north side.'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='logo'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL</FormLabel>
                  <FormControl>
                    <Input placeholder='https://...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='contact_email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact email</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='sam@whiskersandwags.example'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='contact_phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact phone</FormLabel>
                    <FormControl>
                      <Input placeholder='+1 555 0100' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='hours'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hours</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Mon-Fri 9am-6pm'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type='submit' disabled={isPending}>
              Save changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
