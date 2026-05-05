import type { Product } from '../types'

export const SHIPPING_COSTS: Record<string, number> = {
  USD: 8.99,
  GBP: 6.99,
  EUR: 7.99,
  JPY: 1200,
}

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$', GBP: '£', EUR: '€', JPY: '¥',
}

export const BUNDLE_DISCOUNT = 0.20 // 20% off bundle item

export function formatPrice(amount: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? '$'
  if (currency === 'JPY') return `${symbol}${Math.round(amount).toLocaleString()}`
  return `${symbol}${amount.toFixed(2)}`
}

export function getShippingCost(currency: string): number {
  return SHIPPING_COSTS[currency] ?? SHIPPING_COSTS.USD
}

export function estimateDeliveryDate(shipsIn: number): string {
  const d = new Date()
  d.setDate(d.getDate() + shipsIn + 2) // +2 for international transit buffer
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function getBundleComplement(primary: Product, allProducts: Product[]): Product | null {
  const complementMap: Record<string, string[]> = {
    canvas: ['magnet', 'prints'],
    calendar: ['magnet'],
    magnet: ['canvas', 'prints'],
    prints: ['magnet', 'stationery'],
    stationery: ['prints'],
  }
  const candidates = complementMap[primary.category] ?? []
  return allProducts.find(p => candidates.includes(p.category) && p.id !== primary.id) ?? null
}
