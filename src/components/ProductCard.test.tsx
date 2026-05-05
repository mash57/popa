import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProductCard } from './ProductCard'
import type { Product } from '../types'

const product: Product = {
  id: 'canvas-8x10',
  label: 'Canvas Wrap',
  category: 'canvas',
  mockupPath: '/mockups/canvas-8x10',
  printSizeMM: { w: 203, h: 254 },
  minResolutionPx: { w: 2400, h: 3000 },
  badge: 'Best gift',
  priceFrom: 29,
  currency: 'USD',
  shipsIn: 7,
}

describe('ProductCard', () => {
  it('renders product label', () => {
    render(<ProductCard product={product} offset={0} />)
    expect(screen.getByText('Canvas Wrap')).toBeInTheDocument()
  })

  it('renders badge when present', () => {
    render(<ProductCard product={product} offset={0} />)
    expect(screen.getByText('Best gift')).toBeInTheDocument()
  })

  it('renders price and shipping info', () => {
    render(<ProductCard product={product} offset={0} />)
    expect(screen.getByText(/from \$29/)).toBeInTheDocument()
    expect(screen.getByText(/ships in 7 days/)).toBeInTheDocument()
  })

  it('does not render badge when absent', () => {
    const noBadge = { ...product, badge: undefined }
    render(<ProductCard product={noBadge} offset={0} />)
    expect(screen.queryByText('Best gift')).not.toBeInTheDocument()
  })
})
