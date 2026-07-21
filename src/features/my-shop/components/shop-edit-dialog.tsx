import { useRef, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ImagePlus, Store, X } from 'lucide-react'
import { toast } from 'sonner'
import { toDisplayImageUrl } from '@/lib/drive-image'
import { handleServerError } from '@/lib/handle-server-error'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { updateMyShop, type ShopUpdatePayload } from '../data/shop-api'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  description: z.string().optional(),
  contact_email: z.email('Enter a valid email.').optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  hours: z.string().optional(),
})
type ShopFormValues = z.infer<typeof formSchema>

// undefined = unchanged, null = cleared, File = a newly picked file to upload.
type ImageEdit = File | null | undefined

function toFormValues(shop: Shop): ShopFormValues {
  return {
    name: shop.name,
    description: shop.description ?? '',
    contact_email: shop.contact_email ?? '',
    contact_phone: shop.contact_phone ?? '',
    hours: shop.hours ?? '',
  }
}

type ImagePickerProps = {
  label: string
  shape: 'circle' | 'rect'
  currentUrl?: string
  onChange: (value: ImageEdit) => void
}

function ImagePicker({ label, shape, currentUrl, onChange }: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    toDisplayImageUrl(currentUrl)
  )

  return (
    <div className='flex items-center gap-3'>
      <div
        className={cn(
          'flex shrink-0 items-center justify-center overflow-hidden border bg-muted',
          shape === 'circle' ? 'size-16 rounded-full' : 'h-16 w-28 rounded-md'
        )}
      >
        {previewUrl ? (
          <img src={previewUrl} alt='' className='h-full w-full object-cover' />
        ) : (
          <Store className='size-6 text-muted-foreground' />
        )}
      </div>
      <div className='flex flex-col items-start gap-1'>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus />
          {label}
        </Button>
        {previewUrl && (
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='text-muted-foreground'
            onClick={() => {
              setPreviewUrl(undefined)
              onChange(null)
            }}
          >
            <X /> Remove
          </Button>
        )}
        <input
          ref={inputRef}
          type='file'
          accept='image/jpeg,image/png,image/webp'
          className='hidden'
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              setPreviewUrl(URL.createObjectURL(file))
              onChange(file)
            }
            e.target.value = ''
          }}
        />
      </div>
    </div>
  )
}

type ShopEditDialogProps = {
  shop: Shop
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShopEditDialog({
  shop,
  open,
  onOpenChange,
}: ShopEditDialogProps) {
  const queryClient = useQueryClient()
  const [logoEdit, setLogoEdit] = useState<ImageEdit>(undefined)
  const [bannerEdit, setBannerEdit] = useState<ImageEdit>(undefined)

  const form = useForm<ShopFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: toFormValues(shop),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (values: ShopFormValues) => {
      const payload: ShopUpdatePayload = { ...values }
      if (logoEdit !== undefined) payload.logo = logoEdit ?? ''
      if (bannerEdit !== undefined) payload.banner = bannerEdit ?? ''
      return updateMyShop(payload)
    },
    onSuccess: (data) => {
      toast.success('Shop details updated.')
      queryClient.setQueryData(['my-shop'], data)
      onOpenChange(false)
    },
    onError: (error) => handleServerError(error),
  })

  const onSubmit = (values: ShopFormValues) => mutate(values)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>Edit Shop Profile</DialogTitle>
          <DialogDescription>
            Update the storefront details customers see in the mobile app. Click
            save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='shop-edit-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <div className='space-y-2'>
                <FormLabel>Logo</FormLabel>
                <ImagePicker
                  label='Upload logo'
                  shape='circle'
                  currentUrl={shop.logo}
                  onChange={setLogoEdit}
                />
              </div>

              <div className='space-y-2'>
                <FormLabel>Banner</FormLabel>
                <ImagePicker
                  label='Upload banner'
                  shape='rect'
                  currentUrl={shop.banner}
                  onChange={setBannerEdit}
                />
              </div>

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shop name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Whiskers & Wags Grooming'
                        {...field}
                      />
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
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='shop-edit-form' disabled={isPending}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
