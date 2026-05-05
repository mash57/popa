import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppState } from '../lib/appState'
import { ProductPreview } from '../components/ProductPreview'
import type { ProductConfig } from '../types'

async function fetchConfig(mockupPath: string): Promise<ProductConfig> {
  const res = await fetch(`${mockupPath}/config.json`)
  return res.json()
}

export function AhaScreen() {
  const { state, dispatch } = useAppState()
  const { selectedProduct, selectedPhoto } = state
  const [config, setConfig] = useState<ProductConfig | null>(null)
  const [infoVisible, setInfoVisible] = useState(false)
  const [flashVisible, setFlashVisible] = useState(false)
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    if (!selectedProduct) return
    startTimeRef.current = performance.now()
    fetchConfig(selectedProduct.mockupPath).then(setConfig)
  }, [selectedProduct])

  // Trigger white flash and info reveal once config is ready
  useEffect(() => {
    if (!config) return
    // Flash at ~80ms
    setFlashVisible(true)
    setTimeout(() => setFlashVisible(false), 550)
    // Info fades in after dolly settles (~980ms)
    setTimeout(() => setInfoVisible(true), 980)
  }, [config])

  if (!selectedProduct || !selectedPhoto) return null

  const baseUrl = `${selectedProduct.mockupPath}/base.webp`
  const overlayUrl = `${selectedProduct.mockupPath}/overlay.webp`

  return (
    <div className="flex flex-col h-full relative" style={{ background: '#080808' }} data-testid="aha-screen">
      {/* White flash overlay */}
      <AnimatePresence>
        {flashVisible && (
          <motion.div
            className="absolute inset-0 z-50 pointer-events-none"
            style={{ background: 'white' }}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {/* Product — centred, dolly push */}
      <div className="flex-1 flex items-center justify-center px-8">
        <AnimatePresence>
          {config && (
            <motion.div
              className="w-full max-w-[320px]"
              data-testid="aha-product"
              initial={{ scale: 0.72, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                opacity: { duration: 0.13, ease: 'easeOut' },
                scale: {
                  type: 'spring',
                  stiffness: 180,
                  damping: 18,
                  // Overshoot to 1.07 then settle — spring physics does this naturally
                },
              }}
            >
              <div
                className="w-full relative"
                style={{
                  boxShadow: '0 3px 0 rgba(0,0,0,0.5), 0 6px 20px rgba(0,0,0,0.6)',
                }}
              >
                {/* Gloss overlay */}
                <div
                  className="absolute inset-0 z-10 pointer-events-none rounded-[2px]"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.08), transparent 50%, rgba(0,0,0,0.15))',
                  }}
                />
                {/* Film grain */}
                <div
                  className="absolute inset-0 z-10 pointer-events-none rounded-[2px]"
                  style={{
                    opacity: 0.05,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                  }}
                />
                <ProductPreview
                  photoUrl={selectedPhoto.fullResUrl}
                  config={config}
                  baseUrl={baseUrl}
                  overlayUrl={overlayUrl}
                  className="w-full h-auto block"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product info — fades in after dolly settles */}
      <motion.div
        className="text-center pb-4 px-5 flex-shrink-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: infoVisible ? 1 : 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <p className="text-white text-[17px] font-light tracking-[-0.4px]">
          {selectedProduct.label}
        </p>
        <p className="text-[12px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Tap to edit · pinch to zoom
        </p>
      </motion.div>

      {/* CTA */}
      <div className="px-5 pb-6 flex-shrink-0">
        <button
          onClick={() => dispatch({ type: 'NAVIGATE', screen: 'editor' })}
          className="w-full py-[14px] rounded-[26px] text-[15px] font-medium cursor-pointer"
          style={{ background: '#FFFFFF', color: '#000', border: 'none' }}
          data-testid="aha-cta"
        >
          Looks great — edit ✦
        </button>
      </div>
    </div>
  )
}
