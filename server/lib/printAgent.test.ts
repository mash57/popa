import { describe, it, expect, beforeEach } from 'vitest'
import { validatePrintJob, generateJdf, type PrintJob } from './printAgent.js'
import { db } from './db.js'

const job: PrintJob = {
  orderId: 'popa-test-001',
  productId: 'canvas-8x10',
  photoUrl: 'https://example.com/photo.jpg',
  printSizeMM: { w: 203, h: 254 },
  quantity: 1,
}

describe('validatePrintJob', () => {
  it('passes with sufficient resolution', () => {
    // Required: 203/25.4*300 ≈ 2398 × 254/25.4*300 = 3000
    const result = validatePrintJob(job, 3000, 4000)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('fails when resolution is too low', () => {
    const result = validatePrintJob(job, 800, 600)
    expect(result.valid).toBe(false)
    expect(result.errors[0]).toMatch(/Resolution too low/)
  })

  it('warns when resolution is acceptable but below 1.25x', () => {
    const result = validatePrintJob(job, 2400, 3000)
    expect(result.valid).toBe(true)
    expect(result.warnings[0]).toMatch(/below optimal/)
  })

  it('fails when photo URL is missing', () => {
    const result = validatePrintJob({ ...job, photoUrl: '' }, 3000, 4000)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Photo URL is required')
  })

  it('fails when product ID is missing', () => {
    const result = validatePrintJob({ ...job, productId: '' }, 3000, 4000)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Product ID is required')
  })
})

describe('generateJdf', () => {
  it('generates JDF with correct version', () => {
    const jdf = generateJdf(job)
    expect(jdf.JDF).toBeDefined()
    expect((jdf.JDF as Record<string, unknown>).version).toBe('1.4')
  })

  it('includes order ID in JDF', () => {
    const jdf = generateJdf(job)
    expect((jdf.JDF as Record<string, unknown>).ID).toBe(`popa-${job.orderId}`)
  })

  it('includes photo URL in run list', () => {
    const jdf = generateJdf(job)
    const pool = (jdf.JDF as Record<string, unknown>).ResourcePool as Record<string, unknown>
    const runList = pool.RunList as Record<string, unknown>
    const template = runList.ExternalImpositionTemplate as Record<string, unknown>
    expect(template.URL).toBe(job.photoUrl)
  })
})

describe('db.orders', () => {
  beforeEach(() => {
    // Create a fresh order for each test
    db.orders.create({
      id: 'test-order-1',
      status: 'payment_confirmed',
      items: [],
      address: {},
      subtotal: 29,
      shipping: 8.99,
      total: 37.99,
      currency: 'USD',
      delivery_est: '25 May 2026',
      created_at: new Date().toISOString(),
    })
  })

  it('creates and retrieves an order', () => {
    const order = db.orders.findById('test-order-1')
    expect(order?.status).toBe('payment_confirmed')
  })

  it('updates order status', () => {
    db.orders.updateStatus('test-order-1', 'art_processing')
    const updated = db.orders.findById('test-order-1')
    expect(updated?.status).toBe('art_processing')
  })

  it('returns undefined for unknown order', () => {
    expect(db.orders.findById('nonexistent')).toBeUndefined()
  })

  it('lists orders', () => {
    const all = db.orders.list()
    expect(all.length).toBeGreaterThan(0)
  })
})
