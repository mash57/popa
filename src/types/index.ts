export interface ProductConfig {
  photoZone: {
    x: number
    y: number
    width: number
    height: number
    perspectiveTransform: number[]
    borderRadius: number
  }
  overlayBlendMode: GlobalCompositeOperation
  baseSize: { w: number; h: number }
}

export interface Product {
  id: string
  label: string
  category: string
  mockupPath: string
  printSizeMM: { w: number; h: number }
  minResolutionPx: { w: number; h: number }
  badge?: string
  priceFrom: number
  currency: string
  shipsIn: number
}

export interface Photo {
  id: string
  thumbnailUrl: string
  fullResUrl: string
  width: number
  height: number
  takenAt?: string
}

export type ResolutionRating = 'green' | 'amber' | 'red'

export type AppScreen =
  | 'home'
  | 'gallery'
  | 'aha'
  | 'editor'
  | 'bundle'
  | 'checkout-review'
  | 'checkout-address'
  | 'checkout-payment'
  | 'confirmation'
  | 'me'

export interface EditorAdjustments {
  crop: number
  brightness: number
  contrast: number
  warmth: number
  text: string
}

export interface Address {
  name: string
  line1: string
  line2: string
  city: string
  postcode: string
  country: string
}

export interface OrderItem {
  product: Product
  photo: Photo
  quantity: number
  unitPrice: number
  currency: string
}

export type OrderStatus =
  | 'pending'
  | 'payment_confirmed'
  | 'art_processing'
  | 'pre_press'
  | 'sent_to_print'
  | 'shipped'
  | 'delivered'

export interface Order {
  id: string
  items: OrderItem[]
  bundleItem?: OrderItem
  address: Address
  subtotal: number
  shippingCost: number
  total: number
  currency: string
  estimatedDeliveryDate: string
  status: OrderStatus
  trackingUrl?: string
  stripePaymentIntentId?: string
  createdAt: string
}

export interface AppState {
  screen: AppScreen
  selectedProduct: Product | null
  selectedPhoto: Photo | null
  permissionGranted: boolean
  photos: Photo[]
  editorAdjustments: EditorAdjustments
  bundleProduct: Product | null
  address: Address | null
  order: Order | null
  currency: string
}
