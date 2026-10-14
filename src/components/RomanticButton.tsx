import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface RomanticButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function RomanticButton({
  children, onClick,
  variant = 'primary',
  className = '',
  disabled = false,
  size = 'md',
}: RomanticButtonProps) {
  const pad = size === 'sm' ? '0.55rem 1.6rem' : size === 'lg' ? '1.1rem 3.2rem' : '0.78rem 2.4rem'
  const fz  = size === 'sm' ? '1rem' : size === 'lg' ? '1.35rem' : '1.12rem'

  const vars = {
    primary: {
      bg:     'linear-gradient(135deg,rgba(49,133,255,.32) 0%,rgba(18,58,112,.6) 100%)',
      border: 'rgba(49,133,255,.65)',
      color:  '#F4F8FF',
      shadow: '0 0 20px rgba(49,133,255,.25)',
      hoverShadow: '0 0 40px rgba(49,133,255,.65), 0 0 70px rgba(49,133,255,.2)',
    },
    secondary: {
      bg:     'linear-gradient(135deg,rgba(7,17,31,.85) 0%,rgba(11,31,58,.9) 100%)',
      border: 'rgba(114,199,255,.38)',
      color:  '#72C7FF',
      shadow: '0 0 12px rgba(114,199,255,.12)',
      hoverShadow: '0 0 28px rgba(114,199,255,.35)',
    },
    ghost: {
      bg:     'transparent',
      border: 'rgba(114,199,255,.28)',
      color:  '#C5E7FF',
      shadow: 'none',
      hoverShadow: '0 0 18px rgba(114,199,255,.22)',
    },
  }

  const v = vars[variant]

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: fz,
        letterSpacing: '.05em',
        padding: pad,
        borderRadius: '9999px',
        border: `1px solid ${v.border}`,
        background: v.bg,
        color: v.color,
        boxShadow: v.shadow,
        position: 'relative',
        overflow: 'hidden',
        opacity: disabled ? 0.45 : 1,
      }}
      whileHover={!disabled ? {
        y: -3,
        boxShadow: v.hoverShadow,
        scale: 1.04,
      } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
    >
      {/* Shimmer interior */}
      <motion.span
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg,transparent 0%,rgba(255,255,255,.08) 50%,transparent 100%)',
          backgroundSize: '200% 100%',
        }}
        animate={{ backgroundPosition: ['200% center', '-200% center'] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
      />
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </motion.button>
  )
}
