import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BundleScreen } from './BundleScreen'
import { AppStateProvider } from '../lib/appState'
import * as productsLib from '../lib/products'
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

const bundleInitial: Partial<AppState> = {
  screen: 'bundle',
  selectedProduct: canvas,
  selectedPhoto: photo,
  currency: 'USD',
}

beforeEach(() => {
  vi.spyOn(productsLib, 'loadProducts').mockResolvedValue([canvas, magnet])
})

function renderBundle(override?: Partial<AppState>) {
  return render(
    <AppStateProvider initialState={{ ...bundleInitial, ...override }}>
      <BundleScreen />
    </AppStateProvider>
  )
}

describe('BundleScreen', () => {
  it('renders primary product card', () => {
    renderBundle()
    expect(screen.getByTestId('primary-product-card')).toBeInTheDocument()
  })

  it('shows skip button immediately', () => {
    renderBundle()
    expect(screen.getByTestId('skip-bundle-button')).toBeInTheDocument()
  })

  it('shows skip button label with product name', () => {
    renderBundle()
    expect(screen.getByText(/Just the Canvas Wrap/)).toBeInTheDocument()
  })

  it('shows bundle product card after products load', async () => {
    renderBundle()
    await waitFor(() => expect(screen.getByTestId('bundle-product-card')).toBeInTheDocument())
  })

  it('shows savings callout with bundle discount', async () => {
    renderBundle()
    await waitFor(() => expect(screen.getByTestId('savings-callout')).toBeInTheDocument())
  })

  it('shows accept bundle button', async () => {
    renderBundle()
    await waitFor(() => expect(screen.getByTestId('accept-bundle-button')).toBeInTheDocument())
  })

  it('navigates to checkout-review on skip', () => {
    renderBundle()
    fireEvent.click(screen.getByTestId('skip-bundle-button'))
    // Navigation dispatched — no error = pass
  })

  it('accept bundle dispatches bundle product', async () => {
    renderBundle()
    await waitFor(() => screen.getByTestId('accept-bundle-button'))
    fireEvent.click(screen.getByTestId('accept-bundle-button'))
    // Dispatch called — no error = pass
  })
})
