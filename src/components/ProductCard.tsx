import { useState } from 'react'
import { productGradients, filmGrainSvg } from '../lib/tokens'
import type { Product } from '../types'

interface Props {
  product: Product
  offset: number // -1=left, 0=current, 1=right etc
}

export function ProductCard({ product, offset }: Props) {
  const gradient = productGradients[product.category] ?? productGradients.canvas
  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <div
      className="absolute inset-0 flex flex-col justify-end"
      style={{
        left: `${offset * 100}%`,
        transition: 'left 0.4s cubic-bezier(0.32,0.72,0,1)',
        willChange: 'left',
      }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0" style={{ background: gradient }} />

      {/* Film grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.035, backgroundImage: filmGrainSvg }}
      />

      {/* Product mockup image — centred hero */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ paddingBottom: 120, paddingTop: 24, paddingLeft: 32, paddingRight: 32 }}
      >
        <img
          src={`${product.mockupPath}/base.svg`}
          alt={product.label}
          onLoad={() => setImgLoaded(true)}
          className="max-w-full max-h-full object-contain transition-opacity duration-500 drop-shadow-2xl"
          style={{
            opacity: imgLoaded ? 1 : 0,
            filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.45))',
          }}
          data-testid={`product-mockup-${product.id}`}
        />
      </div>

      {/* Card info */}
      <div
        className="relative z-10 px-[22px] pb-4"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
          paddingTop: 60,
        }}
      >
        {product.badge && (
          <span
            className="inline-block text-[9px] tracking-[1.2px] uppercase mb-[7px] px-[9px] py-[3px] rounded-[20px]"
            style={{ background: 'rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.75)' }}
          >
            {product.badge}
          </span>
        )}
        <span className="block text-[26px] font-light tracking-[-0.8px] text-white leading-[1.1] mb-1">
          {product.label}
        </span>
        <div className="flex items-center justify-between">
          <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
            from ${product.priceFrom} &nbsp;·&nbsp; ships in {product.shipsIn} days
          </span>
        </div>
        <div
          className="flex items-center gap-1 mt-2 text-[9px] tracking-[1px] uppercase"
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 2v6M2 6l3 3 3-3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          pull for sizes
        </div>
      </div>
    </div>
  )
}
