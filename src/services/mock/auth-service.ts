import { ServiceError } from '@/services/http'
import type { AuthService } from '@/services/auth-service'
import { localStoreKeys, readLocalJson, writeLocalJson } from '@/lib/local-store'
import type { AuthSession, RegisterPayload } from '@/types/auth'
import { UserRole, type User } from '@/types/user'

type StoredAccount = User & { password: string }

const seedAccounts: StoredAccount[] = [
  {
    id: 'user-seller-demo',
    name: 'Asha Mehta',
    email: 'seller@velora.studio',
    phone: '9876543210',
    role: UserRole.Seller,
    password: 'sellwell1',
  },
]

function loadAccounts(): StoredAccount[] {
  const stored = readLocalJson<StoredAccount[]>(localStoreKeys.users, [])
  const emails = new Set(stored.map((account) => account.email.toLowerCase()))
  const missingSeeds = seedAccounts.filter((account) => !emails.has(account.email.toLowerCase()))
  return [...stored, ...missingSeeds]
}

function saveAccounts(accounts: StoredAccount[]) {
  writeLocalJson(localStoreKeys.users, accounts)
}

function toUser(account: StoredAccount): User {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    phone: account.phone,
    role: account.role,
  }
}

function toSession(account: StoredAccount): AuthSession {
  return {
    user: toUser(account),
    accessToken: `local-${account.id}`,
  }
}

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, '')
}

export const mockAuthService: AuthService = {
  async login(payload) {
    const accounts = loadAccounts()
    const account = accounts.find(
      (item) => item.email.toLowerCase() === payload.email.trim().toLowerCase(),
    )
    if (!account || account.password !== payload.password) {
      throw new ServiceError('Email or password is incorrect.', 401, 'INVALID_CREDENTIALS')
    }
    return toSession(account)
  },

  async register(payload: RegisterPayload) {
    const accounts = loadAccounts()
    const email = payload.email.trim().toLowerCase()
    const phone = normalizePhone(payload.phone)

    if (accounts.some((account) => account.email.toLowerCase() === email)) {
      throw new ServiceError('An account with this email already exists.', 409, 'EMAIL_TAKEN')
    }
    if (accounts.some((account) => account.phone && normalizePhone(account.phone) === phone)) {
      throw new ServiceError('An account with this phone number already exists.', 409, 'PHONE_TAKEN')
    }

    const account: StoredAccount = {
      id: `user-${crypto.randomUUID()}`,
      name: payload.name.trim(),
      email,
      phone,
      role: payload.role === UserRole.Seller ? UserRole.Seller : UserRole.Customer,
      password: payload.password,
    }
    saveAccounts([account, ...accounts])
    return toSession(account)
  },

  async logout() {
    return
  },

  async forgotPassword() {
    return
  },

  async resetPassword() {
    return
  },

  async getSession() {
    return null
  },
}
