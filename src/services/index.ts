import { mockAuthService } from '@/services/mock/auth-service'
import { mockCartService } from '@/services/mock/cart-service'
import { mockOrderService } from '@/services/mock/order-service'
import { mockPaymentService } from '@/services/mock/payment-service'
import { mockProductService } from '@/services/mock/product-service'
import type { AuthService } from '@/services/auth-service'
import type { CartService } from '@/services/cart-service'
import type { OrderService } from '@/services/order-service'
import type { PaymentService } from '@/services/payment-service'
import type { ProductService } from '@/services/product-service'

export const authService: AuthService = mockAuthService
export const productService: ProductService = mockProductService
export const cartService: CartService = mockCartService
export const orderService: OrderService = mockOrderService
export const paymentService: PaymentService = mockPaymentService
