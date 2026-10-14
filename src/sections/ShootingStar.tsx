import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import StarField from '../components/StarField'
import { starInteractiveContent } from '../data/romanticContent'

interface Props { onStarTouched: () => void }

function StarCanvas({ touched, onTouch }: { touched: boolean; onTouch: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const W = 340, H = 340
    const dpr = window.devicePixelRatio || 1
    canvas.width  = W * dpr; canvas.height = H * dpr
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px'
    const ctx = canvas.getContext('2d')!
    ctx.scale(dpr, dpr)
    const cx = W / 2, cy = H / 2
    let raf = 0, t = 0

    type P = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number }
    const particles: P[] = []

    const onInput = (x: number, y: number) => {
      const dx = x - cx, dy = y - cy
      if (Math.sqrt(dx * dx + dy * dy) < 70) onTouch()
    }

    const onClick = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      onInput(e.clientX - r.left, e.clientY - r.top)
    }
    const onTap = (e: TouchEvent) => {
      // No llamar preventDefault aquí para no bloquear el scroll
      const r = canvas.getBoundingClientRect()
      const touch = e.changedTouches[0]
      onInput(touch.clientX - r.left, touch.clientY - r.top)
    }

    canvas.addEventListener('click', onClick)
    canvas.addEventListener('touchend', onTap)

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      t += 0.02

      const scale = touched ? 1 + Math.sin(t * 3) * 0.12 + 0.25 : 1

      /* Anillos orbitales */
      for (let ring = 1; ring <= 3; ring++) {
        const rr = (32 + ring * 22) * scale
        const al = (Math.sin(t * 2 - ring * .8) * .28 + .22) * (touched ? 1.4 : 1)
        ctx.beginPath(); ctx.arc(cx, cy, rr, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(49,133,255,${Math.min(al, .5).toFixed(3)})`; ctx.lineWidth = touched ? 1.5 : 1; ctx.stroke()
      }

      /* Estrella central */
      const sr = 24 * scale
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, sr * 3.5)
      glow.addColorStop(0, `rgba(255,255,255,${touched ? .95 : .88})`)
      glow.addColorStop(.3, `rgba(114,199,255,${touched ? .75 : .5})`)
      glow.addColorStop(.65, `rgba(49,133,255,${touched ? .3 : .18})`)
      glow.addColorStop(1, 'rgba(49,133,255,0)')
      ctx.beginPath(); ctx.arc(cx, cy, sr * 3.5, 0, Math.PI * 2); ctx.fillStyle = glow; ctx.fill()
      ctx.beginPath(); ctx.arc(cx, cy, sr, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,255,255,${touched ? .95 : .88})`
      ctx.shadowBlur = touched ? 50 : 24; ctx.shadowColor = '#72C7FF'; ctx.fill(); ctx.shadowBlur = 0

      /* Rayos */
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + t * .3
        const len = (touched ? 55 : 36) * scale
        ctx.beginPath()
        ctx.moveTo(cx + Math.cos(a) * sr, cy + Math.sin(a) * sr)
        ctx.lineTo(cx + Math.cos(a) * len, cy + Math.sin(a) * len)
        ctx.strokeStyle = `rgba(114,199,255,${touched ? .55 : .32})`; ctx.lineWidth = touched ? 2 : 1; ctx.stroke()
      }

      /* Partículas si tocado */
      if (touched) {
        if (Math.random() < .35) {
          const a = Math.random() * Math.PI * 2
          const sp = Math.random() * 3 + 1
          particles.push({ x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0, maxLife: Math.random() * 55 + 28, size: Math.random() * 3 + 1 })
        }
        for (let j = particles.length - 1; j >= 0; j--) {
          const p = particles[j]
          p.x += p.vx; p.y += p.vy; p.vy += .03; p.life++
          const al = (1 - p.life / p.maxLife) * .8
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(114,199,255,${al.toFixed(3)})`; ctx.fill()
          if (p.life >= p.maxLife) particles.splice(j, 1)
        }
      }

      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); canvas.removeEventListener('click', onClick); canvas.removeEventListener('touchend', onTap) }
  }, [touched, onTouch])

  return (
    <canvas ref={canvasRef}
      style={{ width: '340px', height: '340px', cursor: 'pointer', touchAction: 'auto' }}
    />
  )
}

export default function ShootingStarSection({ onStarTouched }: Props) {
  const [touched, setTouched] = useState(false)

  const handleTouch = () => {
    if (touched) return
    setTouched(true)
    setTimeout(onStarTouched, 2600)
  }

  return (
    <section style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at center,#07111F 0%,#03050B 70%)' }}>
      <StarField count={80} twinkleMode="slow" />

      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%,rgba(49,133,255,.05) 0%,transparent 60%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '4rem 1.5rem', gap: '2.5rem', maxWidth: '520px' }}>

        <motion.h2 className="font-cormorant" style={{ fontSize: 'clamp(1.5rem,4vw,2.4rem)', fontWeight: 300, color: '#F4F8FF', lineHeight: 1.3 }}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
        >
          {starInteractiveContent.title}
        </motion.h2>

        <motion.div initial={{ opacity: 0, scale: .8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: .3 }}>
          <StarCanvas touched={touched} onTouch={handleTouch} />
        </motion.div>

        <AnimatePresence mode="wait">
          {!touched ? (
            <motion.p key="hint" className="font-cormorant" style={{ fontSize: '1.1rem', fontStyle: 'italic', color: 'rgba(114,199,255,.65)' }}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .8 }}
            >
              {starInteractiveContent.instruction}
            </motion.p>
          ) : (
            <motion.p key="response" className="ff-script" style={{ fontSize: '1.3rem', color: '#72C7FF' }}
              initial={{ opacity: 0, scale: .85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: .8 }}
            >
              ✨ Hay algo que quiero preguntarte...
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
