import { motion } from 'framer-motion'

// Divisor luminoso entre secciones
export default function GlowDivider({ text }: { text?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <motion.div
        className="flex items-center gap-3 w-full max-w-xs"
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(49,133,255,0.6))' }} />
        <motion.div
          style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3185FF', boxShadow: '0 0 10px #3185FF, 0 0 20px rgba(49,133,255,0.5)' }}
          animate={{ scale: [1, 1.5, 1], boxShadow: ['0 0 8px #3185FF', '0 0 20px #72C7FF', '0 0 8px #3185FF'] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(49,133,255,0.6), transparent)' }} />
      </motion.div>
      {text && (
        <motion.p
          className="font-dancing text-sm"
          style={{ color: 'rgba(114,199,255,0.5)', letterSpacing: '0.1em' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}
