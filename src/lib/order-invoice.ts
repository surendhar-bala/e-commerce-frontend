import jsPDF from 'jspdf'
import { BRAND } from '@/lib/constants'
import { formatDate } from '@/lib/format'
import type { Order } from '@/types/order'

function invoiceFileBase(order: Order) {
  return `velora-order-${order.id.slice(0, 8)}`
}

function addressLines(order: Order) {
  const address = order.shippingAddress
  return [
    address.fullName,
    address.line1,
    address.line2,
    `${address.city}, ${address.state} ${address.postalCode}`,
    address.country,
  ].filter(Boolean)
}

export async function downloadOrderInvoicePdf(order: Order) {
  const doc = new jsPDF()
  let y = 18

  doc.setFontSize(18)
  doc.text(`${BRAND.name} — Order details`, 14, y)
  y += 12

  doc.setFontSize(10)
  doc.text(`Order ID: ${order.id}`, 14, y)
  y += 6
  doc.text(`Date: ${formatDate(order.placedAt)}`, 14, y)
  y += 12

  doc.setFontSize(12)
  doc.text('Customer details', 14, y)
  y += 8

  doc.setFontSize(10)
  if (order.customerEmail) {
    doc.text(`Email: ${order.customerEmail}`, 14, y)
    y += 6
  }
  if (order.customerPhone) {
    doc.text(`Phone: ${order.customerPhone}`, 14, y)
    y += 6
  }
  for (const line of addressLines(order)) {
    doc.text(String(line), 14, y)
    y += 6
  }

  y += 8
  doc.setFontSize(12)
  doc.text('Products', 14, y)
  y += 8

  doc.setFontSize(10)
  for (const item of order.items) {
    doc.text(`• ${item.name}`, 14, y)
    y += 6
  }

  doc.save(`${invoiceFileBase(order)}.pdf`)
}

export function getSellerOrderTotal(order: Order) {
  return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}
