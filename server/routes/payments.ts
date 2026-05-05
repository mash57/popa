import { Router, type Request, type Response } from 'express'
import { createPaymentIntent, constructWebhookEvent } from '../lib/stripe.js'
import { db } from '../lib/db.js'
import { processPrintJob } from '../lib/printAgent.js'

export const paymentsRouter = Router()

// POST /api/payments/intent
// Creates a Stripe PaymentIntent and reserves an order ID
paymentsRouter.post('/intent', async (req: Request, res: Response) => {
  try {
    const { amount, currency, productId, bundleProductId } = req.body as {
      amount: number
      currency: string
      productId: string
      bundleProductId?: string
    }

    const intent = await createPaymentIntent(amount, currency, {
      productId,
      ...(bundleProductId ? { bundleProductId } : {}),
    })

    const orderId = `popa-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

    res.json({ clientSecret: intent.client_secret, orderId })
  } catch (err) {
    console.error('[payments/intent]', err)
    res.status(500).json({ error: 'Failed to create payment intent' })
  }
})

// POST /api/payments/confirm
// Called after frontend confirms payment — saves the order
paymentsRouter.post('/confirm', async (req: Request, res: Response) => {
  try {
    const { orderId, clientSecret, address, payMethod } = req.body as {
      orderId: string
      clientSecret: string
      address: unknown
      payMethod: string
    }

    const stripePaymentIntentId = clientSecret?.split('_secret')[0]

    db.orders.create({
      id: orderId,
      status: 'payment_confirmed',
      items: [],
      address,
      subtotal: 0,
      shipping: 0,
      total: 0,
      currency: 'USD',
      delivery_est: '',
      stripe_pi_id: stripePaymentIntentId,
      created_at: new Date().toISOString(),
    })

    res.json({ success: true, orderId })
  } catch (err) {
    console.error('[payments/confirm]', err)
    res.status(500).json({ error: 'Failed to confirm order' })
  }
})

// POST /api/payments/webhook
// Stripe webhook — triggers print pipeline on payment_intent.succeeded
paymentsRouter.post(
  '/webhook',
  // Raw body needed for Stripe signature verification
  (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string
    let event

    try {
      event = constructWebhookEvent(req.body as Buffer, sig)
    } catch (err) {
      console.error('[webhook] signature verification failed', err)
      res.status(400).send('Webhook signature mismatch')
      return
    }

    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object
      const orderId = intent.metadata?.orderId
      const productId = intent.metadata?.productId

      if (orderId && productId) {
        // Trigger print agent asynchronously — don't block the webhook response
        setImmediate(() => {
          processPrintJob(
            {
              orderId,
              productId,
              photoUrl: intent.metadata?.photoUrl ?? '',
              printSizeMM: { w: 203, h: 254 }, // fetched from products.json in production
              quantity: 1,
            },
            3000, // photo dimensions from metadata in production
            4000
          ).catch(console.error)
        })
      }
    }

    res.json({ received: true })
  }
)
