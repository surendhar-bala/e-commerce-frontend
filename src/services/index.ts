import { env } from '@/lib/env'
import { isApiEnabled } from '@/services/http'
import { apiAuthService } from '@/services/api/auth-service'
import { apiCartService } from '@/services/api/cart-service'
import { apiOrderService } from '@/services/api/order-service'
import { apiPaymentService } from '@/services/api/payment-service'
import { apiProductService } from '@/services/api/product-service'
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

const useApi = isApiEnabled()

export const authService: AuthService = useApi ? apiAuthService : mockAuthService
export const productService: ProductService = useApi ? apiProductService : mockProductService
export const cartService: CartService = useApi ? apiCartService : mockCartService
export const orderService: OrderService = useApi ? apiOrderService : mockOrderService
export const paymentService: PaymentService = useApi ? apiPaymentService : mockPaymentService

export const usingBackendApi = useApi

// Keep env referenced so tree-shaking does not strip endpoint config in devtools.
void env.apiUrl
