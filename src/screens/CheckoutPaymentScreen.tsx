import { useState } from 'react'
import { useAppState } from '../lib/appState'
import { formatPrice, getShippingCost, BUNDLE_DISCOUNT, estimateDeliveryDate } from '../lib/pricing'
import type { Order } from '../types'

export function CheckoutPaymentScreen() {
  const { state, dispatch } = useAppState()
  const { selectedProduct, selectedPhoto, bundleProduct, address, currency } = state
  const [processing, setProcessing] = useState(false)
  const [payMethod, setPayMethod] = useState<'apple' | 'google' | 'card' | null>(null)
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')

  if (!selectedProduct || !selectedPhoto || !address) return null

  const primaryPrice = selectedProduct.priceFrom
  const bundlePrice = bundleProduct
    ? Math.round(bundleProduct.priceFrom * (1 - BUNDLE_DISCOUNT) * 100) / 100
    : 0
  const subtotal = primaryPrice + bundlePrice
  const shipping = getShippingCost(currency)
  const total = subtotal + shipping

  async function handlePay() {
    if (!payMethod) return
    setProcessing(true)
    try {
      // Create PaymentIntent via backend
      const intentRes = await fetch('/api/payments/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(total * 100),
          currency: currency.toLowerCase(),
          productId: selectedProduct!.id,
          bundleProductId: bundleProduct?.id,
        }),
      })
      const { clientSecret, orderId } = await intentRes.json()

      // In production: use Stripe.js to confirm payment with clientSecret
      // For now: simulate confirmation
      await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientSecret, orderId, address, payMethod }),
      })

      const order: Order = {
        id: orderId ?? `popa-${Date.now()}`,
        items: [{ product: selectedProduct!, photo: selectedPhoto!, quantity: 1, unitPrice: primaryPrice, currency }],
        bundleItem: bundleProduct
          ? { product: bundleProduct, photo: selectedPhoto!, quantity: 1, unitPrice: bundlePrice, currency }
          : undefined,
        address: address!,
        subtotal,
        shippingCost: shipping,
        total,
        currency,
        estimatedDeliveryDate: estimateDeliveryDate(
          bundleProduct ? Math.max(selectedProduct!.shipsIn, bundleProduct.shipsIn) : selectedProduct!.shipsIn
        ),
        status: 'payment_confirmed',
        createdAt: new Date().toISOString(),
        stripePaymentIntentId: clientSecret?.split('_secret')[0],
      }
      dispatch({ type: 'SET_ORDER', order })
      dispatch({ type: 'NAVIGATE', screen: 'confirmation' })
    } catch {
      setProcessing(false)
    }
  }

  const canPay = payMethod !== null && !processing

  return (
    <div className="flex flex-col h-full" style={{ background: '#080808' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4 flex-shrink-0">
        <button
          onClick={() => dispatch({ type: 'NAVIGATE', screen: 'checkout-address' })}
          className="bg-transparent border-none cursor-pointer p-0"
          style={{ color: 'rgba(255,255,255,0.55)' }}
          aria-label="Back"
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M7 1L1 7l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div>
          <p className="text-[11px] uppercase tracking-[1.5px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Step 3 of 3</p>
          <h1 className="text-[20px] font-light text-white tracking-[-0.5px]">Payment</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {/* Order total summary */}
        <div
          className="flex justify-between items-center px-4 py-3 rounded-[12px] mb-5"
          style={{ background: 'rgba(255,255,255,0.05)' }}
          data-testid="payment-summary"
        >
          <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.6)' }}>Total due</span>
          <span className="text-[17px] font-medium text-white">{formatPrice(total, currency)}</span>
        </div>

        {/* Wallet buttons — primary CTAs */}
        <div className="space-y-2 mb-5" data-testid="wallet-buttons">
          <WalletButton
            type="apple"
            selected={payMethod === 'apple'}
            onClick={() => setPayMethod('apple')}
          />
          <WalletButton
            type="google"
            selected={payMethod === 'google'}
            onClick={() => setPayMethod('google')}
          />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1" style={{ height: '0.5px', background: 'rgba(255,255,255,0.1)' }} />
          <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>or pay by card</span>
          <div className="flex-1" style={{ height: '0.5px', background: 'rgba(255,255,255,0.1)' }} />
        </div>

        {/* Card fields */}
        <div
          className="rounded-[14px] overflow-hidden mb-4"
          style={{ border: payMethod === 'card' ? '1px solid rgba(255,154,60,0.5)' : '0.5px solid rgba(255,255,255,0.1)' }}
          data-testid="card-fields"
          onClick={() => setPayMethod('card')}
        >
          <CardField
            label="Card number"
            value={cardNumber}
            onChange={e => { setCardNumber(e.target.value); setPayMethod('card') }}
            placeholder="1234 5678 9012 3456"
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            testId="card-number"
          />
          <div className="flex" style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
            <div className="flex-1" style={{ borderRight: '0.5px solid rgba(255,255,255,0.08)' }}>
              <CardField
                label="Expiry"
                value={cardExpiry}
                onChange={e => { setCardExpiry(e.target.value); setPayMethod('card') }}
                placeholder="MM / YY"
                type="text"
                autoComplete="cc-exp"
                testId="card-expiry"
              />
            </div>
            <div className="flex-1">
              <CardField
                label="CVC"
                value={cardCvc}
                onChange={e => { setCardCvc(e.target.value); setPayMethod('card') }}
                placeholder="123"
                type="text"
                inputMode="numeric"
                autoComplete="cc-csc"
                testId="card-cvc"
              />
            </div>
          </div>
        </div>

        {/* Security note */}
        <p className="text-center text-[11px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
          🔒 Payments processed securely by Stripe
        </p>
      </div>

      {/* Pay CTA */}
      <div className="px-5 pb-6 pt-3 flex-shrink-0">
        <button
          onClick={handlePay}
          disabled={!canPay}
          className="w-full py-[14px] rounded-[26px] text-[15px] font-medium cursor-pointer transition-opacity disabled:opacity-40"
          style={{ background: '#FFFFFF', color: '#000', border: 'none' }}
          data-testid="pay-button"
        >
          {processing ? 'Processing…' : `Pay ${formatPrice(total, currency)}`}
        </button>
      </div>
    </div>
  )
}

function WalletButton({
  type, selected, onClick,
}: {
  type: 'apple' | 'google'
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full py-[13px] rounded-[14px] flex items-center justify-center gap-2 text-[15px] font-medium cursor-pointer transition-all"
      style={{
        background: type === 'apple' ? '#000' : '#fff',
        color: type === 'apple' ? '#fff' : '#000',
        border: selected ? '2px solid #FF9A3C' : `0.5px solid ${type === 'apple' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}`,
      }}
      data-testid={`${type}-pay-button`}
    >
      {type === 'apple' ? (
        <>
          <svg width="16" height="20" viewBox="0 0 16 20" fill="white">
            <path d="M13.23 10.56C13.2 8.24 15.16 7.13 15.24 7.08 14.13 5.43 12.38 5.2 11.77 5.18 10.28 5.03 8.84 6.06 8.08 6.06 7.3 6.06 6.12 5.19 4.85 5.22 3.22 5.25 1.7 6.17 0.87 7.63-0.8 10.6 0.46 14.98 2.07 17.39 2.88 18.57 3.83 19.9 5.1 19.85 6.34 19.8 6.81 19.07 8.31 19.07 9.8 19.07 10.24 19.85 11.54 19.82 12.88 19.79 13.7 18.62 14.49 17.43 15.44 16.07 15.83 14.74 15.85 14.67 15.82 14.66 13.26 13.68 13.23 10.56ZM10.85 3.6C11.5 2.81 11.93 1.73 11.81 0.64 10.89 0.68 9.77 1.26 9.1 2.03 8.51 2.71 7.99 3.83 8.13 4.89 9.15 4.97 10.19 4.38 10.85 3.6Z" />
          </svg>
          Apple Pay
        </>
      ) : (
        <>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Google Pay
        </>
      )}
    </button>
  )
}

function CardField({
  label, value, onChange, placeholder, type, inputMode, autoComplete, testId,
}: {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  type: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  autoComplete?: string
  testId?: string
}) {
  return (
    <div className="px-4 py-3">
      <label className="block text-[10px] uppercase tracking-[1px] mb-1.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
        {label}
      </label>
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        data-testid={testId}
        className="w-full bg-transparent text-white text-[15px] outline-none placeholder:text-white/25"
      />
    </div>
  )
}
