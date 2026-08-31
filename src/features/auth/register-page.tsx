import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { authService } from '@/services'
import { ServiceError } from '@/services/http'

const schema = z
  .object({
    name: z.string().min(2, 'Please enter your name.'),
    email: z.string().email('Enter a valid email address.'),
    password: z.string().min(8, 'Use at least 8 characters.'),
    confirmPassword: z.string().min(8, 'Confirm your password.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

type Values = z.infer<typeof schema>

export function RegisterPage() {
  useDocumentTitle('Create account')
  const [serverError, setServerError] = useState<string | null>(null)
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  return (
    <div>
      <p className="text-caption">Join the studio</p>
      <h1 className="text-page mt-2">Create account</h1>
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
              await authService.register(values)
            } catch (error) {
              setServerError(
                error instanceof ServiceError ? error.message : 'Unable to create an account right now.',
              )
            }
          })}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="new-password" {...field} />
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
            {form.formState.isSubmitting ? 'Creating…' : 'Create account'}
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
