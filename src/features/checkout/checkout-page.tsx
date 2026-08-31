import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { EmptyState } from '@/components/common/empty-state'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import { paymentService } from '@/services'
import { ServiceError } from '@/services/http'
import { getCartSummary, useCartStore } from '@/store/cart-store'

const schema = z.object({
  email: z.string().email('Enter a valid email.'),
  fullName: z.string().min(2, 'Enter your full name.'),
  line1: z.string().min(3, 'Enter a street address.'),
  line2: z.string().optional(),
  city: z.string().min(2, 'Enter a city.'),
  state: z.string().min(2, 'Enter a state.'),
  postalCode: z.string().min(3, 'Enter a postal code.'),
  country: z.string().min(2, 'Enter a country.'),
  paymentMethod: z.enum(['card', 'apple-pay']),
})

type Values = z.infer<typeof schema>

const steps = ['Cart', 'Address', 'Payment', 'Confirmation'] as const

export function CheckoutPage() {
  useDocumentTitle('Checkout')
  const items = useCartStore((state) => state.items)
  const summary = getCartSummary(items)
  const [step, setStep] = useState<1 | 2>(1)
  const [serverError, setServerError] = useState<string | null>(null)
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      fullName: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States',
      paymentMethod: 'card',
    },
  })

  if (items.length === 0) {
    return (
      <EmptyState
        title="Nothing to check out"
        description="Add a piece to your cart before continuing."
        action={
          <Button asChild>
            <Link to="/products">Browse products</Link>
          </Button>
        }
      />
    )
  }

  return (
    <div className="container-page py-8 md:py-12">
      <ol className="mb-10 flex flex-wrap gap-3 text-xs tracking-[0.14em] uppercase">
        {steps.map((label, index) => (
          <li
            key={label}
            className={cn(
              'flex items-center gap-2',
              index === 0 || (step === 1 && index === 1) || (step === 2 && index <= 2)
                ? 'text-foreground'
                : 'text-muted-foreground',
            )}
          >
            <span className="flex size-6 items-center justify-center rounded-full border text-[10px]">
              {index + 1}
            </span>
            {label}
          </li>
        ))}
      </ol>
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="rounded-2xl bg-card p-5 shadow-soft sm:p-8">
          {serverError ? (
            <Alert variant="info" className="mb-6">
              <AlertTitle>Payments are not connected yet</AlertTitle>
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          ) : null}
          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit(async (values) => {
                if (step === 1) {
                  setStep(2)
                  return
                }
                setServerError(null)
                try {
                  await paymentService.createIntent(summary.total)
                  void values
                } catch (error) {
                  setServerError(
                    error instanceof ServiceError
                      ? error.message
                      : 'Payment could not be started.',
                  )
                }
              })}
            >
              {step === 1 ? (
                <>
                  <div>
                    <h2 className="font-display text-2xl">Customer information</h2>
                    <div className="mt-5 grid gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" autoComplete="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full name</FormLabel>
                            <FormControl>
                              <Input autoComplete="name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <h2 className="font-display text-2xl">Shipping address</h2>
                    <div className="mt-5 grid gap-4">
                      <FormField
                        control={form.control}
                        name="line1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input autoComplete="address-line1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="line2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Apartment, suite</FormLabel>
                            <FormControl>
                              <Input autoComplete="address-line2" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input autoComplete="address-level2" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl>
                                <Input autoComplete="address-level1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="postalCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Postal code</FormLabel>
                              <FormControl>
                                <Input autoComplete="postal-code" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input autoComplete="country-name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <h2 className="font-display text-2xl">Payment method</h2>
                  <p className="mt-2 text-small">
                    A payment provider will be connected through the NestJS backend. This step collects preference only.
                  </p>
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="mt-5">
                        <FormControl>
                          <RadioGroup value={field.value} onValueChange={field.onChange}>
                            <div className="flex items-center gap-3 rounded-xl border p-4">
                              <RadioGroupItem value="card" id="card" />
                              <Label htmlFor="card" className="font-normal">
                                Credit or debit card
                              </Label>
                            </div>
                            <div className="flex items-center gap-3 rounded-xl border p-4">
                              <RadioGroupItem value="apple-pay" id="apple-pay" />
                              <Label htmlFor="apple-pay" className="font-normal">
                                Apple Pay / wallet
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              <div className="flex flex-wrap gap-3">
                {step === 2 ? (
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Back to address
                  </Button>
                ) : null}
                <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
                  {step === 1 ? 'Continue to payment' : 'Place order'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <aside className="h-fit rounded-2xl bg-card p-6 shadow-soft">
          <h2 className="font-display text-xl">Order summary</h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between gap-3 text-sm">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span className="text-price">{formatCurrency(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <Separator className="my-4" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(summary.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{summary.shipping === 0 ? 'Complimentary' : formatCurrency(summary.shipping)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span className="text-price">{formatCurrency(summary.total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
