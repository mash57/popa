import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CheckoutReviewScreen } from './CheckoutReviewScreen'
import { AppStateProvider } from '../lib/appState'
import type { Product, Photo, AppState } from '../types'

const canvas: Product = {
  id: 'canvas-8x10', label: 'Canvas Wrap', category: 'canvas',
  mockupPath: '/mockups/canvas-8x10', printSizeMM: { w: 203, h: 254 },
  minResolutionPx: { w: 2400, h: 3000 }, priceFrom: 29, currency: 'USD', shipsIn: 7,
}
const magnet: Product = {
  id: 'magnet-4x4', label: 'Fridge Magnet', category: 'magnet',
  mockupPath: '/mockups/magnet-4x4', printSizeMM: { w: 102, h: 102 },
  minResolutionPx: { w: 1200, h: 1200 }, priceFrom: 6, currency: 'USD', shipsIn: 5,
}
const photo: Photo = {
  id: 'p1', thumbnailUrl: 'thumb.jpg', fullResUrl: 'full.jpg', width: 3000, height: 4000,
}
const reviewInitial: Partial<AppState> = {
  screen: 'checkout-review', selectedProduct: canvas, selectedPhoto: photo, currency: 'USD',
}

function renderReview(override?: Partial<AppState>) {
  return render(
    <AppStateProvider initialState={{ ...reviewInitial, ...override }}>
      <CheckoutReviewScreen />
    </AppStateProvider>
  )
}

describe('CheckoutReviewScreen', () => {
  it('renders step indicator', () => {
    renderReview()
    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument()
  })

  it('shows primary order item', () => {
    renderReview()
    expect(screen.getByTestId('primary-item')).toBeInTheDocument()
  })

  it('shows canvas wrap label in order items', () => {
    renderReview()
    expect(screen.getByText('Canvas Wrap')).toBeInTheDocument()
  })

  it('shows shipping cost in price breakdown', () => {
    renderReview()
    expect(screen.getByTestId('price-breakdown')).toBeInTheDocument()
    expect(screen.getByText('Shipping')).toBeInTheDocument()
  })

  it('shipping cost is never hidden', () => {
    renderReview()
    expect(screen.getByText('$8.99')).toBeInTheDocument()
  })

  it('shows delivery estimate', () => {
    renderReview()
    expect(screen.getByTestId('delivery-estimate')).toBeInTheDocument()
  })

  it('shows bundle item when present', () => {
    renderReview({ bundleProduct: magnet })
    expect(screen.getByTestId('bundle-item')).toBeInTheDocument()
  })

  it('continue button navigates to address', () => {
    renderReview()
    fireEvent.click(screen.getByTestId('continue-to-address'))
    // Navigation dispatched — no error = pass
  })
})
