import { useEffect } from 'react'
import { BRAND } from '@/lib/constants'

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${BRAND.name}` : `${BRAND.name} — ${BRAND.tagline}`
  }, [title])
}
