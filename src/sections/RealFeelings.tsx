import { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import StarField from '../components/StarField'
import BlueParticles from '../components/BlueParticles'
import { realFeelingsContent } from '../data/romanticContent'

// Convierte hex a rgba seguro
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

function AbstractHeart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 280
    canvas.height = 280
    const cx = 140
    const cy = 140

    const colors = ['#3185FF', '#72C7FF', '#C5E7FF', '#F4F8FF', '#123A70']

    interface Particle {
      angle: number
      baseR: number
      size: number
      opacity: number
      speed: number
      offset: number
      color: string
    }

    const particles: Particle[] = []

    // Partículas exterior del corazón
    for (let i = 0; i < 120; i++) {
      const t = (i / 120) * Math.PI * 2
      const hx = 16 * Math.pow(Math.sin(t), 3)
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
      const dist = Math.sqrt(hx * hx + hy * hy)
      const angle = Math.atan2(hy, hx)
      particles.push({
        angle,
        baseR: dist * 3.8,
        size: Math.random() * 2.5 + 0.8,
        opacity: Math.random() * 0.6 + 0.4,
        speed: Math.random() * 0.02 + 0.008,
        offset: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    // Partículas interior
    for (let i = 0; i < 40; i++) {
      const t = (i / 40) * Math.PI * 2
      const hx = 16 * Math.pow(Math.sin(t), 3) * 0.6
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 0.6
      const dist = Math.sqrt(hx * hx + hy * hy)
      const angle = Math.atan2(hy, hx)
      particles.push({
        angle,
        baseR: dist * 3.8,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.2,
        speed: Math.random() * 0.015 + 0.005,
        offset: Math.random() * Math.PI * 2,
        color: '#3185FF',
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, 280, 280)
      timeRef.current += 0.016

      const pulse = 1 + Math.sin(timeRef.current * 1.2) * 0.04 + Math.sin(timeRef.current * 2.4) * 0.015

      particles.forEach((p) => {
        const wobble = Math.sin(timeRef.current * p.speed * 10 + p.offset) * 3
        const currentR = (p.baseR + wobble) * pulse
        const px = cx + Math.cos(p.angle) * currentR
        const py = cy + Math.sin(p.angle) * currentR

        // Punto principal
        ctx.beginPath()
        ctx.arc(px, py, p.size, 0, Math.PI * 2)
        ctx.fillStyle = hexToRgba(p.color, p.opacity)
        ctx.fill()

        // Glow exterior
        const glowGrad = ctx.createRadialGradient(px, py, 0, px, py, p.size * 3)
        glowGrad.addColorStop(0, hexToRgba(p.color, p.opacity * 0.4))
        glowGrad.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.beginPath()
        ctx.arc(px, py, p.size * 3, 0, Math.PI * 2)
        ctx.fillStyle = glowGrad
        ctx.fill()
      })

      // Halo central
      const haloGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 50)
      haloGrad.addColorStop(0, `rgba(49,133,255,${(0.08 * pulse).toFixed(3)})`)
      haloGrad.addColorStop(1, 'rgba(49,133,255,0)')
      ctx.beginPath()
      ctx.arc(cx, cy, 50, 0, Math.PI * 2)
      ctx.fillStyle = haloGrad
      ctx.fill()

      animRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  return (
    <canvas ref={canvasRef} style={{ width: '280px', height: '280px' }} />
  )
}

export default function RealFeelings() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section
      className="section-base py-24"
      style={{
        background: 'linear-gradient(180deg, #07111F 0%, #0B1F3A 30%, #07111F 70%, #03050B 100%)',
        minHeight: '100vh',
      }}
    >
      <StarField count={120} />
      <BlueParticles count={50} interactive />

      <div
        className="nebula-bg"
        style={{
          width: '400px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(18,58,112,0.2) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 flex flex-col items-center text-center gap-12">

        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <AbstractHeart />
        </motion.div>

        <motion.h2
          className="font-cormorant font-light text-gradient"
          style={{ fontSize: 'clamp(1.6rem, 5vw, 2.8rem)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {realFeelingsContent.title}
        </motion.h2>

        <div ref={ref} className="space-y-4 max-w-xl">
          {realFeelingsContent.paragraphs.map((text, i) => {
            const highlight = [1, 2, 3, 9].includes(i)
            return (
              <motion.p
                key={i}
                className="font-cormorant text-xl leading-relaxed"
                style={{
                  color: highlight ? '#72C7FF' : 'rgba(228,242,255,0.88)',
                  fontStyle: highlight ? 'italic' : 'normal',
                }}
                initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0)' } : {}}
                transition={{ duration: 0.8, delay: i * 0.12 }}
              >
                {text}
              </motion.p>
            )
          })}
        </div>

        <motion.div
          className="flex gap-3 opacity-60"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1 }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="rounded-full bg-blue-400"
              style={{ width: '4px', height: '4px' }}
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
