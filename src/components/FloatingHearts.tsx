import { motion } from 'framer-motion'

// Corazones flotantes sutiles — pequeños, elegantes, no infantiles
export default function FloatingHearts({ count = 8 }: { count?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {Array.from({ length: count }).map((_, i) => {
        const left = 5 + (i * 13) % 90
        const delay = i * 1.1
        const dur = 8 + (i % 4) * 2
        const size = 8 + (i % 3) * 4
        const opacity = 0.12 + (i % 3) * 0.06
        return (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              bottom: '-20px',
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              color: `rgba(49,133,255,${opacity})`,
              fontSize: `${size}px`,
              lineHeight: 1,
            }}
            animate={{
              y: [0, -(window.innerHeight + 60)],
              x: [0, Math.sin(i) * 40, Math.cos(i) * -30, 0],
              rotate: [0, 15, -10, 5, 0],
              opacity: [0, opacity, opacity, 0],
            }}
            transition={{
              duration: dur,
              delay,
              repeat: Infinity,
              repeatDelay: delay + 2,
              ease: 'easeInOut',
            }}
          >
            💙
          </motion.div>
        )
      })}
    </div>
  )
}
