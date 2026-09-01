import { createFileRoute } from '@tanstack/react-router'
import { RegisterPage } from '@/features/auth/register-page'
import { UserRole } from '@/types/user'

type RegisterSearch = {
  as?: 'seller'
}

export const Route = createFileRoute('/register')({
  validateSearch: (search: Record<string, unknown>): RegisterSearch => ({
    as: search.as === 'seller' ? 'seller' : undefined,
  }),
  component: RegisterRoute,
})

function RegisterRoute() {
  const { as } = Route.useSearch()
  return <RegisterPage defaultRole={as === 'seller' ? UserRole.Seller : UserRole.Customer} />
}
