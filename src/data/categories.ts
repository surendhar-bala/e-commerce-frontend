import type { ProductCategory } from '@/types/product'

export const categories: ProductCategory[] = [
  {
    id: 'cat-art',
    slug: 'painting-materials',
    name: 'Painting materials',
    description: 'Colours, brushes, and canvas for home and class.',
    image: {
      id: 'cat-art-img',
      url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f',
      alt: 'Open tubes of paint and brushes on a wooden table',
    },
  },
  {
    id: 'cat-toys',
    slug: 'kids-toys',
    name: "Kids' toys",
    description: 'Play, puzzles, and gifts for little ones.',
    image: {
      id: 'cat-toys-img',
      url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1',
      alt: 'Colourful wooden toys arranged on a table',
    },
  },
  {
    id: 'cat-everyday',
    slug: 'everyday',
    name: 'Everyday products',
    description: 'Kitchen, cleaning, and daily home essentials.',
    image: {
      id: 'cat-everyday-img',
      url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136',
      alt: 'Kitchen shelves with everyday jars and utensils',
    },
  },
]
