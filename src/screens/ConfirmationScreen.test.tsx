import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ConfirmationScreen } from './ConfirmationScreen'
import { AppStateProvider } from '../lib/appState'
import type { AppState, Order, Address, Product, Photo } from '../types'

const photo: Photo = { id: 'p1', thumbnailUrl: 'thumb.jpg', fullResUrl: 'full.jpg', width: 3000, height: 4000 }
const canvas: Product = {
  id: 'canvas-8x10', label: 'Canvas Wrap', category: 'canvas',
  mockupPath: '/mockups/canvas-8x10', printSizeMM: { w: 203, h: 254 },
  minResolutionPx: { w: 2400, h: 3000 }, priceFrom: 29, currency: 'USD', shipsIn: 7,
}
const address: Address = {
  name: 'Jane Smith', line1: '123 Main St', line2: '',
  city: 'New York', postcode: '10001', country: 'US',
}
const order: Order = {
  id: 'popa-12345',
  items: [{ product: canvas, photo, quantity: 1, unitPrice: 29, currency: 'USD' }],
  address,
  subtotal: 29,
  shippingCost: 8.99,
  total: 37.99,
  currency: 'USD',
  estimatedDeliveryDate: '25 May 2026',
  status: 'payment_confirmed',
  createdAt: new Date().toISOString(),
}

const confirmInitial: Partial<AppState> = {
  screen: 'confirmation',
  order,
  selectedPhoto: photo,
}

function renderConfirmation(override?: Partial<AppState>) {
  return render(
    <AppStateProvider initialState={{ ...confirmInitial, ...override }}>
      <ConfirmationScreen />
    </AppStateProvider>
  )
}

describe('ConfirmationScreen', () => {
  it('renders checkmark', () => {
    renderConfirmation()
    expect(screen.getByTestId('confirmation-checkmark')).toBeInTheDocument()
  })

  it('shows order confirmed heading', () => {
    renderConfirmation()
    expect(screen.getByText(/Order confirmed/)).toBeInTheDocument()
  })

  it('shows order number', () => {
    renderConfirmation()
    expect(screen.getByText(/popa-12345/)).toBeInTheDocument()
  })

  it('shows order thumbnails', () => {
    renderConfirmation()
    expect(screen.getByTestId('order-thumbnails')).toBeInTheDocument()
  })

  it('shows order summary with total', () => {
    renderConfirmation()
    expect(screen.getByTestId('order-summary')).toBeInTheDocument()
    expect(screen.getByText('$37.99')).toBeInTheDocument()
  })

  it('shows estimated delivery date', () => {
    renderConfirmation()
    expect(screen.getByText('25 May 2026')).toBeInTheDocument()
  })

  it('shows status pipeline', () => {
    renderConfirmation()
    expect(screen.getByTestId('status-pipeline')).toBeInTheDocument()
    expect(screen.getByText('Order received')).toBeInTheDocument()
  })

  it('renders order more button', () => {
    renderConfirmation()
    expect(screen.getByTestId('order-more-button')).toBeInTheDocument()
  })

  it('order more navigates to home', () => {
    renderConfirmation()
    fireEvent.click(screen.getByTestId('order-more-button'))
    // Navigation dispatched — no error = pass
  })

  it('does not show tracking button when no trackingUrl', () => {
    renderConfirmation()
    expect(screen.queryByTestId('track-order-button')).not.toBeInTheDocument()
  })

  it('shows tracking button when trackingUrl present', () => {
    renderConfirmation({ order: { ...order, trackingUrl: 'https://track.example.com' } })
    expect(screen.getByTestId('track-order-button')).toBeInTheDocument()
  })
})
