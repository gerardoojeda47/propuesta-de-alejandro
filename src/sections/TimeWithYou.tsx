import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import StarField from '../components/StarField'
import BlueParticles from '../components/BlueParticles'
import AuroraBackground from '../components/AuroraBackground'
import { timeWithYouContent } from '../data/romanticContent'

/* ── Reloj en canvas ──────────────────────────────────────────── */
function ClockCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [phase, setPhase] = useState<'ticking' | 'slow' | 'constellation'>('ticking')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = 220; canvas.height = 220
    const cx = 110, cy = 110, R = 90
    const dpr = window.devicePixelRatio || 1
    canvas.width  = 220 * dpr; canvas.height = 220 * dpr
    canvas.style.width = '220px'; canvas.style.height = '220px'
    const ctx = canvas.getContext('2d')!
    ctx.scale(dpr, dpr)

    let speed = 1
    let raf = 0
    const ang = { h: 0, m: 0, s: 0 }
    let constellationMode = false

    const t1 = setTimeout(() => setPhase('slow'), 4000)
    const slowDown = setInterval(() => {
      speed = Math.max(speed - 0.025, 0.02)
      if (speed <= 0.02) clearInterval(slowDown)
    }, 150)
    const t2 = setTimeout(() => { constellationMode = true; setPhase('constellation') }, 11000)

    /* Puntos de la constelación (reloj → constelación) */
    const cPts = [
      { x: cx, y: cy - R * 0.82 },
      { x: cx + R * 0.58, y: cy - R * 0.28 },
      { x: cx + R * 0.88, y: cy + R * 0.38 },
      { x: cx + R * 0.28, y: cy + R * 0.88 },
      { x: cx - R * 0.28, y: cy + R * 0.88 },
      { x: cx - R * 0.88, y: cy + R * 0.38 },
      { x: cx - R * 0.58, y: cy - R * 0.28 },
    ]

    const draw = () => {
      ctx.clearRect(0, 0, 220, 220)

      if (constellationMode) {
        ctx.strokeStyle = 'rgba(49,133,255,.28)'; ctx.lineWidth = .8
        ctx.beginPath()
        cPts.forEach((p, i) => { if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y) })
        ctx.closePath(); ctx.stroke()
        cPts.forEach((p) => {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 7)
          g.addColorStop(0, 'rgba(255,255,255,.9)'); g.addColorStop(0.5, 'rgba(114,199,255,.5)'); g.addColorStop(1, 'rgba(49,133,255,0)')
          ctx.beginPath(); ctx.arc(p.x, p.y, 7, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill()
          ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fillStyle = 'white'; ctx.fill()
        })
        raf = requestAnimationFrame(draw); return
      }

      /* Anillo */
      const ringG = ctx.createRadialGradient(cx, cy, R - 3, cx, cy, R + 3)
      ringG.addColorStop(0, 'rgba(49,133,255,.55)'); ringG.addColorStop(1, 'rgba(49,133,255,.08)')
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.strokeStyle = ringG; ctx.lineWidth = 2; ctx.stroke()

      /* Marcas */
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2
        ctx.beginPath()
        ctx.moveTo(cx + Math.cos(a) * (R - 9), cy + Math.sin(a) * (R - 9))
        ctx.lineTo(cx + Math.cos(a) * (R - 2), cy + Math.sin(a) * (R - 2))
        ctx.strokeStyle = 'rgba(114,199,255,.45)'; ctx.lineWidth = i % 3 === 0 ? 2 : 1; ctx.stroke()
      }

      /* Avanzar ángulos */
      ang.s += 0.022 * speed; ang.m += 0.022 * speed / 60; ang.h += 0.022 * speed / 720

      const hand = (a: number, len: number, w: number, col: string) => {
        const angle = a - Math.PI / 2
        ctx.beginPath(); ctx.moveTo(cx, cy)
        ctx.lineTo(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len)
        ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.stroke()
      }
      hand(ang.h, R * 0.5, 3, 'rgba(197,231,255,.88)')
      hand(ang.m, R * 0.7, 2, 'rgba(114,199,255,.9)')
      hand(ang.s, R * 0.82, 1, '#3185FF')

      /* Centro */
      ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2)
      ctx.fillStyle = '#3185FF'; ctx.shadowBlur = 12; ctx.shadowColor = '#3185FF'; ctx.fill(); ctx.shadowBlur = 0

      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); clearTimeout(t1); clearTimeout(t2); clearInterval(slowDown) }
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.6rem' }}>
      <canvas ref={canvasRef} style={{ width: '220px', height: '220px' }} />
      <motion.p
        className="ff-script"
        style={{ fontSize: '1rem', color: 'rgba(114,199,255,.55)' }}
        initial={{ opacity: 0 }} animate={{ opacity: phase !== 'ticking' ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        {phase === 'slow' ? '...el tiempo se detiene' : phase === 'constellation' ? '...y se convierte en algo más' : ''}
      </motion.p>
    </div>
  )
}

/* ── Sección ──────────────────────────────────────────────────── */
export default function TimeWithYou() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-12%' })

  return (
    <section className="section-base" style={{ background: 'linear-gradient(180deg,rgba(3,5,11,0.72) 0%,#07111F 40%,#0B1F3A 70%,#07111F 100%)', minHeight: '100vh', padding: '6rem 1.5rem' }}>
      <StarField count={140} twinkleMode="slow" />
      <BlueParticles count={28} />
      <AuroraBackground intensity={0.6} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '680px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem', textAlign: 'center' }}>

        {/* Reloj */}
        <motion.div initial={{ opacity: 0, scale: .85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.1 }}>
          <ClockCanvas />
        </motion.div>

        {/* Título */}
        <motion.h2
          className="font-cormorant text-gradient"
          style={{ fontSize: 'clamp(1.5rem,4.5vw,2.6rem)', fontWeight: 300, lineHeight: 1.25 }}
          initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .9 }}
        >
          {timeWithYouContent.title}
        </motion.h2>

        {/* Párrafos */}
        <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', maxWidth: '540px' }}>
          {timeWithYouContent.paragraphs.map((txt, i) => (
            <motion.p key={i}
              className="font-cormorant"
              style={{ fontSize: 'clamp(1.05rem,2.4vw,1.22rem)', lineHeight: 1.75, color: i === 1 || i === 6 ? '#72C7FF' : 'rgba(228,242,255,.88)', fontStyle: i === 1 || i === 6 ? 'italic' : 'normal' }}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: .75, delay: i * .14 }}
            >{txt}</motion.p>
          ))}
        </div>

        {/* Divisor */}
        <motion.div initial={{ opacity: 0, scaleX: 0 }} whileInView={{ opacity: 1, scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }}>
          <div className="divider-glow" style={{ width: '200px' }} />
        </motion.div>
      </div>
    </section>
  )
}
