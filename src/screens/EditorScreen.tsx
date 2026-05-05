import { useState, useEffect } from 'react'
import { useAppState } from '../lib/appState'
import type { EditorAdjustments } from '../types'

type Tool = keyof Omit<EditorAdjustments, 'text'> | 'text'

const TOOLS: { id: Tool; label: string }[] = [
  { id: 'crop', label: 'Crop' },
  { id: 'brightness', label: 'Brightness' },
  { id: 'contrast', label: 'Contrast' },
  { id: 'warmth', label: 'Warmth' },
  { id: 'text', label: 'Text' },
]

export function EditorScreen() {
  const { state, dispatch } = useAppState()
  const { selectedProduct, selectedPhoto, editorAdjustments } = state
  const [activeTool, setActiveTool] = useState<Tool>('crop')

  useEffect(() => {
    setActiveTool('crop')
  }, [selectedPhoto])

  function handleSlider(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch({
      type: 'UPDATE_ADJUSTMENT',
      key: activeTool as keyof EditorAdjustments,
      value: Number(e.target.value),
    })
  }

  const currentValue =
    activeTool === 'text'
      ? 0
      : (editorAdjustments[activeTool as keyof EditorAdjustments] as number)

  return (
    <div className="flex flex-col h-full" style={{ background: '#080808' }}>
      {/* Product preview area */}
      <div className="flex-1 flex items-center justify-center px-8 py-4 relative">
        <div
          className="w-full max-w-[280px] relative"
          style={{ boxShadow: '0 3px 0 rgba(0,0,0,0.5), 0 6px 20px rgba(0,0,0,0.6)' }}
        >
          {/* Placeholder product with photo */}
          <div
            className="aspect-[4/5] rounded-[2px] overflow-hidden relative"
            style={{ background: '#1C1C1E' }}
          >
            {selectedPhoto && (
              <img
                src={selectedPhoto.thumbnailUrl}
                alt="Selected photo"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Crop handles */}
          {activeTool === 'crop' && (
            <>
              <CropHandle position="top-left" />
              <CropHandle position="top-right" />
              <CropHandle position="bottom-left" />
              <CropHandle position="bottom-right" />
            </>
          )}
        </div>
      </div>

      {/* Tool chips + slider */}
      <div
        className="flex-shrink-0 px-5 pb-2 pt-3"
        style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)', background: '#080808' }}
      >
        {/* Scrollable chip row */}
        <div
          className="flex gap-2 overflow-x-auto pb-3"
          style={{ scrollbarWidth: 'none' }}
          data-testid="tool-chips"
        >
          {TOOLS.map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className="flex-shrink-0 px-4 py-[6px] rounded-[16px] text-[12px] font-medium cursor-pointer transition-all"
              style={{
                background: activeTool === tool.id ? '#FFFFFF' : 'rgba(255,255,255,0.08)',
                color: activeTool === tool.id ? '#000' : 'rgba(255,255,255,0.6)',
                border: 'none',
              }}
              data-testid={`tool-${tool.id}`}
            >
              {tool.label}
            </button>
          ))}
        </div>

        {/* Active tool slider */}
        {activeTool !== 'text' && (
          <div className="flex items-center gap-3 mb-4" data-testid="tool-slider">
            <span className="text-[8px] uppercase tracking-[1px] w-16" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {activeTool}
            </span>
            <div className="flex-1 relative">
              <input
                type="range"
                min={-100}
                max={100}
                value={currentValue}
                onChange={handleSlider}
                className="w-full h-[3px] appearance-none rounded-full cursor-pointer"
                style={{
                  background: `linear-gradient(90deg, #FF9A3C ${(currentValue + 100) / 2}%, rgba(255,255,255,0.15) ${(currentValue + 100) / 2}%)`,
                }}
                aria-label={`${activeTool} adjustment`}
              />
            </div>
            <span className="text-[12px] w-8 text-right" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {currentValue > 0 ? `+${currentValue}` : currentValue}
            </span>
          </div>
        )}

        {activeTool === 'text' && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Add text…"
              value={editorAdjustments.text}
              onChange={e =>
                dispatch({ type: 'UPDATE_ADJUSTMENT', key: 'text', value: e.target.value })
              }
              className="w-full bg-transparent border-0 border-b text-white text-[14px] pb-2 outline-none"
              style={{ borderBottomColor: 'rgba(255,255,255,0.15)' }}
              data-testid="text-input"
            />
          </div>
        )}
      </div>

      {/* Bottom action bar */}
      <div
        className="flex gap-3 px-5 pb-6 pt-2 flex-shrink-0"
        style={{ background: '#080808' }}
      >
        <button
          onClick={() => dispatch({ type: 'NAVIGATE', screen: 'aha' })}
          className="flex-1 py-[13px] rounded-[26px] text-[14px] cursor-pointer"
          style={{ background: 'none', border: '0.5px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}
          data-testid="back-button"
        >
          ← Back
        </button>
        <button
          onClick={() => dispatch({ type: 'NAVIGATE', screen: 'bundle' })}
          className="flex-[2] py-[13px] rounded-[26px] text-[14px] font-medium cursor-pointer"
          style={{ background: '#FFFFFF', color: '#000', border: 'none' }}
          data-testid="add-to-order-button"
        >
          Add to order →
        </button>
      </div>
    </div>
  )
}

function CropHandle({ position }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) {
  const posStyles: Record<string, React.CSSProperties> = {
    'top-left': { top: -4, left: -4 },
    'top-right': { top: -4, right: -4 },
    'bottom-left': { bottom: -4, left: -4 },
    'bottom-right': { bottom: -4, right: -4 },
  }
  return (
    <div
      className="absolute w-4 h-4 bg-white rounded-[2px]"
      style={{ ...posStyles[position], boxShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
      data-testid={`crop-handle-${position}`}
    />
  )
}
