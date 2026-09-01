import type { ProductMedia } from '@/types/product'

export function getMediaUrl(media: ProductMedia, width: number): string {
  if (media.publicId) {
    return media.url
  }

  if (media.url.includes('images.unsplash.com')) {
    const base = media.url.split('?')[0]
    return `${base}?auto=format&fit=crop&w=${width}&q=80`
  }

  return media.url
}
