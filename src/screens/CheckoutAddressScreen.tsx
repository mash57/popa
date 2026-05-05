import { useState } from 'react'
import { useAppState } from '../lib/appState'
import type { Address } from '../types'

const COUNTRIES = [
  { code: 'US', label: 'United States' },
  { code: 'GB', label: 'United Kingdom' },
  { code: 'DE', label: 'Germany' },
  { code: 'FR', label: 'France' },
  { code: 'JP', label: 'Japan' },
  { code: 'AU', label: 'Australia' },
  { code: 'CA', label: 'Canada' },
]

export function CheckoutAddressScreen() {
  const { state, dispatch } = useAppState()
  const existing = state.address

  const [form, setForm] = useState<Address>({
    name: existing?.name ?? '',
    line1: existing?.line1 ?? '',
    line2: existing?.line2 ?? '',
    city: existing?.city ?? '',
    postcode: existing?.postcode ?? '',
    country: existing?.country ?? 'US',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof Address, string>>>({})

  function set(key: keyof Address, value: string) {
    setForm(f => ({ ...f, [key]: value }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }))
  }

  function validate(): boolean {
    const required: (keyof Address)[] = ['name', 'line1', 'city', 'postcode', 'country']
    const next: typeof errors = {}
    for (const k of required) {
      if (!form[k].trim()) next[k] = 'Required'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleContinue() {
    if (!validate()) return
    dispatch({ type: 'SET_ADDRESS', address: form })
    dispatch({ type: 'NAVIGATE', screen: 'checkout-payment' })
  }

  return (
    <div className="flex flex-col h-full" style={{ background: '#080808' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4 flex-shrink-0">
        <button
          onClick={() => dispatch({ type: 'NAVIGATE', screen: 'checkout-review' })}
          className="bg-transparent border-none cursor-pointer p-0"
          style={{ color: 'rgba(255,255,255,0.55)' }}
          aria-label="Back"
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M7 1L1 7l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div>
          <p className="text-[11px] uppercase tracking-[1.5px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Step 2 of 3</p>
          <h1 className="text-[20px] font-light text-white tracking-[-0.5px]">Delivery address</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4" data-testid="address-form">
        <Field label="Full name" error={errors.name}>
          <input
            type="text"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="Jane Smith"
            autoComplete="name"
            data-testid="field-name"
            className="w-full bg-transparent text-white text-[15px] outline-none placeholder:text-white/25"
          />
        </Field>
        <Field label="Address line 1" error={errors.line1}>
          <input
            type="text"
            value={form.line1}
            onChange={e => set('line1', e.target.value)}
            placeholder="123 Main Street"
            autoComplete="address-line1"
            data-testid="field-line1"
            className="w-full bg-transparent text-white text-[15px] outline-none placeholder:text-white/25"
          />
        </Field>
        <Field label="Address line 2 (optional)">
          <input
            type="text"
            value={form.line2}
            onChange={e => set('line2', e.target.value)}
            placeholder="Apt, suite, floor…"
            autoComplete="address-line2"
            data-testid="field-line2"
            className="w-full bg-transparent text-white text-[15px] outline-none placeholder:text-white/25"
          />
        </Field>
        <div className="flex gap-3">
          <div className="flex-1">
            <Field label="City" error={errors.city}>
              <input
                type="text"
                value={form.city}
                onChange={e => set('city', e.target.value)}
                placeholder="New York"
                autoComplete="address-level2"
                data-testid="field-city"
                className="w-full bg-transparent text-white text-[15px] outline-none placeholder:text-white/25"
              />
            </Field>
          </div>
          <div className="flex-1">
            <Field label="Postcode / ZIP" error={errors.postcode}>
              <input
                type="text"
                value={form.postcode}
                onChange={e => set('postcode', e.target.value)}
                placeholder="10001"
                autoComplete="postal-code"
                data-testid="field-postcode"
                className="w-full bg-transparent text-white text-[15px] outline-none placeholder:text-white/25"
              />
            </Field>
          </div>
        </div>
        <Field label="Country" error={errors.country}>
          <select
            value={form.country}
            onChange={e => set('country', e.target.value)}
            data-testid="field-country"
            className="w-full bg-transparent text-white text-[15px] outline-none appearance-none cursor-pointer"
          >
            {COUNTRIES.map(c => (
              <option key={c.code} value={c.code} style={{ background: '#1C1C1E' }}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {/* CTA */}
      <div className="px-5 pb-6 pt-3 flex-shrink-0">
        <button
          onClick={handleContinue}
          className="w-full py-[14px] rounded-[26px] text-[15px] font-medium cursor-pointer"
          style={{ background: '#FFFFFF', color: '#000', border: 'none' }}
          data-testid="continue-to-payment"
        >
          Continue to payment →
        </button>
      </div>
    </div>
  )
}

function Field({
  label, error, children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div
      className="mb-1 px-0 py-3"
      style={{ borderBottom: `0.5px solid ${error ? 'rgba(255,80,80,0.6)' : 'rgba(255,255,255,0.1)'}` }}
    >
      <label className="block text-[10px] uppercase tracking-[1px] mb-1.5"
        style={{ color: error ? 'rgba(255,100,100,0.8)' : 'rgba(255,255,255,0.35)' }}>
        {error ?? label}
      </label>
      {children}
    </div>
  )
}
