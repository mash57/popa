import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAppState } from '../lib/appState'
import { loadProducts } from '../lib/products'
import { getBundleComplement, formatPrice, BUNDLE_DISCOUNT, estimateDeliveryDate } from '../lib/pricing'
import { productGradients } from '../lib/tokens'
import type { Product } from '../types'

export function BundleScreen() {
  const { state, dispatch } = useAppState()
  const { selectedProduct, selectedPhoto, currency } = state
  const [bundleCandidate, setBundleCandidate] = useState<Product | null>(null)
  const [accepted, setAccepted] = useState(false)

  useEffect(() => {
    if (!selectedProduct) return
    loadProducts().then(all => {
      const complement = getBundleComplement(selectedProduct, all)
      setBundleCandidate(complement)
    })
  }, [selectedProduct])

  function handleAccept() {
    if (!bundleCandidate) return
    dispatch({ type: 'SET_BUNDLE_PRODUCT', product: bundleCandidate })
    setAccepted(true)
    setTimeout(() => dispatch({ type: 'NAVIGATE', screen: 'checkout-review' }), 350)
  }

  function handleSkip() {
    dispatch({ type: 'SET_BUNDLE_PRODUCT', product: null })
    dispatch({ type: 'NAVIGATE', screen: 'checkout-review' })
  }

  if (!selectedProduct || !selectedPhoto) return null

  const primaryPrice = selectedProduct.priceFrom
  const bundlePrice = bundleCandidate
    ? Math.round(bundleCandidate.priceFrom * (1 - BUNDLE_DISCOUNT) * 100) / 100
    : 0

  return (
    <div className="flex flex-col h-full px-5 pt-6 pb-6" style={{ background: '#080808' }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[22px] font-light text-white tracking-[-0.6px] mb-1">
          Complete the set
        </h1>
        <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Same photo, different product — bundle & save
        </p>
      </div>

      {/* Side-by-side products */}
      <div className="flex gap-3 mb-6 flex-1">
        {/* Primary product */}
        <motion.div
          className="flex-1 rounded-[14px] overflow-hidden relative"
          style={{ background: productGradients[selectedProduct.category] ?? '#1C1C1E', minHeight: 180 }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          data-testid="primary-product-card"
        >
          <img
            src={selectedPhoto.thumbnailUrl}
            alt={selectedProduct.label}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div
            className="absolute inset-0 flex flex-col justify-end p-3"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }}
          >
            <span className="text-[11px] uppercase tracking-[1px] text-white/50 mb-0.5">Your pick</span>
            <span className="text-[15px] font-light text-white leading-tight">{selectedProduct.label}</span>
            <span className="text-[12px] mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {formatPrice(primaryPrice, currency)}
            </span>
          </div>
        </motion.div>

        {/* Bundle product */}
        {bundleCandidate ? (
          <motion.div
            className="flex-1 rounded-[14px] overflow-hidden relative cursor-pointer"
            style={{
              background: productGradients[bundleCandidate.category] ?? '#1C1C1E',
              minHeight: 180,
              border: accepted ? '2px solid #FF9A3C' : '2px solid transparent',
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08, ease: [0.32, 0.72, 0, 1] }}
            onClick={handleAccept}
            data-testid="bundle-product-card"
          >
            <img
              src={selectedPhoto.thumbnailUrl}
              alt={bundleCandidate.label}
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            {/* Discount badge */}
            <div
              className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-medium uppercase tracking-[1px]"
              style={{ background: 'linear-gradient(90deg, #FF9A3C, #C05FFF)', color: 'white' }}
            >
              -{Math.round(BUNDLE_DISCOUNT * 100)}% off
            </div>
            <div
              className="absolute inset-0 flex flex-col justify-end p-3"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }}
            >
              <span className="text-[11px] uppercase tracking-[1px] text-white/50 mb-0.5">Add on</span>
              <span className="text-[15px] font-light text-white leading-tight">{bundleCandidate.label}</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-[12px] font-medium" style={{ color: '#FF9A3C' }}>
                  {formatPrice(bundlePrice, currency)}
                </span>
                <span
                  className="text-[11px] line-through"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                >
                  {formatPrice(bundleCandidate.priceFrom, currency)}
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex-1 rounded-[14px] flex items-center justify-center" style={{ background: '#1C1C1E' }}>
            <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Loading…</span>
          </div>
        )}
      </div>

      {/* Savings callout */}
      {bundleCandidate && (
        <motion.div
          className="mb-5 px-4 py-3 rounded-[12px] flex items-center gap-3"
          style={{ background: 'rgba(255,154,60,0.1)', border: '0.5px solid rgba(255,154,60,0.3)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          data-testid="savings-callout"
        >
          <span className="text-[18px]">✦</span>
          <div>
            <p className="text-[13px] text-white font-medium">
              Save {formatPrice(bundleCandidate.priceFrom - bundlePrice, currency)} on your bundle
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Ships together · est. {estimateDeliveryDate(Math.max(selectedProduct.shipsIn, bundleCandidate.shipsIn))}
            </p>
          </div>
        </motion.div>
      )}

      {/* CTAs */}
      <div className="flex flex-col gap-2">
        {bundleCandidate && (
          <button
            onClick={handleAccept}
            className="w-full py-[14px] rounded-[26px] text-[15px] font-medium cursor-pointer"
            style={{ background: '#FFFFFF', color: '#000', border: 'none' }}
            data-testid="accept-bundle-button"
          >
            Add {bundleCandidate.label} to order →
          </button>
        )}
        <button
          onClick={handleSkip}
          className="w-full py-[13px] rounded-[26px] text-[14px] cursor-pointer"
          style={{ background: 'none', border: '0.5px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)' }}
          data-testid="skip-bundle-button"
        >
          Just the {selectedProduct.label}
        </button>
      </div>
    </div>
  )
}
