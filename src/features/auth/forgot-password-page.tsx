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

const schema = z.object({
  email: z.string().email('Enter a valid email address.'),
})

type Values = z.infer<typeof schema>

export function ForgotPasswordPage() {
  useDocumentTitle('Forgot password')
  const [serverError, setServerError] = useState<string | null>(null)
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  })

  return (
    <div>
      <p className="text-caption">Account recovery</p>
      <h1 className="text-page mt-2">Forgot password</h1>
      <p className="mt-2 text-small">Enter your email and we will send reset instructions when the API is connected.</p>
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
              await authService.forgotPassword(values)
            } catch (error) {
              setServerError(
                error instanceof ServiceError ? error.message : 'Unable to send reset instructions.',
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
          <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
            Send reset link
          </Button>
        </form>
      </Form>
      <p className="mt-6 text-sm">
        <Link to="/login" className="hover:text-primary">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
