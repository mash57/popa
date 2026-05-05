import { productGradients, filmGrainSvg } from '../lib/tokens'
import type { Product } from '../types'

interface Props {
  product: Product
  offset: number // -1=left, 0=current, 1=right etc
}

function PatternOverlay({ category }: { category: string }) {
  if (category === 'calendar') {
    return (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'repeating-linear-gradient(0deg,transparent,transparent 32px,rgba(255,255,255,0.06) 32px,rgba(255,255,255,0.06) 33px),' +
            'repeating-linear-gradient(90deg,transparent,transparent 32px,rgba(255,255,255,0.04) 32px,rgba(255,255,255,0.04) 33px)',
        }}
      />
    )
  }
  if (category === 'canvas') {
    return (
      <div
        className="absolute pointer-events-none"
        style={{
          top: 24, left: 24, right: 24, bottom: 80,
          border: '18px solid rgba(255,255,255,0.07)',
          borderRadius: 2,
        }}
      />
    )
  }
  if (category === 'stationery') {
    return (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          marginLeft: 28,
          borderLeft: '2px solid rgba(255,255,255,0.1)',
          background:
            'repeating-linear-gradient(0deg,transparent,transparent 22px,rgba(255,255,255,0.05) 22px,rgba(255,255,255,0.05) 23px)',
        }}
      />
    )
  }
  if (category === 'magnet') {
    return (
      <div
        className="absolute pointer-events-none"
        style={{
          top: '50%', left: '50%',
          transform: 'translate(-50%,-68%)',
          width: 80, height: 52,
          border: '12px solid rgba(255,255,255,0.1)',
          borderBottom: 'none',
          borderRadius: '40px 40px 0 0',
        }}
      />
    )
  }
  if (category === 'prints') {
    return (
      <div
        className="absolute pointer-events-none"
        style={{ top: 28, left: 28, right: 28, bottom: 90, border: '2px solid rgba(255,255,255,0.08)', borderRadius: 3 }}
      >
        <div style={{ position: 'absolute', top: 8, left: 8, right: 8, bottom: 8, border: '1px solid rgba(255,255,255,0.05)' }} />
      </div>
    )
  }
  return null
}

export function ProductCard({ product, offset }: Props) {
  const gradient = productGradients[product.category] ?? productGradients.canvas

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

      {/* Product pattern */}
      <PatternOverlay category={product.category} />

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
