import { useAppState } from './lib/appState'
import { HomeScreen } from './screens/HomeScreen'
import { GalleryScreen } from './screens/GalleryScreen'
import { AhaScreen } from './screens/AhaScreen'
import { EditorScreen } from './screens/EditorScreen'
import { BundleScreen } from './screens/BundleScreen'
import { CheckoutReviewScreen } from './screens/CheckoutReviewScreen'
import { CheckoutAddressScreen } from './screens/CheckoutAddressScreen'
import { CheckoutPaymentScreen } from './screens/CheckoutPaymentScreen'
import { ConfirmationScreen } from './screens/ConfirmationScreen'
import { AnimatePresence, motion } from 'framer-motion'
import { useIsDesktop } from './hooks/useIsDesktop'

const slideVariants = {
  enter: { x: '100%', opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: '-30%', opacity: 0 },
}

const transition = { duration: 0.38, ease: [0.32, 0.72, 0, 1] as [number,number,number,number] }

function PhoneApp() {
  const { state } = useAppState()
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: '#080808' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={state.screen}
          className="absolute inset-0"
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={transition}
        >
          {state.screen === 'home' && <HomeScreen />}
          {state.screen === 'gallery' && <GalleryScreen />}
          {state.screen === 'aha' && <AhaScreen />}
          {state.screen === 'editor' && <EditorScreen />}
          {state.screen === 'bundle' && <BundleScreen />}
          {state.screen === 'checkout-review' && <CheckoutReviewScreen />}
          {state.screen === 'checkout-address' && <CheckoutAddressScreen />}
          {state.screen === 'checkout-payment' && <CheckoutPaymentScreen />}
          {state.screen === 'confirmation' && <ConfirmationScreen />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export function App() {
  const isDesktop = useIsDesktop()

  if (isDesktop) {
    return (
      <div
        className="min-h-screen flex items-center justify-center gap-16 px-16"
        style={{ background: '#0a0a0a' }}
      >
        {/* Left — branding */}
        <div className="flex-1 max-w-sm hidden lg:block">
          <p className="text-[11px] tracking-[5px] lowercase mb-6" style={{ color: 'rgba(255,255,255,0.25)' }}>
            p · o · p · a
          </p>
          <h1 className="text-[40px] font-light text-white leading-[1.1] tracking-[-1.5px] mb-5">
            Your photo papa.<br />
            <span style={{ background: 'linear-gradient(90deg,#FF9A3C,#C05FFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Making memories tangible.
            </span>
          </h1>
          <p className="text-[15px] leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Turn your phone photos into beautiful print products — canvas wraps, photo books, calendars, magnets and more. Ships worldwide from India.
          </p>
          <div className="flex flex-col gap-3">
            {[
              { icon: '⚡', text: 'Preview renders in under 3 seconds' },
              { icon: '🌍', text: 'Ships internationally from India' },
              { icon: '🔒', text: 'Photos never leave your device until you order' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <span className="text-[18px]">{icon}</span>
                <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Centre — phone frame */}
        <div className="relative flex-shrink-0" style={{ width: 390 }}>
          {/* Phone outer shell */}
          <div
            className="relative rounded-[52px] p-[10px]"
            style={{
              background: 'linear-gradient(145deg, #2a2a2a, #141414)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 40px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.12)',
            }}
          >
            {/* Dynamic island */}
            <div
              className="absolute top-[18px] left-1/2 -translate-x-1/2 z-20 rounded-full"
              style={{ width: 120, height: 34, background: '#000' }}
            />
            {/* Screen bezel */}
            <div
              className="rounded-[44px] overflow-hidden"
              style={{ width: 370, height: 800 }}
            >
              <PhoneApp />
            </div>
            {/* Home indicator */}
            <div
              className="mx-auto mt-[10px] rounded-full"
              style={{ width: 128, height: 5, background: 'rgba(255,255,255,0.2)' }}
            />
          </div>

          {/* Side button (right) */}
          <div
            className="absolute rounded-full"
            style={{ right: -3, top: 160, width: 3, height: 72, background: '#222' }}
          />
          {/* Volume buttons (left) */}
          <div
            className="absolute rounded-full"
            style={{ left: -3, top: 140, width: 3, height: 36, background: '#222' }}
          />
          <div
            className="absolute rounded-full"
            style={{ left: -3, top: 188, width: 3, height: 64, background: '#222' }}
          />
          <div
            className="absolute rounded-full"
            style={{ left: -3, top: 264, width: 3, height: 64, background: '#222' }}
          />
        </div>

        {/* Right — product highlights (xl screens only) */}
        <div className="flex-1 max-w-sm hidden xl:block">
          <p className="text-[11px] tracking-[2px] uppercase mb-6" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Products
          </p>
          {[
            { name: 'Canvas Wrap', price: 'from $29', ships: '7 days' },
            { name: 'Wall Calendar', price: 'from $14', ships: '5 days' },
            { name: 'Photo Prints', price: 'from $4', ships: '4 days' },
            { name: 'Fridge Magnet', price: 'from $6', ships: '5 days' },
            { name: 'Notebook', price: 'from $18', ships: '5 days' },
          ].map(p => (
            <div
              key={p.name}
              className="flex items-center justify-between py-3"
              style={{ borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}
            >
              <span className="text-[14px] text-white font-light">{p.name}</span>
              <div className="text-right">
                <span className="text-[13px] block" style={{ color: 'rgba(255,255,255,0.5)' }}>{p.price}</span>
                <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.25)' }}>ships in {p.ships}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Mobile: full-screen, no frame
  return (
    <div
      className="mx-auto relative overflow-hidden"
      style={{ width: '100%', maxWidth: 390, height: '100dvh', background: '#080808' }}
    >
      <PhoneApp />
    </div>
  )
}
