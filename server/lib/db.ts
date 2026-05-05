// In-memory store for Phase 2. Replace with PostgreSQL in Phase 3.
// Schema is defined as TypeScript types — mirrors the SQL schema below.

/*
  SQL Schema (PostgreSQL):

  CREATE TABLE orders (
    id           TEXT PRIMARY KEY,
    status       TEXT NOT NULL DEFAULT 'pending',
    items        JSONB NOT NULL,
    bundle_item  JSONB,
    address      JSONB NOT NULL,
    subtotal     NUMERIC(10,2) NOT NULL,
    shipping     NUMERIC(10,2) NOT NULL,
    total        NUMERIC(10,2) NOT NULL,
    currency     TEXT NOT NULL DEFAULT 'USD',
    delivery_est TEXT NOT NULL,
    stripe_pi_id TEXT,
    tracking_url TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE INDEX idx_orders_status ON orders(status);
  CREATE INDEX idx_orders_stripe_pi ON orders(stripe_pi_id);
*/

export interface DBOrder {
  id: string
  status: string
  items: unknown[]
  bundle_item?: unknown
  address: unknown
  subtotal: number
  shipping: number
  total: number
  currency: string
  delivery_est: string
  stripe_pi_id?: string
  tracking_url?: string
  created_at: string
}

const store = new Map<string, DBOrder>()

export const db = {
  orders: {
    create(order: DBOrder): DBOrder {
      store.set(order.id, order)
      return order
    },
    findById(id: string): DBOrder | undefined {
      return store.get(id)
    },
    updateStatus(id: string, status: string): DBOrder | undefined {
      const order = store.get(id)
      if (!order) return undefined
      const updated = { ...order, status }
      store.set(id, updated)
      return updated
    },
    list(): DBOrder[] {
      return Array.from(store.values()).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    },
  },
}
