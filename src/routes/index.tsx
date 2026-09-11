import { createFileRoute } from '@tanstack/react-router'
import { redirectByRole } from '@/lib/storefront-guards'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    redirectByRole()
  },
})
