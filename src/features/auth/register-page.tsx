import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { Store, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { cn } from '@/lib/utils'
import { authService } from '@/services'
import { ServiceError } from '@/services/http'
import { useAuthStore } from '@/store/auth-store'
import { UserRole } from '@/types/user'
import { toast } from 'sonner'

const schema = z
  .object({
    name: z.string().min(2, 'Please enter your name.'),
    phone: z
      .string()
      .transform((value) => value.replace(/\D/g, ''))
      .pipe(z.string().regex(/^\d{10}$/, 'Enter a 10-digit phone number.')),
    email: z.string().email('Enter a valid email address.'),
    password: z.string().min(8, 'Use at least 8 characters.'),
    confirmPassword: z.string().min(8, 'Confirm your password.'),
    role: z.enum([UserRole.Customer, UserRole.Seller]),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

type Values = z.infer<typeof schema>

type RegisterPageProps = {
  defaultRole?: UserRole
}

export function RegisterPage({ defaultRole = UserRole.Customer }: RegisterPageProps) {
  useDocumentTitle('Create account')
  const navigate = useNavigate()
  const setSession = useAuthStore((state) => state.setSession)
  const [serverError, setServerError] = useState<string | null>(null)
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: defaultRole === UserRole.Seller ? UserRole.Seller : UserRole.Customer,
    },
  })

  const selectedRole = form.watch('role')

  return (
    <div>
      <p className="text-caption">Join Velora</p>
      <h1 className="text-page mt-2">Create account</h1>
      <p className="mt-2 text-small">Use your phone, email, and a password. You can shop — or start selling the same day.</p>
      {serverError ? (
        <Alert variant="info" className="mt-6">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      ) : null}
      <Form {...form}>
        <form
          className="mt-8 space-y-5"
          onSubmit={form.handleSubmit(async (values) => {
            setServerError(null)
            try {
              const session = await authService.register({
                name: values.name,
                phone: values.phone,
                email: values.email,
                password: values.password,
                role: values.role,
              })
              setSession(session.user)
              toast.success(values.role === UserRole.Seller ? 'Seller account ready.' : 'Welcome to Velora.')
              await navigate({ to: values.role === UserRole.Seller ? '/seller' : '/' })
            } catch (error) {
              setServerError(
                error instanceof ServiceError ? error.message : 'Unable to create an account right now.',
              )
            }
          })}
        >
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account type</FormLabel>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => field.onChange(UserRole.Customer)}
                    className={cn(
                      'rounded-xl border px-4 py-3 text-left transition-colors',
                      field.value === UserRole.Customer
                        ? 'border-primary bg-accent/30'
                        : 'border-input bg-card hover:bg-secondary/70',
                    )}
                  >
                    <ShoppingBag className="size-4" />
                    <p className="mt-2 text-sm font-medium">Shop</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Browse and order</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => field.onChange(UserRole.Seller)}
                    className={cn(
                      'rounded-xl border px-4 py-3 text-left transition-colors',
                      field.value === UserRole.Seller
                        ? 'border-primary bg-accent/30'
                        : 'border-input bg-card hover:bg-secondary/70',
                    )}
                  >
                    <Store className="size-4" />
                    <p className="mt-2 text-sm font-medium">Sell</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">List your products</p>
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input autoComplete="name" placeholder="Your name" {...field} />
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
                  <Input type="tel" inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile number" {...field} />
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
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input type="email" autoComplete="email" placeholder="you@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="new-password" placeholder="At least 8 characters" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? 'Creating…'
              : selectedRole === UserRole.Seller
                ? 'Create seller account'
                : 'Create account'}
          </Button>
        </form>
      </Form>
      <p className="mt-6 text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="text-foreground underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
