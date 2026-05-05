import type { Product } from '../types'

let cachedProducts: Product[] | null = null

export async function loadProducts(): Promise<Product[]> {
  if (cachedProducts) return cachedProducts
  const res = await fetch('/mockups/products.json')
  cachedProducts = await res.json()
  return cachedProducts!
}
