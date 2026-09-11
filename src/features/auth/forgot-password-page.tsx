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

const emailSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
})

const passwordSchema = z.object({
  password: z.string().min(8, 'Use at least 8 characters.'),
})

type EmailValues = z.infer<typeof emailSchema>
type PasswordValues = z.infer<typeof passwordSchema>

export function ForgotPasswordPage() {
  useDocumentTitle('Forgot password')
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null)
  const emailForm = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  })
  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '' },
  })

  return (
    <div>
      <p className="text-caption">Account recovery</p>
      <h1 className="text-page mt-2">Forgot password</h1>
      <p className="mt-2 text-small">
        {verifiedEmail
          ? 'Enter a new password for your account.'
          : 'Enter your email address to reset your password.'}
      </p>
      {serverError ? (
        <Alert variant="info" className="mt-6">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      ) : null}

      {!verifiedEmail ? (
        <Form {...emailForm}>
          <form
            className="mt-8 space-y-5"
            onSubmit={emailForm.handleSubmit(async (values) => {
              setServerError(null)
              try {
                await authService.forgotPassword(values)
                setVerifiedEmail(values.email.trim())
                passwordForm.reset({ password: '' })
              } catch (error) {
                setServerError(
                  error instanceof ServiceError
                    ? error.message
                    : 'Unable to verify your email address.',
                )
              }
            })}
          >
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" autoComplete="email" placeholder="you@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" size="lg" disabled={emailForm.formState.isSubmitting}>
              {emailForm.formState.isSubmitting ? 'Checking…' : 'Continue'}
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...passwordForm}>
          <form
            className="mt-8 space-y-5"
            onSubmit={passwordForm.handleSubmit(async (values) => {
              setServerError(null)
              try {
                await authService.resetPassword({
                  email: verifiedEmail,
                  password: values.password,
                })
                toast.success('Your password has been updated.')
                await navigate({ to: '/login' })
              } catch (error) {
                setServerError(
                  error instanceof ServiceError ? error.message : 'Unable to reset your password.',
                )
              }
            })}
          >
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" value={verifiedEmail} disabled />
              </FormControl>
            </FormItem>
            <FormField
              control={passwordForm.control}
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
            <Button type="submit" className="w-full" size="lg" disabled={passwordForm.formState.isSubmitting}>
              {passwordForm.formState.isSubmitting ? 'Updating…' : 'Reset password'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                setVerifiedEmail(null)
                setServerError(null)
                passwordForm.reset({ password: '' })
              }}
            >
              Use a different email
            </Button>
          </form>
        </Form>
      )}

      <p className="mt-6 text-sm">
        <Link to="/login" className="hover:text-primary">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
