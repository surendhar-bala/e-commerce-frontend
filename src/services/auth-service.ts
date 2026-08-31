import type {
  AuthSession,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from '@/types/auth'

export type AuthService = {
  login: (payload: LoginPayload) => Promise<AuthSession>
  register: (payload: RegisterPayload) => Promise<AuthSession>
  logout: () => Promise<void>
  forgotPassword: (payload: ForgotPasswordPayload) => Promise<void>
  resetPassword: (payload: ResetPasswordPayload) => Promise<void>
  getSession: () => Promise<AuthSession | null>
}
