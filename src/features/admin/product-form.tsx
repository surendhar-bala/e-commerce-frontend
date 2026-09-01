import { zodResolver } from '@hookform/resolvers/zod'
import { ImagePlus, X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { categories } from '@/data/categories'
import type { ProductDraft } from '@/services/product-service'
import { ProductStatus, type Product } from '@/types/product'

const schema = z
  .object({
    name: z.string().min(2, 'Enter a product name.'),
    price: z.coerce.number().positive('Enter a selling price.'),
    compareAtPrice: z.coerce.number().min(0).optional(),
    categoryId: z.string().min(1, 'Choose a category.'),
    description: z.string().min(10, 'Add a short description.'),
    stock: z.coerce.number().int().min(0, 'Stock cannot be negative.'),
    imageUrl: z.string().url('Enter an image URL.').or(z.literal('')),
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

async function filesToDataUrls(files: FileList | File[]) {
  const images = Array.from(files).filter((file) => file.type.startsWith('image/'))
  return Promise.all(
    images.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(String(reader.result))
          reader.onerror = () => reject(new Error('Unable to read image'))
          reader.readAsDataURL(file)
        }),
    ),
  )
}

export function ProductForm({ product, onSubmit, submittingLabel }: ProductFormProps) {
  const [imageUrls, setImageUrls] = useState<string[]>(product?.media.map((item) => item.url) ?? [])
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: product?.name ?? '',
      price: product?.price ?? 0,
      compareAtPrice: product?.compareAtPrice ?? 0,
      categoryId: product?.categoryId ?? categories[0]?.id ?? '',
      description: product?.description ?? '',
      stock: product?.stock ?? 0,
      imageUrl: '',
      status: product?.status ?? ProductStatus.Active,
    },
  })

  return (
    <Form {...form}>
      <form
        className="mt-8 space-y-8"
        onSubmit={form.handleSubmit(async (values) => {
          const uploaded = imageUrls.filter(Boolean)
          if (values.imageUrl) {
            uploaded.push(values.imageUrl)
          }
          await onSubmit({
            name: values.name,
            price: values.price,
            compareAtPrice: values.compareAtPrice || undefined,
            categoryId: values.categoryId,
            description: values.description,
            stock: values.stock,
            imageUrl: uploaded[0],
            imageUrls: uploaded,
            status: values.status,
          })
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
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a category" />
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
          </div>
        </section>

        <section className="rounded-2xl bg-card p-5 shadow-soft sm:p-6">
          <p className="text-caption">Photos</p>
          <h2 className="mt-1 font-display text-xl">Add product images</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Upload clear photos or paste image URLs. The first image becomes the catalog cover.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {imageUrls.map((url) => (
              <div key={url} className="relative overflow-hidden rounded-xl bg-secondary">
                <img src={url} alt="" className="aspect-square w-full object-cover" />
                <button
                  type="button"
                  className="absolute top-2 right-2 inline-flex size-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-soft"
                  onClick={() => setImageUrls((current) => current.filter((item) => item !== url))}
                  aria-label="Remove image"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-input bg-secondary/40 text-sm text-muted-foreground hover:bg-secondary">
              <ImagePlus className="size-5" />
              Upload
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={async (event) => {
                  const files = event.target.files
                  if (!files?.length) return
                  const urls = await filesToDataUrls(files)
                  setImageUrls((current) => [...current, ...urls].slice(0, 8))
                  event.target.value = ''
                }}
              />
            </label>
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
                    <Input type="number" min={0} {...field} />
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

        <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving…' : submittingLabel}
        </Button>
      </form>
    </Form>
  )
}
