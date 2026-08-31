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
    password: z.string().min(8, 'Use at least 8 characters.'),
    confirmPassword: z.string().min(8, 'Confirm your password.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

type Values = z.infer<typeof schema>

type ResetPasswordPageProps = {
  token?: string
}

export function ResetPasswordPage({ token }: ResetPasswordPageProps) {
  useDocumentTitle('Reset password')
  const [serverError, setServerError] = useState<string | null>(null)
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirmPassword: '' },
  })

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
                token: token ?? '',
                password: values.password,
              })
            } catch (error) {
              setServerError(
                error instanceof ServiceError ? error.message : 'Unable to reset password.',
              )
            }
          })}
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
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
