export const UserRole = {
  Customer: 'customer',
  Admin: 'admin',
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
}
