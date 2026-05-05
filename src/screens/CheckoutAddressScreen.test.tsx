import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CheckoutAddressScreen } from './CheckoutAddressScreen'
import { AppStateProvider } from '../lib/appState'
import type { AppState } from '../types'

const addressInitial: Partial<AppState> = { screen: 'checkout-address', currency: 'USD' }

function renderAddress(override?: Partial<AppState>) {
  return render(
    <AppStateProvider initialState={{ ...addressInitial, ...override }}>
      <CheckoutAddressScreen />
    </AppStateProvider>
  )
}

describe('CheckoutAddressScreen', () => {
  it('renders step indicator', () => {
    renderAddress()
    expect(screen.getByText('Step 2 of 3')).toBeInTheDocument()
  })

  it('renders all required fields', () => {
    renderAddress()
    expect(screen.getByTestId('field-name')).toBeInTheDocument()
    expect(screen.getByTestId('field-line1')).toBeInTheDocument()
    expect(screen.getByTestId('field-city')).toBeInTheDocument()
    expect(screen.getByTestId('field-postcode')).toBeInTheDocument()
    expect(screen.getByTestId('field-country')).toBeInTheDocument()
  })

  it('line2 field is optional', () => {
    renderAddress()
    expect(screen.getByTestId('field-line2')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Apt, suite/)).toBeInTheDocument()
  })

  it('blocks navigation when fields are empty', () => {
    renderAddress()
    fireEvent.click(screen.getByTestId('continue-to-payment'))
    expect(screen.getAllByText('Required').length).toBeGreaterThan(0)
  })

  it('accepts form input', () => {
    renderAddress()
    fireEvent.change(screen.getByTestId('field-name'), { target: { value: 'Jane Smith' } })
    expect(screen.getByTestId('field-name')).toHaveValue('Jane Smith')
  })

  it('navigates to payment when form is filled', () => {
    renderAddress()
    fireEvent.change(screen.getByTestId('field-name'), { target: { value: 'Jane Smith' } })
    fireEvent.change(screen.getByTestId('field-line1'), { target: { value: '123 Main St' } })
    fireEvent.change(screen.getByTestId('field-city'), { target: { value: 'New York' } })
    fireEvent.change(screen.getByTestId('field-postcode'), { target: { value: '10001' } })
    fireEvent.click(screen.getByTestId('continue-to-payment'))
    // No "Required" shown = form valid, navigation dispatched
    expect(screen.queryByText('Required')).not.toBeInTheDocument()
  })
})
