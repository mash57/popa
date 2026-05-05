import { Router, type Request, type Response } from 'express'
import { db } from '../lib/db.js'

export const ordersRouter = Router()

// GET /api/orders — operator dashboard list
ordersRouter.get('/', (_req: Request, res: Response) => {
  res.json(db.orders.list())
})

// GET /api/orders/:id
ordersRouter.get('/:id', (req: Request, res: Response) => {
  const order = db.orders.findById(req.params.id)
  if (!order) { res.status(404).json({ error: 'Order not found' }); return }
  res.json(order)
})

// PATCH /api/orders/:id/status — operator manual override
ordersRouter.patch('/:id/status', (req: Request, res: Response) => {
  const { status } = req.body as { status: string }
  const valid = ['pending','payment_confirmed','art_processing','pre_press','sent_to_print','shipped','delivered','art_processing_failed']
  if (!valid.includes(status)) {
    res.status(400).json({ error: `Invalid status. Must be one of: ${valid.join(', ')}` })
    return
  }
  const updated = db.orders.updateStatus(req.params.id, status)
  if (!updated) { res.status(404).json({ error: 'Order not found' }); return }
  res.json(updated)
})
