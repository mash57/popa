import express from 'express'
import cors from 'cors'
import { paymentsRouter } from './routes/payments.js'
import { ordersRouter } from './routes/orders.js'

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173' }))

// Raw body for Stripe webhook signature verification
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }))

// JSON body for all other routes
app.use(express.json())

app.use('/api/payments', paymentsRouter)
app.use('/api/orders', ordersRouter)

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }))

// Serve Apple Pay domain verification
app.use('/.well-known', express.static('.well-known'))

app.listen(PORT, () => {
  console.log(`popa server running on :${PORT}`)
})

export { app }
