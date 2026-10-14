import { motion, AnimatePresence } from 'framer-motion'

interface CinematicTransitionProps {
  isVisible: boolean
  onComplete?: () => void
}

export default function CinematicTransition({ isVisible, onComplete }: CinematicTransitionProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          onAnimationComplete={onComplete}
        >
          {/* Barras cinematográficas */}
          <motion.div
            className="absolute top-0 left-0 right-0 bg-black"
            initial={{ height: 0 }}
            animate={{ height: '8vh' }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-black"
            initial={{ height: 0 }}
            animate={{ height: '8vh' }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />

          {/* Vignette azul */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 30%, rgba(3,5,11,0.95) 100%)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />

          {/* Destello central */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 3] }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
            <div
              className="rounded-full"
              style={{
                width: '200px',
                height: '200px',
                background: 'radial-gradient(ellipse, rgba(49,133,255,0.6) 0%, transparent 70%)',
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
