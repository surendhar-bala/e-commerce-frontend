import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { authService } from '@/services'
import { ServiceError } from '@/services/http'
import { useAuthStore } from '@/store/auth-store'
import { UserRole } from '@/types/user'
import { toast } from 'sonner'
import { useState } from 'react'

const schema = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  rememberMe: z.boolean(),
})

type Values = z.infer<typeof schema>

export function LoginPage() {
  useDocumentTitle('Sign in')
  const navigate = useNavigate()
  const setSession = useAuthStore((state) => state.setSession)
  const [serverError, setServerError] = useState<string | null>(null)
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', rememberMe: true },
  })

  return (
    <div>
      <p className="text-caption">Welcome back</p>
      <h1 className="text-page mt-2">Sign in</h1>
      <p className="mt-2 text-small">Use the email and password from your account.</p>
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
              const session = await authService.login(values)
              setSession(session.user)
              toast.success(`Signed in as ${session.user.name}.`)
              await navigate({
                to: session.user.role === UserRole.Seller ? '/seller' : session.user.role === UserRole.Admin ? '/admin' : '/',
              })
            } catch (error) {
              setServerError(
                error instanceof ServiceError ? error.message : 'Unable to sign in right now.',
              )
            }
          })}
        >
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="current-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
                  </FormControl>
                  <FormLabel className="font-normal">Remember me</FormLabel>
                </FormItem>
              )}
            />
            <Link to="/forgot-password" className="text-sm hover:text-primary">
              Forgot password
            </Link>
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </Form>
      <p className="mt-6 text-sm text-muted-foreground">
        New to Velora?{' '}
        <Link to="/register" className="text-foreground underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  )
}
