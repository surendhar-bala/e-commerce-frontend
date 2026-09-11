import { zodResolver } from '@hookform/resolvers/zod'
import { ImagePlus, Video, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { categories } from '@/data/categories'
import { storeMediaFiles, storedMediaFromUrl, type StoredMedia } from '@/lib/upload-media'
import type { ProductDraft } from '@/services/product-service'
import { ServiceError } from '@/services/http'
import { ProductStatus, type Product } from '@/types/product'

const MAX_PHOTOS = 5

const schema = z
  .object({
    name: z.string().min(2, 'Enter a product name.'),
    price: z.coerce.number().positive('Enter a selling price.'),
    compareAtPrice: z.coerce.number().min(0).optional(),
    description: z.string().min(10, 'Add a short description.'),
    categoryId: z.string().min(1, 'Select a category.'),
    stock: z.coerce.number().int().min(1, 'Stock must be at least 1.'),
    imageUrl: z.string().url('Enter an image URL.').or(z.literal('')),
    videoUrl: z.string().url('Enter a video URL.').or(z.literal('')),
    status: z.enum(['active', 'draft', 'archived']),
  })
  .refine((values) => !values.compareAtPrice || values.compareAtPrice >= values.price, {
    message: 'MRP should be equal to or higher than the selling price.',
    path: ['compareAtPrice'],
  })

type Values = z.infer<typeof schema>

type ProductFormProps = {
  product?: Product
  onSubmit: (values: ProductDraft) => Promise<void>
  submittingLabel: string
}

type PendingImage = {
  id: string
  file: File
  previewUrl: string
}

type PendingVideo = {
  file: File
  previewUrl: string
}

function isVideoMedia(url: string) {
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url)
}

function mediaKey(item: StoredMedia) {
  return item.r2Key ?? item.url
}

export function ProductForm({ product, onSubmit, submittingLabel }: ProductFormProps) {
  const existingImages: StoredMedia[] =
    product?.media
      .filter((item) => item.type !== 'video' && !isVideoMedia(item.url))
      .map((item) => ({ url: item.url, r2Key: item.publicId, type: 'image' as const })) ?? []

  const existingVideo = product?.media.find((item) => item.type === 'video' || isVideoMedia(item.url))

  const [storedImages, setStoredImages] = useState<StoredMedia[]>(existingImages)
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([])
  const [storedVideo, setStoredVideo] = useState<StoredMedia | null>(
    existingVideo ? { url: existingVideo.url, r2Key: existingVideo.publicId, type: 'video' } : null,
  )
  const [pendingVideo, setPendingVideo] = useState<PendingVideo | null>(null)
  const [uploading, setUploading] = useState(false)

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: product?.name ?? '',
      price: product?.price ?? 0,
      compareAtPrice: product?.compareAtPrice ?? 0,
      description: product?.description ?? '',
      categoryId: product?.categoryId ?? categories[0]?.id ?? '',
      stock: product?.stock && product.stock > 0 ? product.stock : 1,
      imageUrl: '',
      videoUrl: '',
      status: product?.status ?? ProductStatus.Active,
    },
  })

  useEffect(() => {
    return () => {
      pendingImages.forEach((item) => URL.revokeObjectURL(item.previewUrl))
      if (pendingVideo) URL.revokeObjectURL(pendingVideo.previewUrl)
    }
  }, [pendingImages, pendingVideo])

  function handleImageSelect(files: FileList | null) {
    if (!files?.length) return

    const remaining = MAX_PHOTOS - storedImages.length - pendingImages.length
    if (remaining <= 0) {
      toast.error(`You can add up to ${MAX_PHOTOS} photos.`)
      return
    }

    const selected = Array.from(files)
      .filter((file) => file.type.startsWith('image/'))
      .slice(0, remaining)

    if (selected.length === 0) return

    setPendingImages((current) => [
      ...current,
      ...selected.map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ])
  }

  function removeStoredImage(item: StoredMedia) {
    setStoredImages((current) => current.filter((entry) => mediaKey(entry) !== mediaKey(item)))
  }

  function removePendingImage(id: string) {
    setPendingImages((current) => {
      const target = current.find((item) => item.id === id)
      if (target) URL.revokeObjectURL(target.previewUrl)
      return current.filter((item) => item.id !== id)
    })
  }

  function handleVideoSelect(files: FileList | null) {
    const file = files?.[0]
    if (!file || !file.type.startsWith('video/')) return

    if (pendingVideo) URL.revokeObjectURL(pendingVideo.previewUrl)
    setStoredVideo(null)
    setPendingVideo({ file, previewUrl: URL.createObjectURL(file) })
  }

  function removeVideo() {
    if (pendingVideo) URL.revokeObjectURL(pendingVideo.previewUrl)
    setPendingVideo(null)
    setStoredVideo(null)
  }

  const totalImages = storedImages.length + pendingImages.length
  const videoPreviewUrl = pendingVideo?.previewUrl ?? storedVideo?.url ?? null

  return (
    <Form {...form}>
      <form
        className="mt-8 space-y-8"
        onSubmit={form.handleSubmit(async (values) => {
          setUploading(true)
          try {
            const uploadedImages =
              pendingImages.length > 0
                ? await storeMediaFiles(
                    pendingImages.map((item) => item.file),
                    'image',
                  )
                : []

            const uploadedVideo = pendingVideo
              ? (await storeMediaFiles([pendingVideo.file], 'video'))[0]
              : undefined

            const allImages = [...storedImages, ...uploadedImages]
            if (values.imageUrl) {
              allImages.push(storedMediaFromUrl(values.imageUrl, 'image'))
            }

            const finalVideo =
              values.videoUrl
                ? storedMediaFromUrl(values.videoUrl, 'video')
                : uploadedVideo ?? storedVideo ?? undefined

            const mediaItems: ProductDraft['mediaItems'] = [
              ...allImages.slice(0, MAX_PHOTOS).map((item) => ({
                url: item.url,
                r2Key: item.r2Key,
                type: 'image' as const,
              })),
              ...(finalVideo
                ? [{ url: finalVideo.url, r2Key: finalVideo.r2Key, type: 'video' as const }]
                : []),
            ]

            await onSubmit({
              name: values.name,
              price: values.price,
              compareAtPrice: values.compareAtPrice || undefined,
              categoryId: values.categoryId,
              description: values.description,
              stock: values.stock,
              imageUrl: mediaItems.find((item) => item.type === 'image')?.url,
              imageUrls: mediaItems.filter((item) => item.type === 'image').map((item) => item.url),
              videoUrl: mediaItems.find((item) => item.type === 'video')?.url,
              mediaItems,
              status: values.status,
            })

            pendingImages.forEach((item) => URL.revokeObjectURL(item.previewUrl))
            if (pendingVideo) URL.revokeObjectURL(pendingVideo.previewUrl)
            setPendingImages([])
            setPendingVideo(null)
          } catch (error) {
            toast.error(error instanceof ServiceError ? error.message : 'Could not save the product.')
          } finally {
            setUploading(false)
          }
        })}
      >
        <section className="rounded-2xl bg-card p-5 shadow-soft sm:p-6">
          <p className="text-caption">Listing details</p>
          <h2 className="mt-1 font-display text-xl">What are you selling?</h2>
          <div className="mt-6 space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Acrylic paint set" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What is in the pack, who it is for, and how to use it." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <section className="rounded-2xl bg-card p-5 shadow-soft sm:p-6">
          <p className="text-caption">Photos</p>
          <h2 className="mt-1 font-display text-xl">Product images</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose up to {MAX_PHOTOS} photos. Files upload when you submit — the first image becomes the catalog cover.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {storedImages.map((item) => (
              <div key={mediaKey(item)} className="relative overflow-hidden rounded-xl bg-secondary">
                <img src={item.url} alt="" className="aspect-square w-full object-cover" />
                <button
                  type="button"
                  className="absolute top-2 right-2 inline-flex size-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-soft"
                  onClick={() => removeStoredImage(item)}
                  aria-label="Remove image"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
            {pendingImages.map((item) => (
              <div key={item.id} className="relative overflow-hidden rounded-xl bg-secondary">
                <img src={item.previewUrl} alt="" className="aspect-square w-full object-cover" />
                <span className="absolute bottom-2 left-2 rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Pending
                </span>
                <button
                  type="button"
                  className="absolute top-2 right-2 inline-flex size-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-soft"
                  onClick={() => removePendingImage(item.id)}
                  aria-label="Remove image"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
            {totalImages < MAX_PHOTOS ? (
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-input bg-secondary/40 text-sm text-muted-foreground hover:bg-secondary">
                <ImagePlus className="size-5" />
                Add photos
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  className="sr-only"
                  disabled={uploading || form.formState.isSubmitting}
                  onChange={(event) => {
                    handleImageSelect(event.target.files)
                    event.target.value = ''
                  }}
                />
              </label>
            ) : null}
          </div>
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="mt-5">
                <FormLabel>Or paste an image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <section className="rounded-2xl bg-card p-5 shadow-soft sm:p-6">
          <p className="text-caption">Video</p>
          <h2 className="mt-1 font-display text-xl">Product video</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Add one optional video. It uploads when you submit the listing.
          </p>
          {videoPreviewUrl ? (
            <div className="relative mt-5 overflow-hidden rounded-xl bg-black">
              <video src={videoPreviewUrl} controls className="aspect-video w-full" preload="metadata" />
              {pendingVideo ? (
                <span className="absolute top-3 left-3 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Pending upload
                </span>
              ) : null}
              <button
                type="button"
                className="absolute top-2 right-2 inline-flex size-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-soft"
                onClick={removeVideo}
                aria-label="Remove video"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <label className="mt-5 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-input bg-secondary/40 px-6 py-10 text-sm text-muted-foreground hover:bg-secondary">
              <Video className="size-6" />
              Add video (max 1)
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                className="sr-only"
                disabled={uploading || form.formState.isSubmitting}
                onChange={(event) => {
                  handleVideoSelect(event.target.files)
                  event.target.value = ''
                }}
              />
            </label>
          )}
          <FormField
            control={form.control}
            name="videoUrl"
            render={({ field }) => (
              <FormItem className="mt-5">
                <FormLabel>Or paste a video URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <section className="rounded-2xl bg-card p-5 shadow-soft sm:p-6">
          <p className="text-caption">Price and stock</p>
          <h2 className="mt-1 font-display text-xl">How should customers buy it?</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Selling price (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="compareAtPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>MRP (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="mt-5 max-w-xs">
                <FormLabel>Listing status</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Live in shop</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <Button type="submit" size="lg" disabled={form.formState.isSubmitting || uploading}>
          {uploading ? 'Uploading media…' : form.formState.isSubmitting ? 'Saving…' : submittingLabel}
        </Button>
      </form>
    </Form>
  )
}
