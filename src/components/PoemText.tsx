import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

interface PoemTextProps {
  lines: string[]
  className?: string
  stagger?: number
  highlightWords?: string[]
}

export default function PoemText({
  lines,
  className = '',
  stagger = 0.12,
  highlightWords = ['Mónica', 'ti', 'tú', 'contigo', 'juntos'],
}: PoemTextProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })

  const highlightLine = (line: string) => {
    if (!line) return null
    const words = line.split(' ')
    return words.map((word, i) => {
      const clean = word.replace(/[.,!?;:]/g, '')
      const isHighlighted = highlightWords.includes(clean)
      return (
        <span
          key={i}
          className={isHighlighted ? 'glow-soft' : ''}
          style={
            isHighlighted
              ? { color: '#72C7FF', textShadow: '0 0 12px rgba(114,199,255,0.6)' }
              : undefined
          }
        >
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      )
    })
  }

  return (
    <div ref={ref} className={`space-y-2 ${className}`}>
      {lines.map((line, index) => (
        <motion.p
          key={index}
          className="font-cormorant text-xl leading-relaxed text-center"
          style={{ color: '#E8F4FF', minHeight: line === '' ? '0.75rem' : undefined }}
          initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0)' } : {}}
          transition={{
            duration: 0.7,
            delay: index * stagger,
            ease: 'easeOut',
          }}
        >
          {line === '' ? '\u00A0' : highlightLine(line)}
        </motion.p>
      ))}
    </div>
  )
}
