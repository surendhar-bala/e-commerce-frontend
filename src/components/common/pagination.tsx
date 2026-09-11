import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type PaginationProps = {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  className?: string
}

function getPageNumbers(page: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const pages = new Set<number>([1, totalPages, page])

  if (page > 1) pages.add(page - 1)
  if (page < totalPages) pages.add(page + 1)

  return Array.from(pages).sort((a, b) => a - b)
}

export function Pagination({ page, pageSize, total, onPageChange, className }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize)

  if (totalPages <= 1) {
    return null
  }

  const pageNumbers = getPageNumbers(page, totalPages)

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex flex-wrap items-center justify-center gap-2', className)}
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="rounded-full"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="size-4" />
        Previous
      </Button>

      <div className="flex items-center gap-1">
        {pageNumbers.map((pageNumber, index) => {
          const previous = pageNumbers[index - 1]
          const showEllipsis = previous !== undefined && pageNumber - previous > 1

          return (
            <span key={pageNumber} className="flex items-center gap-1">
              {showEllipsis ? <span className="px-1 text-sm text-muted-foreground">…</span> : null}
              <Button
                type="button"
                variant={pageNumber === page ? 'default' : 'outline'}
                size="sm"
                className="min-w-9 rounded-full px-3"
                aria-current={pageNumber === page ? 'page' : undefined}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </Button>
            </span>
          )
        })}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="rounded-full"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  )
}
