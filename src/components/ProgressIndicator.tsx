import { motion } from 'framer-motion'

const LABELS = [
  'El tiempo',
  'Lo que siento',
  'El poema',
  'Dos caminos',
  'Recuerdos',
  'La luna',
  'Una estrella',
  'La pregunta',
  'La carta',
]

interface ProgressIndicatorProps {
  current: number
  total: number
  onNavigate?: (i: number) => void
}

export default function ProgressIndicator({ current, total, onNavigate }: ProgressIndicatorProps) {
  return (
    <nav
      aria-label="Progreso de la historia"
      style={{
        position: 'fixed',
        right: '14px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'center',
      }}
    >
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === current
        const isPast   = i < current
        return (
          <motion.button
            key={i}
            aria-label={LABELS[i] ?? `Sección ${i + 1}`}
            onClick={() => onNavigate?.(i)}
            style={{
              position: 'relative',
              width:  isActive ? '10px' : '6px',
              height: isActive ? '10px' : '6px',
              borderRadius: '50%',
              background: isActive
                ? '#3185FF'
                : isPast
                ? 'rgba(49,133,255,.45)'
                : 'rgba(114,199,255,.18)',
              boxShadow: isActive ? '0 0 0 3px rgba(49,133,255,.2), 0 0 12px #3185FF' : 'none',
              border: 'none',
              padding: 0,
              cursor: onNavigate ? 'pointer' : 'default',
              transition: 'all .3s ease',
            }}
            whileHover={{ scale: 1.4 }}
            animate={isActive ? { scale: [1, 1.2, 1] } : { scale: 1 }}
            transition={isActive ? { duration: 2.5, repeat: Infinity } : {}}
          >
            {/* Tooltip */}
            <span style={{
              position: 'absolute',
              right: '18px',
              top: '50%',
              transform: 'translateY(-50%)',
              whiteSpace: 'nowrap',
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '.72rem',
              letterSpacing: '.06em',
              color: isActive ? '#72C7FF' : 'rgba(114,199,255,.55)',
              pointerEvents: 'none',
              opacity: 0,
              transition: 'opacity .2s',
            }}
            className="tooltip-label"
            >
              {LABELS[i] ?? `${i + 1}`}
            </span>
          </motion.button>
        )
      })}

      <style>{`
        nav button:hover .tooltip-label { opacity: 1 !important; }
        @media (max-width: 480px) { nav { right: 6px; } }
      `}</style>
    </nav>
  )
}
