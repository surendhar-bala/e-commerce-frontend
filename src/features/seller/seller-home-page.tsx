import { Link } from '@tanstack/react-router'
import { PackagePlus, Palette, Wallet } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/format'
import { productService } from '@/services'
import { useAuthStore } from '@/store/auth-store'
import { useDocumentTitle } from '@/hooks/use-document-title'
import type { Product } from '@/types/product'

export function SellerHomePage() {
  useDocumentTitle('Seller hub')
  const user = useAuthStore((state) => state.user)
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const sellerId = user?.id
    void productService
      .list({
        pageSize: 100,
        includeInactive: true,
        sellerId,
        sellerOnly: !sellerId,
        sort: 'newest',
      })
      .then((result) => setProducts(result.items))
  }, [user?.id])

  const liveCount = products.filter((product) => product.status === 'active').length
  const inventoryValue = products.reduce((sum, product) => sum + product.price * product.stock, 0)

  return (
    <div>
      <p className="text-caption">Seller hub</p>
      <h1 className="text-page mt-2">Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</h1>
      <p className="mt-3 max-w-xl text-small">
        List paints, toys, or daily essentials — photos, price, category, and stock in one listing. Clothing is not on the catalog yet.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-card p-6 shadow-soft">
          <Palette className="size-5 text-primary" />
          <p className="mt-4 text-caption">Live listings</p>
          <p className="mt-2 font-display text-4xl">{liveCount}</p>
        </div>
        <div className="rounded-2xl bg-card p-6 shadow-soft">
          <PackagePlus className="size-5 text-primary" />
          <p className="mt-4 text-caption">All products</p>
          <p className="mt-2 font-display text-4xl">{products.length}</p>
        </div>
        <div className="rounded-2xl bg-card p-6 shadow-soft">
          <Wallet className="size-5 text-primary" />
          <p className="mt-4 text-caption">Inventory value</p>
          <p className="mt-2 font-display text-3xl">{formatCurrency(inventoryValue)}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link to="/seller/products/create">Add a product</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/seller/products">Manage catalog</Link>
        </Button>
      </div>
    </div>
  )
}
