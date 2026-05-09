import { useEffect, useRef } from 'react'
import { useAppState } from '../lib/appState'
import { getResolutionRating } from '../lib/resolution'
import { loadPhotosFromFiles } from '../lib/photoLoader'
import type { ResolutionRating } from '../types'

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
  const { selectedProduct, selectedPhoto, photos } = state
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Pre-select the first photo when photos arrive
  useEffect(() => {
    if (photos.length > 0 && !selectedPhoto) {
      dispatch({ type: 'SELECT_PHOTO', photo: photos[0] })
    }
  }, [photos, selectedPhoto, dispatch])

  async function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    dispatch({ type: 'SET_PERMISSION', granted: true })
    const loaded = await loadPhotosFromFiles(files)
    dispatch({ type: 'SET_PHOTOS', photos: loaded })
    e.target.value = ''
  }

  function handlePreview() {
    if (!selectedPhoto || !selectedProduct) return
    dispatch({ type: 'NAVIGATE', screen: 'aha' })
  }

  return (
    <div className="flex flex-col h-full" style={{ background: '#080808' }}>
      {/* Hidden file input for adding more photos */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFilesSelected}
      />

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[19px] font-light text-white mb-0 tracking-[-0.5px]">
              Choose a photo
            </h1>
            <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {photos.length > 0 ? `${photos.length} photos` : 'Select from your device'}
            </p>
          </div>
          {photos.length > 0 && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-[12px] px-3 py-1.5 rounded-[10px] border-none cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
            >
              + Add
            </button>
          )}
        </div>
      </div>

      {/* Photo grid or empty state */}
      <div
        className="flex-1 overflow-y-auto px-[2px]"
        style={{ scrollbarWidth: 'none' }}
        data-testid="photo-grid"
      >
        {photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 px-8">
            <div
              className="w-16 h-16 rounded-[18px] flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="2" y="6" width="24" height="18" rx="3" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" />
                <circle cx="10" cy="13" r="2.5" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" />
                <path d="M2 20l6-5 4 4 4-3 8 7" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M20 2v8M16 6h8" stroke="white" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-[15px] text-white mb-1">No photos yet</p>
              <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Select photos from your device to get started
              </p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 rounded-[22px] text-[14px] font-medium cursor-pointer"
              style={{ background: '#FFFFFF', color: '#000', border: 'none' }}
              data-testid="pick-photos-button"
            >
              Choose photos
            </button>
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
                  onClick={() => {
                    if (!selectedProduct || isBlocked) return
                    dispatch({ type: 'SELECT_PHOTO', photo })
                  }}
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
                  <RatingBadge rating={rating} />
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
