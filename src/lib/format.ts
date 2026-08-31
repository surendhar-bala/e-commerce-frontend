const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

export function formatDiscount(price: number, compareAtPrice: number): number {
  if (compareAtPrice <= price) {
    return 0
  }
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}
