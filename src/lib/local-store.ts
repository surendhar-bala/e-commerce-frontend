const USERS_KEY = 'velora-users'
const CATALOG_KEY = 'velora-catalog-extras'

export function readLocalJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback
  }
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function writeLocalJson<T>(key: string, value: T) {
  if (typeof window === 'undefined') {
    return
  }
  window.localStorage.setItem(key, JSON.stringify(value))
}

export const localStoreKeys = {
  users: USERS_KEY,
  catalogExtras: CATALOG_KEY,
} as const
