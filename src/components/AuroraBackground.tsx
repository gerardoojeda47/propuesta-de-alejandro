import { motion } from 'framer-motion'

/** Aurora boreal azul — sutil, decorativa, no interfiere con la lectura */
export default function AuroraBackground({ intensity = 1 }: { intensity?: number }) {
  const op = intensity
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      <motion.div
        style={{
          position: 'absolute', top: '5%', left: '-15%',
          width: '75%', height: '45%',
          background: `linear-gradient(135deg,rgba(18,58,112,0) 0%,rgba(49,133,255,${0.07*op}) 40%,rgba(114,199,255,${0.1*op}) 60%,rgba(18,58,112,0) 100%)`,
          borderRadius: '60%',
          filter: 'blur(45px)',
        }}
        animate={{ x: ['0%','28%','8%','38%','0%'], y: ['0%','8%','3%','-4%','0%'], scaleX: [1,1.18,0.92,1.08,1], opacity: [0.5*op,0.95*op,0.7*op,1*op,0.5*op] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        style={{
          position: 'absolute', top: '28%', right: '-18%',
          width: '65%', height: '38%',
          background: `linear-gradient(90deg,rgba(18,58,112,0) 0%,rgba(114,199,255,${0.06*op}) 50%,rgba(49,133,255,${0.09*op}) 70%,rgba(18,58,112,0) 100%)`,
          borderRadius: '55%',
          filter: 'blur(55px)',
        }}
        animate={{ x: ['0%','-22%','-9%','-30%','0%'], y: ['0%','-7%','10%','3%','0%'], scaleY: [1,1.12,0.88,1.15,1], opacity: [0.4*op,0.75*op,0.55*op,0.85*op,0.4*op] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />
      <motion.div
        style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '20%',
          background: `linear-gradient(180deg,rgba(49,133,255,${0.04*op}) 0%,transparent 100%)`,
          filter: 'blur(25px)',
        }}
        animate={{ opacity: [0.4*op,0.7*op,0.4*op] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
    </div>
  )
}
