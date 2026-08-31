import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { productService } from '@/services'
import { useDocumentTitle } from '@/hooks/use-document-title'

export function AdminHomePage() {
  useDocumentTitle('Admin')
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    void productService.list({ pageSize: 100 }).then((result) => setCount(result.total))
  }, [])

  return (
    <div>
      <p className="text-caption">Studio</p>
      <h1 className="text-page mt-2">Catalog overview</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-card p-6 shadow-soft">
          <p className="text-caption">Products</p>
          <p className="mt-2 font-display text-4xl">{count ?? '—'}</p>
        </div>
        <div className="rounded-2xl bg-card p-6 shadow-soft">
          <p className="text-caption">Media</p>
          <p className="mt-2 font-display text-2xl">Cloudinary ready</p>
        </div>
        <div className="rounded-2xl bg-card p-6 shadow-soft">
          <p className="text-caption">Auth</p>
          <p className="mt-2 text-sm text-muted-foreground">Backend will enforce admin access.</p>
        </div>
      </div>
      <Button asChild className="mt-8">
        <Link to="/admin/products">Manage products</Link>
      </Button>
    </div>
  )
}
