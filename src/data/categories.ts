import type { ProductCategory } from '@/types/product'

export const categories: ProductCategory[] = [
  {
    id: 'cat-apparel',
    slug: 'apparel',
    name: 'Apparel',
    description: 'Quiet luxury pieces for everyday ease.',
    image: {
      id: 'cat-apparel-img',
      url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b',
      alt: 'Model in tailored outerwear walking through a city street',
    },
  },
  {
    id: 'cat-home',
    slug: 'home',
    name: 'Home',
    description: 'Objects that soften a room and last a lifetime.',
    image: {
      id: 'cat-home-img',
      url: 'https://images.unsplash.com/photo-1616628188859-7a11abb6fcc9',
      alt: 'Sunlit living room with linen textiles and ceramic objects',
    },
  },
  {
    id: 'cat-accessories',
    slug: 'accessories',
    name: 'Accessories',
    description: 'Finishing details with lasting form.',
    image: {
      id: 'cat-accessories-img',
      url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
      alt: 'Structured leather handbag on a marble surface',
    },
  },
  {
    id: 'cat-fragrance',
    slug: 'fragrance',
    name: 'Fragrance',
    description: 'Scented compositions for ritual and memory.',
    image: {
      id: 'cat-fragrance-img',
      url: 'https://images.unsplash.com/photo-1541643600914-78b084683601',
      alt: 'Amber perfume bottle beside dried botanicals',
    },
  },
]
