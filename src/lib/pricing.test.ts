import { describe, it, expect } from 'vitest'
import { formatPrice, getShippingCost, estimateDeliveryDate, getBundleComplement, BUNDLE_DISCOUNT } from './pricing'
import type { Product } from '../types'

const canvas: Product = {
  id: 'canvas-8x10', label: 'Canvas Wrap', category: 'canvas',
  mockupPath: '/mockups/canvas-8x10', printSizeMM: { w: 203, h: 254 },
  minResolutionPx: { w: 2400, h: 3000 }, priceFrom: 29, currency: 'USD', shipsIn: 7,
}
const magnet: Product = {
  id: 'magnet-4x4', label: 'Fridge Magnet', category: 'magnet',
  mockupPath: '/mockups/magnet-4x4', printSizeMM: { w: 102, h: 102 },
  minResolutionPx: { w: 1200, h: 1200 }, priceFrom: 6, currency: 'USD', shipsIn: 5,
}
const notebook: Product = {
  id: 'notebook-a5', label: 'Notebook', category: 'stationery',
  mockupPath: '/mockups/notebook-a5', printSizeMM: { w: 148, h: 210 },
  minResolutionPx: { w: 1748, h: 2480 }, priceFrom: 18, currency: 'USD', shipsIn: 5,
}

describe('formatPrice', () => {
  it('formats USD', () => expect(formatPrice(29, 'USD')).toBe('$29.00'))
  it('formats GBP', () => expect(formatPrice(19.99, 'GBP')).toBe('£19.99'))
  it('formats JPY without decimals', () => expect(formatPrice(1200, 'JPY')).toBe('¥1,200'))
  it('falls back to USD symbol for unknown currency', () => expect(formatPrice(10, 'XYZ')).toBe('$10.00'))
})

describe('getShippingCost', () => {
  it('returns USD shipping', () => expect(getShippingCost('USD')).toBe(8.99))
  it('returns GBP shipping', () => expect(getShippingCost('GBP')).toBe(6.99))
  it('falls back to USD for unknown', () => expect(getShippingCost('ZZZ')).toBe(8.99))
})

describe('estimateDeliveryDate', () => {
  it('returns a non-empty date string', () => {
    const result = estimateDeliveryDate(7)
    expect(result).toMatch(/\d{1,2} \w+ \d{4}/)
  })
})

describe('getBundleComplement', () => {
  it('suggests magnet as complement for canvas', () => {
    const result = getBundleComplement(canvas, [canvas, magnet, notebook])
    expect(result?.category).toBe('magnet')
  })

  it('does not suggest the same product', () => {
    const result = getBundleComplement(canvas, [canvas])
    expect(result).toBeNull()
  })

  it('bundle discount is 20%', () => {
    expect(BUNDLE_DISCOUNT).toBe(0.20)
  })
})
