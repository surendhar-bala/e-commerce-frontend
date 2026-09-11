import { zodResolver } from '@hookform/resolvers/zod'

import { Link } from '@tanstack/react-router'

import { Banknote, CreditCard, MapPin, ShieldCheck, Smartphone, User } from 'lucide-react'

import { useEffect, useLayoutEffect, useMemo, useState } from 'react'

import { useForm } from 'react-hook-form'

import { z } from 'zod'

import { toast } from 'sonner'

import { EmptyState } from '@/components/common/empty-state'
import { useCheckoutHeader } from '@/components/layout/checkout-layout'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import { Button } from '@/components/ui/button'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { Input } from '@/components/ui/input'

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { Separator } from '@/components/ui/separator'

import { useDocumentTitle } from '@/hooks/use-document-title'

import { env } from '@/lib/env'

import { formatCurrency } from '@/lib/format'

import { openRazorpayCheckout } from '@/lib/razorpay'

import { cn } from '@/lib/utils'

import { orderService, paymentService } from '@/services'

import { ServiceError } from '@/services/http'

import { getCartSummary, useCartStore } from '@/store/cart-store'

import { useAuthStore } from '@/store/auth-store'



const schema = z.object({

  email: z.string().email('Enter a valid email.'),

  phone: z

    .string()

    .transform((value) => value.replace(/\D/g, ''))

    .pipe(z.string().regex(/^\d{10}$/, 'Enter a 10-digit phone number.')),

  fullName: z.string().min(2, 'Enter your full name.'),

  line1: z.string().min(3, 'Enter your house or street address.'),

  line2: z.string().optional(),

  city: z.string().min(2, 'Enter a city.'),

  state: z.string().min(2, 'Enter a state.'),

  postalCode: z

    .string()

    .regex(/^\d{6}$/, 'Enter a 6-digit PIN code.'),

  country: z.string().min(2, 'Enter a country.'),

  paymentMethod: z.enum(['upi', 'card', 'cod']),

})



type Values = z.infer<typeof schema>



const steps = [

  { key: 'address', label: 'Address', icon: MapPin },

  { key: 'payment', label: 'Payment', icon: CreditCard },

] as const



const paymentOptions = [

  {

    value: 'upi' as const,

    label: 'UPI',

    description: 'Google Pay, PhonePe, Paytm & more',

    icon: Smartphone,

  },

  {

    value: 'card' as const,

    label: 'Credit or debit card',

    description: 'Visa, Mastercard, RuPay via Razorpay',

    icon: CreditCard,

  },

  {

    value: 'cod' as const,

    label: 'Cash on delivery',

    description: 'Pay when your order arrives',

    icon: Banknote,

  },

]



const emptyValues: Values = {

  email: '',

  phone: '',

  fullName: '',

  line1: '',

  line2: '',

  city: '',

  state: '',

  postalCode: '',

  country: 'India',

  paymentMethod: 'upi',

}



function valuesFromUser(user: { name: string; email: string; phone?: string } | null): Values {

  if (!user) return emptyValues

  return {

    ...emptyValues,

    email: user.email,

    phone: user.phone ?? '',

    fullName: user.name,

  }

}



export function CheckoutPage() {

  useDocumentTitle('Checkout')

  const items = useCartStore((state) => state.items).filter((item) => item.quantity > 0)

  const clearCart = useCartStore((state) => state.clear)

  const user = useAuthStore((state) => state.user)

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const summary = getCartSummary(items)

  const [step, setStep] = useState<0 | 1>(0)

  const [serverError, setServerError] = useState<string | null>(null)

  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null)

  const { setHideBackToCart } = useCheckoutHeader()

  const formKey = useMemo(() => user?.id ?? 'guest', [user?.id])



  const form = useForm<Values>({

    resolver: zodResolver(schema),

    defaultValues: valuesFromUser(user),

  })



  useEffect(() => {

    form.reset(valuesFromUser(user))

    setStep(0)

    setServerError(null)

  }, [formKey, user, form])



  useLayoutEffect(() => {

    setHideBackToCart(Boolean(placedOrderId))

    return () => setHideBackToCart(false)

  }, [placedOrderId, setHideBackToCart])



  if (placedOrderId) {

    return (

      <div className="container-page py-12 md:py-16">

        <div className="mx-auto max-w-lg surface-card p-8 text-center sm:p-10">

          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-success/15 text-success">

            <ShieldCheck className="size-7" />

          </div>

          <h1 className="text-page mt-6">Order placed!</h1>

          <p className="mt-3 text-small">

            Your order{' '}

            <span className="font-medium text-foreground">#{placedOrderId.slice(0, 8).toUpperCase()}</span>{' '}

            has been confirmed. We will send updates as it moves through delivery.

          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">

            {isAuthenticated ? (

              <Button asChild>

                <Link to="/orders">View orders</Link>

              </Button>

            ) : null}

            <Button asChild variant={isAuthenticated ? 'outline' : 'default'}>

              <Link to="/products">Continue shopping</Link>

            </Button>

          </div>

        </div>

      </div>

    )

  }



  if (items.length === 0) {

    return (

      <EmptyState

        title="Your cart is empty"

        description="Add items to your cart before checking out."

        action={

          <Button asChild>

            <Link to="/products">Browse products</Link>

          </Button>

        }

      />

    )

  }



  async function placeOrder(values: Values) {

    setServerError(null)



    const shippingAddress = {

      fullName: values.fullName,

      line1: values.line1,

      line2: values.line2,

      city: values.city,

      state: values.state,

      postalCode: values.postalCode,

      country: values.country,

    }



    const order = await orderService.create({

      items,

      shippingAddress,

      customerEmail: values.email,

      customerPhone: values.phone,

    })



    if (values.paymentMethod === 'cod') {

      clearCart()

      setPlacedOrderId(order.id)

      toast.success('Order placed. Pay on delivery.')

      return

    }



    const intent = await paymentService.createIntent(summary.total, 'INR', order.id)

    const keyId = intent.keyId ?? env.razorpayKeyId



    if (intent.provider !== 'razorpay' || !intent.razorpayOrderId || !keyId) {

      throw new ServiceError(

        'Online payments need Razorpay test keys. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to the backend .env, and VITE_RAZORPAY_KEY_ID to the frontend .env, then restart both servers.',

        503,

        'PAYMENT_NOT_CONFIGURED',

      )

    }



    const payment = await openRazorpayCheckout({

      keyId,

      razorpayOrderId: intent.razorpayOrderId,

      amount: summary.total,

      prefill: {

        name: values.fullName,

        email: values.email,

        contact: values.phone,

      },

    })



    await paymentService.verifyPayment({

      orderId: order.id,

      razorpayOrderId: payment.razorpay_order_id,

      razorpayPaymentId: payment.razorpay_payment_id,

      razorpaySignature: payment.razorpay_signature,

      amount: summary.total,

    })



    clearCart()

    setPlacedOrderId(order.id)

    toast.success('Payment successful. Your order is confirmed.')

  }



  return (

    <div className="container-page py-8 md:py-12">

      <div className="max-w-2xl">

        <p className="text-caption">Secure checkout</p>

        <h1 className="text-page mt-2">Complete your order</h1>

        <p className="mt-2 text-small">Enter delivery details and choose how you would like to pay.</p>

      </div>



      <div className="mt-8 grid max-w-5xl gap-3 sm:grid-cols-2">

        {steps.map((item, index) => {

          const Icon = item.icon

          const active = step === index

          const complete = step > index

          return (

            <div

              key={item.key}

              className={cn(

                'flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors',

                active ? 'border-primary bg-primary/5' : complete ? 'border-primary/30 bg-card' : 'border-border bg-muted/20',

              )}

            >

              <span

                className={cn(

                  'flex size-9 items-center justify-center rounded-full',

                  active || complete ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',

                )}

              >

                <Icon className="size-4" />

              </span>

              <div>

                <p className="text-xs tracking-wide uppercase text-muted-foreground">Step {index + 1}</p>

                <p className="font-medium">{item.label}</p>

              </div>

            </div>

          )

        })}

      </div>



      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">

        <div className="surface-card p-5 sm:p-8">

          {serverError ? (

            <Alert variant="info" className="mb-6">

              <AlertTitle>Payment could not be completed</AlertTitle>

              <AlertDescription>{serverError}</AlertDescription>

            </Alert>

          ) : null}

          <Form {...form} key={formKey}>

            <form

              className="space-y-8"

              autoComplete={isAuthenticated ? 'on' : 'off'}

              onSubmit={form.handleSubmit(async (values) => {

                if (step === 0) {

                  setStep(1)

                  return

                }



                try {

                  await placeOrder(values)

                } catch (error) {

                  setServerError(

                    error instanceof ServiceError

                      ? error.message

                      : error instanceof Error

                        ? error.message

                        : 'Payment could not be started.',

                  )

                }

              })}

            >

              {step === 0 ? (

                <>

                  <section>

                    <div className="flex items-center gap-2">

                      <User className="size-5 text-primary" />

                      <h2 className="font-display text-xl">Contact details</h2>

                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">

                      <FormField

                        control={form.control}

                        name="fullName"

                        render={({ field }) => (

                          <FormItem className="sm:col-span-2">

                            <FormLabel>Full name</FormLabel>

                            <FormControl>

                              <Input autoComplete="name" {...field} />

                            </FormControl>

                            <FormMessage />

                          </FormItem>

                        )}

                      />

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

                        name="phone"

                        render={({ field }) => (

                          <FormItem>

                            <FormLabel>Phone number</FormLabel>

                            <FormControl>

                              <Input

                                type="tel"

                                inputMode="numeric"

                                autoComplete="tel"

                                placeholder="10-digit mobile number"

                                {...field}

                              />

                            </FormControl>

                            <FormMessage />

                          </FormItem>

                        )}

                      />

                    </div>

                  </section>



                  <section>

                    <div className="flex items-center gap-2">

                      <MapPin className="size-5 text-primary" />

                      <h2 className="font-display text-xl">Delivery address</h2>

                    </div>

                    <div className="mt-5 grid gap-4">

                      <FormField

                        control={form.control}

                        name="line1"

                        render={({ field }) => (

                          <FormItem>

                            <FormLabel>House / street</FormLabel>

                            <FormControl>

                              <Input autoComplete="address-line1" placeholder="14, 2nd Main, Indiranagar" {...field} />

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

                            <FormLabel>Landmark (optional)</FormLabel>

                            <FormControl>

                              <Input autoComplete="address-line2" placeholder="Near metro station" {...field} />

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

                                <Input autoComplete="address-level1" placeholder="Maharashtra" {...field} />

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

                              <FormLabel>PIN code</FormLabel>

                              <FormControl>

                                <Input inputMode="numeric" autoComplete="postal-code" placeholder="560038" {...field} />

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

                  </section>

                </>

              ) : (

                <section>

                  <div className="flex items-center gap-2">

                    <CreditCard className="size-5 text-primary" />

                    <h2 className="font-display text-xl">Payment method</h2>

                  </div>

                  <p className="mt-2 text-small">

                    UPI and cards open Razorpay checkout. Cash on delivery skips online payment.

                  </p>

                  <FormField

                    control={form.control}

                    name="paymentMethod"

                    render={({ field }) => (

                      <FormItem className="mt-5">

                        <FormControl>

                          <RadioGroup value={field.value} onValueChange={field.onChange} className="grid gap-3">

                            {paymentOptions.map((option) => {

                              const Icon = option.icon

                              return (

                                <label

                                  key={option.value}

                                  htmlFor={option.value}

                                  className={cn(

                                    'flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-colors',

                                    field.value === option.value

                                      ? 'border-primary bg-primary/5 ring-1 ring-primary/20'

                                      : 'border-border hover:bg-muted/30',

                                  )}

                                >

                                  <RadioGroupItem value={option.value} id={option.value} className="mt-1" />

                                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary">

                                    <Icon className="size-5 text-primary" />

                                  </span>

                                  <span>

                                    <span className="block font-medium">{option.label}</span>

                                    <span className="mt-0.5 block text-sm text-muted-foreground">{option.description}</span>

                                  </span>

                                </label>

                              )

                            })}

                          </RadioGroup>

                        </FormControl>

                        <FormMessage />

                      </FormItem>

                    )}

                  />

                </section>

              )}

              <div className="flex flex-wrap gap-3 border-t border-border/60 pt-6">

                {step === 1 ? (

                  <Button type="button" variant="outline" onClick={() => setStep(0)}>

                    Back to address

                  </Button>

                ) : null}

                <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>

                  {form.formState.isSubmitting

                    ? 'Processing…'

                    : step === 0

                      ? 'Continue to payment'

                      : 'Place order'}

                </Button>

              </div>

            </form>

          </Form>

        </div>



        <aside className="h-fit surface-card p-6 lg:sticky lg:top-24">

          <h2 className="font-display text-xl">Order summary</h2>

          <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">

            {items.map((item) => (

              <li key={item.productId} className="flex justify-between gap-3 text-sm">

                <span className="line-clamp-2">

                  {item.name} × {item.quantity}

                </span>

                <span className="shrink-0 text-price">{formatCurrency(item.price * item.quantity)}</span>

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

              <span className="text-muted-foreground">GST (18%)</span>

              <span>{formatCurrency(summary.tax)}</span>

            </div>

            <div className="flex justify-between border-t border-border/60 pt-3 text-base font-medium">

              <span>Total</span>

              <span className="text-price">{formatCurrency(summary.total)}</span>

            </div>

          </div>


        </aside>

      </div>

    </div>

  )

}


