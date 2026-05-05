import { useAppState } from '../lib/appState'
import { formatPrice, getShippingCost, estimateDeliveryDate, BUNDLE_DISCOUNT } from '../lib/pricing'

export function CheckoutReviewScreen() {
  const { state, dispatch } = useAppState()
  const { selectedProduct, selectedPhoto, bundleProduct, currency } = state

  if (!selectedProduct || !selectedPhoto) return null

  const primaryPrice = selectedProduct.priceFrom
  const bundlePrice = bundleProduct
    ? Math.round(bundleProduct.priceFrom * (1 - BUNDLE_DISCOUNT) * 100) / 100
    : 0
  const subtotal = primaryPrice + bundlePrice
  const shipping = getShippingCost(currency)
  const total = subtotal + shipping
  const shipsIn = bundleProduct
    ? Math.max(selectedProduct.shipsIn, bundleProduct.shipsIn)
    : selectedProduct.shipsIn
  const deliveryDate = estimateDeliveryDate(shipsIn)

  return (
    <div className="flex flex-col h-full" style={{ background: '#080808' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4 flex-shrink-0">
        <button
          onClick={() => dispatch({ type: 'NAVIGATE', screen: 'bundle' })}
          className="bg-transparent border-none cursor-pointer p-0"
          style={{ color: 'rgba(255,255,255,0.55)' }}
          aria-label="Back"
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M7 1L1 7l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div>
          <p className="text-[11px] uppercase tracking-[1.5px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Step 1 of 3</p>
          <h1 className="text-[20px] font-light text-white tracking-[-0.5px]">Review order</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5">
        {/* Items */}
        <div className="mb-5" data-testid="order-items">
          <OrderItem
            thumbnail={selectedPhoto.thumbnailUrl}
            label={selectedProduct.label}
            price={formatPrice(primaryPrice, currency)}
            testId="primary-item"
          />
          {bundleProduct && (
            <OrderItem
              thumbnail={selectedPhoto.thumbnailUrl}
              label={`${bundleProduct.label} (bundle)`}
              price={formatPrice(bundlePrice, currency)}
              originalPrice={formatPrice(bundleProduct.priceFrom, currency)}
              testId="bundle-item"
            />
          )}
        </div>

        {/* Divider */}
        <div className="mb-4" style={{ height: '0.5px', background: 'rgba(255,255,255,0.08)' }} />

        {/* Price breakdown */}
        <div className="space-y-2 mb-4" data-testid="price-breakdown">
          <PriceLine label="Subtotal" value={formatPrice(subtotal, currency)} />
          <PriceLine label="Shipping" value={formatPrice(shipping, currency)} />
          <div className="pt-2" style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
            <PriceLine label="Total" value={formatPrice(total, currency)} bold />
          </div>
        </div>

        {/* Delivery estimate */}
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-[12px] mb-6"
          style={{ background: 'rgba(255,255,255,0.05)' }}
          data-testid="delivery-estimate"
        >
          <span className="text-[20px]">📦</span>
          <div>
            <p className="text-[13px] text-white">Estimated delivery</p>
            <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{deliveryDate}</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 pb-6 pt-3 flex-shrink-0">
        <button
          onClick={() => dispatch({ type: 'NAVIGATE', screen: 'checkout-address' })}
          className="w-full py-[14px] rounded-[26px] text-[15px] font-medium cursor-pointer"
          style={{ background: '#FFFFFF', color: '#000', border: 'none' }}
          data-testid="continue-to-address"
        >
          Continue →
        </button>
      </div>
    </div>
  )
}

function OrderItem({
  thumbnail, label, price, originalPrice, testId,
}: {
  thumbnail: string
  label: string
  price: string
  originalPrice?: string
  testId?: string
}) {
  return (
    <div className="flex items-center gap-3 py-3" data-testid={testId}>
      <div className="w-14 h-14 rounded-[8px] overflow-hidden flex-shrink-0" style={{ background: '#1C1C1E' }}>
        <img src={thumbnail} alt={label} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] text-white truncate">{label}</p>
        <p className="text-[12px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Qty 1</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-[14px] text-white">{price}</p>
        {originalPrice && (
          <p className="text-[11px] line-through" style={{ color: 'rgba(255,255,255,0.3)' }}>{originalPrice}</p>
        )}
      </div>
    </div>
  )
}

function PriceLine({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className={bold ? 'text-[15px] text-white font-medium' : 'text-[13px]'}
        style={bold ? undefined : { color: 'rgba(255,255,255,0.55)' }}>
        {label}
      </span>
      <span className={bold ? 'text-[15px] text-white font-medium' : 'text-[13px] text-white'}>
        {value}
      </span>
    </div>
  )
}
