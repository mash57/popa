import Stripe from 'stripe'

const key = process.env.STRIPE_SECRET_KEY ?? ''

// Instantiate lazily so tests can import without a real key
let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(key, { apiVersion: '2025-04-30.basil' })
  }
  return _stripe
}

export async function createPaymentIntent(
  amountCents: number,
  currency: string,
  metadata: Record<string, string> = {}
): Promise<Stripe.PaymentIntent> {
  return getStripe().paymentIntents.create({
    amount: amountCents,
    currency: currency.toLowerCase(),
    automatic_payment_methods: { enabled: true },
    metadata,
  })
}

export function constructWebhookEvent(
  payload: Buffer,
  signature: string
): Stripe.Event {
  const secret = process.env.STRIPE_WEBHOOK_SECRET ?? ''
  return getStripe().webhooks.constructEvent(payload, signature, secret)
}
