import { motion } from 'framer-motion'
import { useAppState } from '../lib/appState'
import { formatPrice } from '../lib/pricing'

export function ConfirmationScreen() {
  const { state, dispatch } = useAppState()
  const { order } = state

  if (!order) return null

  function handleOrderMore() {
    dispatch({ type: 'NAVIGATE', screen: 'home' })
  }

  return (
    <div className="flex flex-col h-full px-5 pt-8 pb-6 items-center" style={{ background: '#080808' }}>
      {/* Animated checkmark */}
      <motion.div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
        style={{ background: 'linear-gradient(135deg, #FF9A3C, #C05FFF)' }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.1 }}
        data-testid="confirmation-checkmark"
      >
        <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
          <motion.path
            d="M2 11l8 8L26 2"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
          />
        </svg>
      </motion.div>

      <motion.div
        className="text-center mb-8 w-full"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="text-[24px] font-light text-white tracking-[-0.6px] mb-2">
          Order confirmed ✦
        </h1>
        <p className="text-[14px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Order #{order.id}
        </p>
      </motion.div>

      {/* Product thumbnails */}
      <motion.div
        className="flex gap-3 mb-6 justify-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        data-testid="order-thumbnails"
      >
        {order.items.map(item => (
          <div key={item.product.id} className="w-20 h-20 rounded-[10px] overflow-hidden" style={{ background: '#1C1C1E' }}>
            <img src={item.photo.thumbnailUrl} alt={item.product.label} className="w-full h-full object-cover" />
          </div>
        ))}
        {order.bundleItem && (
          <div className="w-20 h-20 rounded-[10px] overflow-hidden" style={{ background: '#1C1C1E' }}>
            <img src={order.bundleItem.photo.thumbnailUrl} alt={order.bundleItem.product.label} className="w-full h-full object-cover" />
          </div>
        )}
      </motion.div>

      {/* Order summary */}
      <motion.div
        className="w-full rounded-[16px] px-5 py-4 mb-4"
        style={{ background: 'rgba(255,255,255,0.05)' }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        data-testid="order-summary"
      >
        <Row label="Total paid" value={formatPrice(order.total, order.currency)} />
        <Row label="Ships to" value={`${order.address.city}, ${order.address.country}`} />
        <Row label="Estimated delivery" value={order.estimatedDeliveryDate} highlight />
      </motion.div>

      {/* Status pipeline */}
      <motion.div
        className="w-full mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        data-testid="status-pipeline"
      >
        <StatusStep label="Order received" done />
        <StatusStep label="Art processing" active />
        <StatusStep label="Sent to print" />
        <StatusStep label="Shipped" />
        <StatusStep label="Delivered" />
      </motion.div>

      {/* CTAs */}
      <div className="w-full space-y-2 mt-auto">
        {order.trackingUrl && (
          <a
            href={order.trackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-[13px] rounded-[26px] text-[14px] font-medium text-center cursor-pointer"
            style={{ background: '#FFFFFF', color: '#000', textDecoration: 'none' }}
            data-testid="track-order-button"
          >
            Track your order →
          </a>
        )}
        <button
          onClick={handleOrderMore}
          className="w-full py-[13px] rounded-[26px] text-[14px] cursor-pointer"
          style={{ background: 'none', border: '0.5px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}
          data-testid="order-more-button"
        >
          Order more
        </button>
      </div>
    </div>
  )
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center py-1.5">
      <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</span>
      <span className={`text-[13px] ${highlight ? 'text-white font-medium' : ''}`}
        style={highlight ? undefined : { color: 'rgba(255,255,255,0.7)' }}>
        {value}
      </span>
    </div>
  )
}

function StatusStep({ label, done, active }: { label: string; done?: boolean; active?: boolean }) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <div
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{
          background: done
            ? 'linear-gradient(135deg, #FF9A3C, #C05FFF)'
            : active
            ? 'rgba(255,255,255,0.5)'
            : 'rgba(255,255,255,0.15)',
        }}
      />
      <span
        className="text-[13px]"
        style={{ color: done || active ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)' }}
      >
        {label}
      </span>
    </div>
  )
}
