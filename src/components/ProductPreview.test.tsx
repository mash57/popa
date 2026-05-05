import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProductPreview } from './ProductPreview'
import type { ProductConfig } from '../types'

// Mock canvas in jsdom
const mockGetContext = vi.fn(() => ({
  drawImage: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  clip: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  quadraticCurveTo: vi.fn(),
  closePath: vi.fn(),
  globalCompositeOperation: 'source-over',
}))

vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(mockGetContext as unknown as typeof HTMLCanvasElement.prototype.getContext)

const config: ProductConfig = {
  photoZone: { x: 64, y: 64, width: 744, height: 930, perspectiveTransform: [1,0,0,0,1,0,0,0,1], borderRadius: 2 },
  overlayBlendMode: 'multiply',
  baseSize: { w: 872, h: 1090 },
}

describe('ProductPreview', () => {
  it('renders a canvas element', () => {
    render(
      <ProductPreview
        photoUrl="photo.jpg"
        config={config}
        baseUrl="/mockups/canvas-8x10/base.webp"
        overlayUrl="/mockups/canvas-8x10/overlay.webp"
      />
    )
    expect(screen.getByTestId('product-preview-canvas')).toBeInTheDocument()
  })

  it('canvas starts with opacity 0 (fades in on ready)', () => {
    render(
      <ProductPreview
        photoUrl="photo.jpg"
        config={config}
        baseUrl="/mockups/canvas-8x10/base.webp"
        overlayUrl="/mockups/canvas-8x10/overlay.webp"
      />
    )
    const canvas = screen.getByTestId('product-preview-canvas') as HTMLCanvasElement
    expect(canvas.style.opacity).toBe('0')
  })
})
