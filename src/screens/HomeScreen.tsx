import { useState, useEffect, useRef } from 'react'
import { ProductCard } from '../components/ProductCard'
import { PermissionSheet } from '../components/PermissionSheet'
import { useAppState } from '../lib/appState'
import { loadProducts } from '../lib/products'
import { loadPhotosFromFiles } from '../lib/photoLoader'
import type { Product } from '../types'

export function HomeScreen() {
  const { state, dispatch } = useAppState()
  const [products, setProducts] = useState<Product[]>([])
  const [current, setCurrent] = useState(0)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadProducts().then(setProducts)
  }, [])

  function prev() { setCurrent(c => Math.max(0, c - 1)) }
  function next() { setCurrent(c => Math.min(products.length - 1, c + 1)) }

  function handleTapZone(e: React.MouseEvent<HTMLDivElement>) {
    const x = e.clientX
    const w = e.currentTarget.clientWidth
    const zone = x / w
    if (zone < 0.33) prev()
    else if (zone > 0.67) next()
    else {
      if (products[current]) {
        dispatch({ type: 'SELECT_PRODUCT', product: products[current] })
        if (state.permissionGranted) {
          dispatch({ type: 'NAVIGATE', screen: 'gallery' })
        } else {
          setSheetOpen(true)
        }
      }
    }
  }

  function handleTouchStart(e: React.TouchEvent) {
    setTouchStart(e.touches[0].clientX)
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStart === null) return
    const diff = touchStart - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) {
      if (diff > 0) next()
      else prev()
    }
    setTouchStart(null)
  }

  function handleAllow() {
    setSheetOpen(false)
    if (products[current]) {
      dispatch({ type: 'SELECT_PRODUCT', product: products[current] })
    }
    // Open native file picker — triggers camera roll on mobile
    fileInputRef.current?.click()
  }

  function handleDeny() {
    setSheetOpen(false)
    if (products[current]) {
      dispatch({ type: 'SELECT_PRODUCT', product: products[current] })
    }
    dispatch({ type: 'NAVIGATE', screen: 'gallery' })
  }

  async function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) {
      dispatch({ type: 'NAVIGATE', screen: 'gallery' })
      return
    }
    dispatch({ type: 'SET_PERMISSION', granted: true })
    const photos = await loadPhotosFromFiles(files)
    dispatch({ type: 'SET_PHOTOS', photos })
    dispatch({ type: 'NAVIGATE', screen: 'gallery' })
    // Reset so the same files can be re-selected later
    e.target.value = ''
  }

  return (
    <div className="flex flex-col h-full" style={{ background: '#080808' }}>
      {/* Hidden file input — opened programmatically on Allow */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFilesSelected}
      />

      {/* Status bar */}
      <div className="flex justify-between items-center px-[22px] pt-[6px] pb-0 flex-shrink-0 z-10">
        <span className="text-[13px] font-semibold text-white tracking-[-0.3px]">9:41</span>
        <span className="text-[10px] tracking-[0.2px]" style={{ color: 'rgba(255,255,255,0.65)' }}>▮▮▮ WiFi 100%</span>
      </div>

      {/* Wordmark */}
      <div className="text-center py-2 flex-shrink-0 z-10">
        <span className="text-[10px] tracking-[5px] lowercase" style={{ color: 'rgba(255,255,255,0.28)' }}>
          p · o · p · a
        </span>
        <span className="block text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>mash</span>
      </div>

      {/* Card area */}
      <div
        className="flex-1 relative overflow-hidden"
        onClick={handleTapZone}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        data-testid="card-area"
      >
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} offset={i - current} />
        ))}

        <PermissionSheet open={sheetOpen} onAllow={handleAllow} onDeny={handleDeny} />
      </div>

      {/* Dot indicator */}
      <div className="flex justify-center gap-[5px] py-[7px] flex-shrink-0" style={{ background: '#080808' }}>
        {products.map((_, i) => (
          <div
            key={i}
            className="h-1 rounded-full transition-all duration-300"
            style={{
              width: i === current ? 18 : 4,
              background: i === current ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.18)',
              borderRadius: i === current ? 3 : '50%',
            }}
          />
        ))}
      </div>

      {/* Bottom nav */}
      <div
        className="flex justify-between items-center px-7 pt-[10px] pb-[18px] flex-shrink-0"
        style={{ background: '#080808', borderTop: '0.5px solid rgba(255,255,255,0.04)' }}
      >
        <button className="flex flex-col items-center gap-[3px] bg-transparent border-none cursor-pointer p-0">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="8" r="4" stroke="white" strokeOpacity="0.3" strokeWidth="1.3" />
            <path d="M3 20c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="white" strokeOpacity="0.3" strokeWidth="1.3" />
          </svg>
          <span className="text-[9px] tracking-[0.5px] lowercase" style={{ color: 'rgba(255,255,255,0.28)' }}>me</span>
        </button>

        <button
          onClick={e => { e.stopPropagation(); setSheetOpen(true) }}
          className="flex items-center gap-[7px] bg-white text-black border-none rounded-[22px] px-[26px] py-[10px] text-[13px] font-medium cursor-pointer active:scale-[0.96] transition-transform"
          data-testid="create-button"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1v11M1 6.5h11" stroke="black" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          create
        </button>

        <div className="w-[38px]" />
      </div>
    </div>
  )
}
