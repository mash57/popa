import { useEffect, useState } from 'react'
import { useAppState } from '../lib/appState'
import { getResolutionRating } from '../lib/resolution'
import type { Photo, ResolutionRating } from '../types'

// Placeholder photos for when Google Photos API is not yet wired
function makePlaceholderPhotos(count: number): Photo[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `placeholder-${i}`,
    thumbnailUrl: `https://picsum.photos/seed/${i}/200/200`,
    fullResUrl: `https://picsum.photos/seed/${i}/3000/3000`,
    width: 3000,
    height: 3000,
    takenAt: new Date(Date.now() - i * 86400000).toISOString(),
  }))
}

function RatingBadge({ rating }: { rating: ResolutionRating }) {
  const emoji = { green: '🟢', amber: '🟡', red: '🔴' }[rating]
  return (
    <span
      className="absolute top-1 right-1 text-[10px] leading-none"
      aria-label={`Resolution: ${rating}`}
    >
      {emoji}
    </span>
  )
}

export function GalleryScreen() {
  const { state, dispatch } = useAppState()
  const { selectedProduct, permissionGranted, selectedPhoto } = state
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In production: pull from pre-cached Google Photos buffer
    // For now: generate placeholders instantly
    const timeout = setTimeout(() => {
      setPhotos(makePlaceholderPhotos(24))
      setLoading(false)
    }, 0)
    return () => clearTimeout(timeout)
  }, [])

  // Pre-select the first photo
  useEffect(() => {
    if (photos.length > 0 && !selectedPhoto) {
      dispatch({ type: 'SELECT_PHOTO', photo: photos[0] })
    }
  }, [photos, selectedPhoto, dispatch])

  function selectPhoto(photo: Photo) {
    if (!selectedProduct) return
    const rating = getResolutionRating(photo, selectedProduct)
    if (rating === 'red') return // blocked
    dispatch({ type: 'SELECT_PHOTO', photo })
  }

  function handlePreview() {
    if (!selectedPhoto || !selectedProduct) return
    dispatch({ type: 'NAVIGATE', screen: 'aha' })
  }

  return (
    <div className="flex flex-col h-full" style={{ background: '#080808' }}>
      {/* Header */}
      <div className="px-5 pt-4 pb-2 flex-shrink-0">
        <button
          onClick={() => dispatch({ type: 'NAVIGATE', screen: 'home' })}
          className="flex items-center gap-2 mb-3 bg-transparent border-none cursor-pointer p-0"
          style={{ color: 'rgba(255,255,255,0.55)' }}
          aria-label="Back to home"
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M7 1L1 7l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[13px]">{selectedProduct?.label ?? 'Back'}</span>
        </button>
        <h1 className="text-[19px] font-light text-white mb-0 tracking-[-0.5px]">
          Choose a photo
        </h1>
        <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Tap to select · already loaded
        </p>
      </div>

      {/* Speed strip */}
      <div
        className="mx-5 mb-3 px-3 py-2 rounded-[10px] flex items-center gap-2 flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.05)' }}
        data-testid="speed-strip"
      >
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #FF9A3C, #C05FFF)',
            boxShadow: '0 0 6px rgba(192,95,255,0.6)',
            animation: 'pulse 2s infinite',
          }}
        />
        <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Photos ready
        </span>
        {!loading && (
          <span className="ml-auto text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {photos.length} photos · instant
          </span>
        )}
      </div>

      {/* Photo grid */}
      <div
        className="flex-1 overflow-y-auto px-[2px]"
        style={{ scrollbarWidth: 'none' }}
        data-testid="photo-grid"
      >
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Loading…</span>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-[2px]">
            {photos.map(photo => {
              const rating = selectedProduct ? getResolutionRating(photo, selectedProduct) : 'green'
              const isSelected = selectedPhoto?.id === photo.id
              const isBlocked = rating === 'red'

              return (
                <button
                  key={photo.id}
                  onClick={() => selectPhoto(photo)}
                  className="relative aspect-square overflow-hidden bg-[#1C1C1E] cursor-pointer border-0 p-0"
                  style={{
                    outline: isSelected ? '2px solid white' : 'none',
                    outlineOffset: -2,
                    opacity: isBlocked ? 0.4 : 1,
                  }}
                  aria-label={`Photo ${photo.id}${isSelected ? ', selected' : ''}${isBlocked ? ', too low resolution' : ''}`}
                  data-testid={`photo-${photo.id}`}
                >
                  <img
                    src={photo.thumbnailUrl}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(255,255,255,0.9)' }}
                      >
                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                          <path d="M1 5l3.5 3.5L11 1" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  )}
                  {!permissionGranted && rating !== 'green' && (
                    <RatingBadge rating={rating} />
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-5 pt-3 pb-6 flex-shrink-0" style={{ background: '#080808' }}>
        <button
          onClick={handlePreview}
          disabled={!selectedPhoto || !selectedProduct}
          className="w-full py-[14px] rounded-[26px] text-[15px] font-medium tracking-[0.1px] cursor-pointer disabled:opacity-40 transition-opacity"
          style={{ background: '#FFFFFF', color: '#000', border: 'none' }}
          data-testid="preview-button"
        >
          Preview on {selectedProduct?.label ?? 'product'} →
        </button>
      </div>
    </div>
  )
}
