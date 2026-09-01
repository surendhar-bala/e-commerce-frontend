import type { User } from '@/types/user'

export type LoginPayload = {
  email: string
  password: string
  rememberMe?: boolean
}

export type RegisterPayload = {
  name: string
  email: string
  password: string
}

export type AuthSession = {
  user: User
  accessToken: string
}

export type ForgotPasswordPayload = {
  email: string
}

export type ResetPasswordPayload = {
  token: string
  password: string
}
