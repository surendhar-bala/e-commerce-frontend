import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { ResetPasswordPage } from '@/features/auth/reset-password-page'

export const Route = createFileRoute('/reset-password')({
  validateSearch: z.object({
    email: z.string().email().optional(),
  }),
  component: ResetPasswordRoute,
})

function ResetPasswordRoute() {
  const { email } = Route.useSearch()
  return <ResetPasswordPage email={email} />
}
