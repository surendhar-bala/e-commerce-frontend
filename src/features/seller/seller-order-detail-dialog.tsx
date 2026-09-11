import { Badge } from '@/components/ui/badge'

import { Button } from '@/components/ui/button'

import {

  Dialog,

  DialogContent,

  DialogDescription,

  DialogHeader,

  DialogTitle,

} from '@/components/ui/dialog'

import { Separator } from '@/components/ui/separator'

import { formatCurrency, formatDate } from '@/lib/format'

import { downloadOrderInvoicePdf, getSellerOrderTotal } from '@/lib/order-invoice'

import type { Order } from '@/types/order'

import { toast } from 'sonner'



type SellerOrderDetailDialogProps = {

  order: Order | null

  open: boolean

  onOpenChange: (open: boolean) => void

}



export function SellerOrderDetailDialog({ order, open, onOpenChange }: SellerOrderDetailDialogProps) {

  if (!order) {

    return null

  }



  const sellerTotal = getSellerOrderTotal(order)



  return (

    <Dialog open={open} onOpenChange={onOpenChange}>

      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">

        <DialogHeader>

          <DialogTitle>Order {order.id.slice(0, 8).toUpperCase()}</DialogTitle>

          <DialogDescription>{formatDate(order.placedAt)}</DialogDescription>

        </DialogHeader>



        <div className="flex flex-wrap items-center gap-2">

          <Badge variant="secondary">{order.status}</Badge>

          <span className="text-sm text-muted-foreground">Total: {formatCurrency(sellerTotal)}</span>

        </div>



        <div className="grid gap-6 sm:grid-cols-2">

          <div>

            <h3 className="text-sm font-medium">Customer</h3>

            <div className="mt-2 space-y-1 text-sm text-muted-foreground">

              <p>{order.shippingAddress.fullName}</p>

              {order.customerEmail ? <p>{order.customerEmail}</p> : null}

              {order.customerPhone ? <p>{order.customerPhone}</p> : null}

            </div>

          </div>

          <div>

            <h3 className="text-sm font-medium">Shipping address</h3>

            <div className="mt-2 space-y-1 text-sm text-muted-foreground">

              <p>{order.shippingAddress.line1}</p>

              {order.shippingAddress.line2 ? <p>{order.shippingAddress.line2}</p> : null}

              <p>

                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}

                {order.shippingAddress.postalCode}

              </p>

              <p>{order.shippingAddress.country}</p>

            </div>

          </div>

        </div>



        <div>

          <h3 className="text-sm font-medium">Products</h3>

          <ul className="mt-3 space-y-2">

            {order.items.map((item) => (

              <li key={`${order.id}-${item.productId}`} className="text-sm">

                {item.name} × {item.quantity}

              </li>

            ))}

          </ul>

        </div>



        <Separator />



        <Button

          type="button"

          variant="outline"

          onClick={async () => {

            try {

              await downloadOrderInvoicePdf(order)

              toast.success('Order PDF downloaded.')

            } catch {

              toast.error('Could not download PDF.')

            }

          }}

        >

          Download PDF

        </Button>

      </DialogContent>

    </Dialog>

  )

}

