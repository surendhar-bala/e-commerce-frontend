import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { authService } from '@/services'
import { ServiceError } from '@/services/http'
import { toast } from 'sonner'

const schema = z.object({
  password: z.string().min(8, 'Use at least 8 characters.'),
})

type Values = z.infer<typeof schema>

type ResetPasswordPageProps = {
  email?: string
}

export function ResetPasswordPage({ email }: ResetPasswordPageProps) {
  useDocumentTitle('Reset password')
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { password: '' },
  })

  if (!email) {
    return (
      <div>
        <p className="text-caption">Account recovery</p>
        <h1 className="text-page mt-2">Reset password</h1>
        <Alert variant="info" className="mt-6">
          <AlertDescription>
            Start from the forgot password page to verify your email before resetting your password.
          </AlertDescription>
        </Alert>
        <p className="mt-6 text-sm">
          <Link to="/forgot-password" className="hover:text-primary">
            Go to forgot password
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-caption">Account recovery</p>
      <h1 className="text-page mt-2">Reset password</h1>
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
              await authService.resetPassword({
                email,
                password: values.password,
              })
              toast.success('Your password has been updated.')
              await navigate({ to: '/login' })
            } catch (error) {
              setServerError(
                error instanceof ServiceError ? error.message : 'Unable to reset password.',
              )
            }
          })}
        >
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" value={email} disabled />
            </FormControl>
          </FormItem>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <PasswordInput autoComplete="new-password" placeholder="At least 8 characters" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
            Reset password
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
