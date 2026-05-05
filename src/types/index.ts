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

export interface AppState {
  screen: AppScreen
  selectedProduct: Product | null
  selectedPhoto: Photo | null
  permissionGranted: boolean
  photos: Photo[]
  editorAdjustments: EditorAdjustments
}

export interface EditorAdjustments {
  crop: number
  brightness: number
  contrast: number
  warmth: number
  text: string
}
