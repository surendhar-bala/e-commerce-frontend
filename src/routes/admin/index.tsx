import { createFileRoute } from '@tanstack/react-router'
import { AdminHomePage } from '@/features/admin/admin-home-page'

export const Route = createFileRoute('/admin/')({
  component: AdminHomePage,
})
