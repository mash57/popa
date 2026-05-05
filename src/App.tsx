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

const slideVariants = {
  enter: { x: '100%', opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: '-30%', opacity: 0 },
}

const transition = { duration: 0.38, ease: [0.32, 0.72, 0, 1] as [number,number,number,number] }

export function App() {
  const { state } = useAppState()

  return (
    // Phone shell — 390px wide, full viewport height
    <div
      className="mx-auto relative overflow-hidden"
      style={{
        width: '100%',
        maxWidth: 390,
        height: '100dvh',
        background: '#080808',
      }}
    >
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
