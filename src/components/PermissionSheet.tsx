import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  open: boolean
  onAllow: () => void
  onDeny: () => void
}

export function PermissionSheet({ open, onAllow, onDeny }: Props) {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && barRef.current) {
      // Start buffer animation after a short delay
      setTimeout(() => {
        if (barRef.current) barRef.current.style.width = '72%'
      }, 150)
    } else if (barRef.current) {
      barRef.current.style.width = '0%'
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-50 flex items-end"
          style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.55)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-full px-5 pb-6 pt-[22px] rounded-t-[18px]"
            style={{ background: '#1C1C1E' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.42, ease: [0.32, 0.72, 0, 1] }}
          >
            {/* Drag handle */}
            <div className="w-9 h-1 rounded-full mx-auto mb-[18px]" style={{ background: 'rgba(255,255,255,0.15)' }} />

            {/* Icon */}
            <div
              className="w-[46px] h-[46px] rounded-[12px] flex items-center justify-center mb-[13px]"
              style={{ background: 'linear-gradient(135deg, #FF9A3C, #C05FFF)' }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="1" y="1" width="9" height="9" rx="2" fill="white" fillOpacity="0.9" />
                <rect x="12" y="1" width="9" height="9" rx="2" fill="white" fillOpacity="0.45" />
                <rect x="1" y="12" width="9" height="9" rx="2" fill="white" fillOpacity="0.45" />
                <rect x="12" y="12" width="9" height="9" rx="2" fill="white" fillOpacity="0.9" />
              </svg>
            </div>

            {/* Title */}
            <p className="text-[15px] font-semibold text-white mb-[5px] leading-[1.3]">
              "popa" would like to access your photos
            </p>

            {/* Body */}
            <p className="text-[12px] leading-[1.6] mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Browse products while your library loads silently in the background — no waiting around.
            </p>

            {/* Buffer bar */}
            <div className="flex items-center gap-[10px] mb-[18px]">
              <span className="text-[10px] tracking-[0.5px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Buffering photos
              </span>
              <div className="flex-1 h-[3px] rounded-[3px] overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div
                  ref={barRef}
                  className="h-full rounded-[3px]"
                  style={{
                    width: '0%',
                    background: 'linear-gradient(90deg, #FF9A3C, #C05FFF)',
                    transition: 'width 3s ease',
                  }}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={onDeny}
                className="flex-1 py-[11px] rounded-[12px] text-[13px] cursor-pointer"
                style={{ border: '0.5px solid rgba(255,255,255,0.12)', background: 'none', color: 'rgba(255,255,255,0.45)' }}
              >
                Don't allow
              </button>
              <button
                onClick={onAllow}
                className="flex-[2] py-[11px] rounded-[12px] text-[13px] font-medium cursor-pointer"
                style={{ border: 'none', background: '#fff', color: '#000', letterSpacing: '0.1px' }}
              >
                Allow Access
              </button>
            </div>

            {/* Footnote */}
            <p className="text-center mt-[10px] text-[9px] tracking-[0.4px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Your photos never leave your device until you order
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
