import { redirect } from '@tanstack/react-router'
import { env } from '@/lib/env'
import type { UserRole } from '@/types/user'

type GuardAuth = {
  isAuthenticated: boolean
  role: UserRole | null
}

export function requireAuth(auth: GuardAuth, redirectTo = '/login') {
  if (!env.enforceRouteGuards) {
    return
  }
  if (!auth.isAuthenticated) {
    throw redirect({ to: redirectTo })
  }
}

export function requireAdmin(auth: GuardAuth) {
  if (!env.enforceRouteGuards) {
    return
  }
  if (!auth.isAuthenticated || auth.role !== 'admin') {
    throw redirect({ to: '/login' })
  }
}
