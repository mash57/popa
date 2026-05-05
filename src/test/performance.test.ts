import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getResolutionRating } from '../lib/resolution'
import type { Product, Photo } from '../types'

const product: Product = {
  id: 'canvas-8x10', label: 'Canvas Wrap', category: 'canvas',
  mockupPath: '/mockups/canvas-8x10', printSizeMM: { w: 203, h: 254 },
  minResolutionPx: { w: 2400, h: 3000 }, priceFrom: 29, currency: 'USD', shipsIn: 7,
}

/**
 * Canonical Aha test: resolution check must complete in < 3000ms.
 * Real E2E timing requires a browser — this validates the synchronous
 * computation is sub-millisecond so it cannot be the bottleneck.
 */
describe('Performance: Aha Moment', () => {
  it('resolution check completes in < 1ms (never the bottleneck)', () => {
    const photo: Photo = { id: '1', thumbnailUrl: '', fullResUrl: '', width: 3000, height: 4000 }
    const start = performance.now()
    for (let i = 0; i < 1000; i++) {
      getResolutionRating(photo, product)
    }
    const elapsed = performance.now() - start
    // 1000 checks in < 10ms = well under 0.01ms each
    expect(elapsed).toBeLessThan(10)
  })

  it('resolution check never blocks event loop (sync, < 1ms per call)', () => {
    const photo: Photo = { id: '1', thumbnailUrl: '', fullResUrl: '', width: 800, height: 600 }
    const start = performance.now()
    const result = getResolutionRating(photo, product)
    const elapsed = performance.now() - start
    expect(result).toBe('red')
    expect(elapsed).toBeLessThan(1)
  })
})

describe('Performance: products.json loading', () => {
  it('mock fetch resolves correctly', async () => {
    const mockProducts = [{ id: 'canvas-8x10', label: 'Canvas Wrap' }]
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockProducts),
    } as Response)

    const { loadProducts } = await import('../lib/products')
    // Reset cache by reimporting
    const start = performance.now()
    const products = await loadProducts()
    const elapsed = performance.now() - start

    expect(products.length).toBeGreaterThan(0)
    expect(elapsed).toBeLessThan(100) // parsing should be instant
  })
})
