import { describe, it, expect } from 'vitest'
import { getResolutionRating } from './resolution'
import type { Product, Photo } from '../types'

const product: Product = {
  id: 'canvas-8x10',
  label: 'Canvas Wrap',
  category: 'canvas',
  mockupPath: '/mockups/canvas-8x10',
  printSizeMM: { w: 203, h: 254 },
  minResolutionPx: { w: 2400, h: 3000 },
  priceFrom: 29,
  currency: 'USD',
  shipsIn: 7,
}

function makePhoto(w: number, h: number): Photo {
  return { id: '1', thumbnailUrl: '', fullResUrl: '', width: w, height: h }
}

describe('getResolutionRating', () => {
  it('returns green when photo resolution is 1.25x or more than required', () => {
    // required: ~2400×3000 (203/25.4*300 ≈ 2398, 254/25.4*300 = 3000)
    expect(getResolutionRating(makePhoto(3000, 3750), product)).toBe('green')
  })

  it('returns amber when photo resolution meets but does not exceed 1.25x', () => {
    expect(getResolutionRating(makePhoto(2400, 3000), product)).toBe('amber')
  })

  it('returns red when photo resolution is below required', () => {
    expect(getResolutionRating(makePhoto(800, 600), product)).toBe('red')
  })

  it('uses the minimum dimension as the constraint', () => {
    // Width is fine but height is too low
    expect(getResolutionRating(makePhoto(4000, 1000), product)).toBe('red')
  })
})
