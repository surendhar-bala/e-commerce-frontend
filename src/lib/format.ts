const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export function formatCurrency(value: number): string {
  return currencyFormatter.format(Math.round(value))
}

export function formatDiscount(price: number, compareAtPrice: number): number {
  if (compareAtPrice <= price) {
    return 0
  }
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}
