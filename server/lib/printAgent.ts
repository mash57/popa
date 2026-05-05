import { db } from './db.js'

// Print Expert Agent
// Runs on every confirmed order (payment_intent.succeeded).
// Validates → generates press-ready metadata → submits to Printo API.

export interface PrintJob {
  orderId: string
  productId: string
  photoUrl: string
  printSizeMM: { w: number; h: number }
  quantity: number
}

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

interface PrintFileSpec {
  format: 'PDF/X-4'
  colourProfile: 'CMYK ISO Coated v2 300% (ECI)'
  resolutionDPI: number
  bleedMM: number
  safeZoneMM: number
  marks: string[]
  jdfVersion: '1.4'
}

const PRINT_SPEC: PrintFileSpec = {
  format: 'PDF/X-4',
  colourProfile: 'CMYK ISO Coated v2 300% (ECI)',
  resolutionDPI: 300,
  bleedMM: 3,
  safeZoneMM: 5,
  marks: ['cut', 'registration', 'colour-bars'],
  jdfVersion: '1.4',
}

export function validatePrintJob(job: PrintJob, photoWidthPx: number, photoHeightPx: number): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  const requiredW = (job.printSizeMM.w / 25.4) * PRINT_SPEC.resolutionDPI
  const requiredH = (job.printSizeMM.h / 25.4) * PRINT_SPEC.resolutionDPI

  const scaleW = photoWidthPx / requiredW
  const scaleH = photoHeightPx / requiredH
  const scale = Math.min(scaleW, scaleH)

  if (scale < 1.0) {
    errors.push(
      `Resolution too low: ${photoWidthPx}×${photoHeightPx}px — ` +
      `minimum ${Math.ceil(requiredW)}×${Math.ceil(requiredH)}px required at 300 DPI`
    )
  } else if (scale < 1.25) {
    warnings.push(`Resolution acceptable but below optimal (${Math.round(scale * 100)}% of 1.25× target)`)
  }

  if (!job.photoUrl) errors.push('Photo URL is required')
  if (!job.productId) errors.push('Product ID is required')

  return { valid: errors.length === 0, errors, warnings }
}

export function generateJdf(job: PrintJob): Record<string, unknown> {
  return {
    JDF: {
      version: PRINT_SPEC.jdfVersion,
      Type: 'Product',
      ID: `popa-${job.orderId}`,
      Status: 'Waiting',
      ResourcePool: {
        RunList: {
          ExternalImpositionTemplate: {
            URL: job.photoUrl,
          },
        },
        Media: {
          MediaType: 'Paper',
          Dimension: `${job.printSizeMM.w * 2.8346} ${job.printSizeMM.h * 2.8346}`, // mm to pt
        },
      },
      ResourceLinkPool: {
        RunListLink: { Usage: 'Input', rRef: 'RunList' },
        MediaLink: { Usage: 'Input', rRef: 'Media' },
      },
      AuditPool: {
        Created: {
          AgentName: 'popa-print-agent',
          TimeStamp: new Date().toISOString(),
        },
      },
    },
  }
}

export async function processPrintJob(job: PrintJob, photoWidthPx: number, photoHeightPx: number): Promise<{
  success: boolean
  validation: ValidationResult
  jdf?: Record<string, unknown>
  printoOrderId?: string
}> {
  // 1. Validate
  const validation = validatePrintJob(job, photoWidthPx, photoHeightPx)
  if (!validation.valid) {
    db.orders.updateStatus(job.orderId, 'art_processing_failed')
    return { success: false, validation }
  }

  // 2. Update status → art_processing
  db.orders.updateStatus(job.orderId, 'art_processing')

  // 3. Generate JDF
  const jdf = generateJdf(job)

  // 4. Update status → pre_press
  db.orders.updateStatus(job.orderId, 'pre_press')

  // 5. Submit to Printo API (stubbed — real endpoint TBD with Printo engineering)
  const printoOrderId = await submitToProduction(job, jdf)

  // 6. Update status → sent_to_print
  db.orders.updateStatus(job.orderId, 'sent_to_print')

  return { success: true, validation, jdf, printoOrderId }
}

async function submitToProduction(job: PrintJob, jdf: Record<string, unknown>): Promise<string> {
  const endpoint = process.env.PRINTO_API_URL
  if (!endpoint) {
    // Stub: return a fake Printo order ID when API is not configured
    return `PRINTO-${Date.now()}`
  }
  const res = await fetch(`${endpoint}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.PRINTO_API_KEY ?? ''}`,
    },
    body: JSON.stringify({ job, jdf }),
  })
  const data = await res.json() as { orderId: string }
  return data.orderId
}
