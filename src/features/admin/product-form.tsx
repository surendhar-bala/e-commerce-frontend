import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { categories } from '@/data/categories'
import type { ProductDraft } from '@/services/product-service'
import type { Product } from '@/types/product'

const schema = z.object({
  name: z.string().min(2, 'Enter a product name.'),
  price: z.coerce.number().positive('Enter a valid price.'),
  categoryId: z.string().min(1, 'Choose a category.'),
  description: z.string().min(10, 'Add a short description.'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative.'),
  imageUrl: z.string().url('Enter an image URL.').or(z.literal('')),
})

type Values = z.infer<typeof schema>

type ProductFormProps = {
  product?: Product
  onSubmit: (values: ProductDraft) => Promise<void>
  submittingLabel: string
}

export function ProductForm({ product, onSubmit, submittingLabel }: ProductFormProps) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: product?.name ?? '',
      price: product?.price ?? 0,
      categoryId: product?.categoryId ?? categories[0]?.id ?? '',
      description: product?.description ?? '',
      stock: product?.stock ?? 0,
      imageUrl: product?.media[0]?.url ?? '',
    },
  })

  return (
    <Form {...form}>
      <form
        className="mt-8 max-w-2xl space-y-5"
        onSubmit={form.handleSubmit(async (values) => {
          await onSubmit({
            name: values.name,
            price: values.price,
            categoryId: values.categoryId,
            description: values.description,
            stock: values.stock,
            imageUrl: values.imageUrl || undefined,
          })
        })}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
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
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
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
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="Cloudinary or remote image URL" {...field} />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-muted-foreground">
                Upload to Cloudinary will replace this field. For now, paste a media URL.
              </p>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving…' : submittingLabel}
        </Button>
      </form>
    </Form>
  )
}
