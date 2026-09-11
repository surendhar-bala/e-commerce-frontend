import type { ProductMedia } from '@/types/product'

export function isProductVideo(item: ProductMedia) {
  return item.type === 'video' || /\.(mp4|webm|ogg|mov)(\?|$)/i.test(item.url)
}

export function getProductMediaSlides(media: ProductMedia[]) {
  return media.filter((item) => Boolean(item?.url))
}
