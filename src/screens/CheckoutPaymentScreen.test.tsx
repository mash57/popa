import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CheckoutPaymentScreen } from './CheckoutPaymentScreen'
import { AppStateProvider } from '../lib/appState'
import type { Product, Photo, Address, AppState } from '../types'

const canvas: Product = {
  id: 'canvas-8x10', label: 'Canvas Wrap', category: 'canvas',
  mockupPath: '/mockups/canvas-8x10', printSizeMM: { w: 203, h: 254 },
  minResolutionPx: { w: 2400, h: 3000 }, priceFrom: 29, currency: 'USD', shipsIn: 7,
}
const photo: Photo = {
  id: 'p1', thumbnailUrl: 'thumb.jpg', fullResUrl: 'full.jpg', width: 3000, height: 4000,
}
const address: Address = {
  name: 'Jane Smith', line1: '123 Main St', line2: '',
  city: 'New York', postcode: '10001', country: 'US',
}
const paymentInitial: Partial<AppState> = {
  screen: 'checkout-payment',
  selectedProduct: canvas,
  selectedPhoto: photo,
  address,
  currency: 'USD',
}

function renderPayment(override?: Partial<AppState>) {
  return render(
    <AppStateProvider initialState={{ ...paymentInitial, ...override }}>
      <CheckoutPaymentScreen />
    </AppStateProvider>
  )
}

describe('CheckoutPaymentScreen', () => {
  it('renders step indicator', () => {
    renderPayment()
    expect(screen.getByText('Step 3 of 3')).toBeInTheDocument()
  })

  it('shows total due', () => {
    renderPayment()
    expect(screen.getByTestId('payment-summary')).toBeInTheDocument()
    // $29 + $8.99 shipping = $37.99
    expect(screen.getByText('$37.99')).toBeInTheDocument()
  })

  it('shows Apple Pay and Google Pay wallet buttons', () => {
    renderPayment()
    expect(screen.getByTestId('apple-pay-button')).toBeInTheDocument()
    expect(screen.getByTestId('google-pay-button')).toBeInTheDocument()
  })

  it('shows card input fields', () => {
    renderPayment()
    expect(screen.getByTestId('card-number')).toBeInTheDocument()
    expect(screen.getByTestId('card-expiry')).toBeInTheDocument()
    expect(screen.getByTestId('card-cvc')).toBeInTheDocument()
  })

  it('pay button is disabled until payment method selected', () => {
    renderPayment()
    expect(screen.getByTestId('pay-button')).toBeDisabled()
  })

  it('pay button enables after selecting Apple Pay', () => {
    renderPayment()
    fireEvent.click(screen.getByTestId('apple-pay-button'))
    expect(screen.getByTestId('pay-button')).not.toBeDisabled()
  })

  it('pay button shows correct total', () => {
    renderPayment()
    expect(screen.getByTestId('pay-button')).toHaveTextContent('$37.99')
  })

  it('shows Stripe security note', () => {
    renderPayment()
    expect(screen.getByText(/Payments processed securely by Stripe/)).toBeInTheDocument()
  })
})
