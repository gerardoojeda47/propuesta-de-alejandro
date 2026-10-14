import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─────────────────────────────────────────────────────────────────
   LoveExplosion — canvas de partículas + frases románticas
   Se activa al responder "Sí" en la propuesta
───────────────────────────────────────────────────────────────── */

// Frases que flotan en pantalla
const PHRASES = [
  'Te amo 💙',
  'Eres mi gran amor',
  'Lo mejor que me ha pasado',
  'Mi favorita',
  'Contigo todo tiene sentido',
  'Eres increíble',
  'Quiero quererte siempre',
  'Mi mundo eres tú',
  'Gracias por existir',
  'Eres todo lo que soñé',
  'Te elijo a ti',
  'Mi corazón es tuyo',
  'Eres mi calma',
  'Brillas como ninguna',
  'Eres mi persona especial',
  'Hoy soy el más feliz',
  'Mónica 💙',
  'Para siempre',
  'Eres perfecta',
  'Mi universo entero',
]

// Emojis que llueven
const EMOJIS = ['💙','💙','💙','✨','⭐','💫','🌟','💎','💙','💙','🩵','💙','✨','💙']

interface Particle {
  x: number; y: number
  vx: number; vy: number
  size: number; color: string
  life: number; maxLife: number
  type: 'circle' | 'star' | 'heart' | 'confetti'
  rot: number; rotSpeed: number
  w: number; h: number
}

function useCanvasExplosion(active: boolean) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const resize = () => {
      canvas.width  = window.innerWidth  * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width  = window.innerWidth  + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    const COLORS = [
      '#3185FF','#72C7FF','#C5E7FF','#F4F8FF',
      '#4a9eff','#99d4ff','#ffffff','#b3e0ff',
      '#5ba3ff','#ddeeff','#1a6fd4','#8ec8f8',
    ]

    const particles: Particle[] = []
    let raf = 0

    const spawnBurst = (cx: number, cy: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const angle  = (i / count) * Math.PI * 2 + Math.random() * 0.4
        const speed  = Math.random() * 14 + 4
        const types: Particle['type'][] = ['circle','circle','star','confetti','heart']
        const type   = types[Math.floor(Math.random() * types.length)]
        const ml     = Math.random() * 120 + 80
        particles.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - Math.random() * 6,
          size: Math.random() * 8 + 3,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          life: 0, maxLife: ml,
          type,
          rot: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.2,
          w: Math.random() * 12 + 6,
          h: Math.random() * 6 + 3,
        })
      }
    }

    const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath()
      ctx.moveTo(x, y + size * 0.3)
      ctx.bezierCurveTo(x, y, x - size * 0.5, y, x - size * 0.5, y + size * 0.3)
      ctx.bezierCurveTo(x - size * 0.5, y + size * 0.65, x, y + size, x, y + size)
      ctx.bezierCurveTo(x, y + size, x + size * 0.5, y + size * 0.65, x + size * 0.5, y + size * 0.3)
      ctx.bezierCurveTo(x + size * 0.5, y, x, y, x, y + size * 0.3)
      ctx.closePath()
      ctx.fill()
    }

    const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number) => {
      ctx.beginPath()
      for (let i = 0; i < 5; i++) {
        const a1 = (i / 5) * Math.PI * 2 - Math.PI / 2
        const a2 = ((i + 0.5) / 5) * Math.PI * 2 - Math.PI / 2
        if (i === 0) ctx.moveTo(x + Math.cos(a1) * r, y + Math.sin(a1) * r)
        else         ctx.lineTo(x + Math.cos(a1) * r, y + Math.sin(a1) * r)
        ctx.lineTo(x + Math.cos(a2) * r * 0.45, y + Math.sin(a2) * r * 0.45)
      }
      ctx.closePath(); ctx.fill()
    }

    // Primera explosión grande desde el centro
    spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 120)

    // Explosiones secundarias con delay
    const timers = [
      setTimeout(() => spawnBurst(window.innerWidth * 0.2, window.innerHeight * 0.3, 60), 400),
      setTimeout(() => spawnBurst(window.innerWidth * 0.8, window.innerHeight * 0.3, 60), 600),
      setTimeout(() => spawnBurst(window.innerWidth * 0.5, window.innerHeight * 0.7, 60), 800),
      setTimeout(() => spawnBurst(window.innerWidth * 0.15, window.innerHeight * 0.6, 40), 1100),
      setTimeout(() => spawnBurst(window.innerWidth * 0.85, window.innerHeight * 0.6, 40), 1300),
      // Oleada continua
      setTimeout(() => {
        const interval = setInterval(() => {
          const rx = Math.random() * window.innerWidth
          const ry = Math.random() * window.innerHeight * 0.6
          spawnBurst(rx, ry, 25)
        }, 600)
        timers.push(interval as unknown as ReturnType<typeof setTimeout>)
      }, 2000),
    ]

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life++
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.25          // gravedad
        p.vx *= 0.99          // fricción
        p.rot += p.rotSpeed

        if (p.life > p.maxLife) { particles.splice(i, 1); continue }

        const lr  = p.life / p.maxLife
        const al  = lr < 0.15 ? lr / 0.15 : lr > 0.75 ? 1 - (lr - 0.75) / 0.25 : 1
        ctx.globalAlpha = al

        ctx.fillStyle = p.color
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)

        if (p.type === 'circle') {
          ctx.beginPath(); ctx.arc(0, 0, p.size, 0, Math.PI * 2); ctx.fill()
        } else if (p.type === 'star') {
          drawStar(ctx, 0, 0, p.size)
        } else if (p.type === 'heart') {
          ctx.save(); ctx.scale(0.6, 0.6)
          drawHeart(ctx, -p.size * 0.5, -p.size * 0.6, p.size)
          ctx.restore()
        } else { // confetti
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        }
        ctx.restore()
        ctx.globalAlpha = 1
      }

      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      timers.forEach(clearTimeout)
      window.removeEventListener('resize', resize)
    }
  }, [active])

  return canvasRef
}

/* ─── Frases flotantes ────────────────────────────────────────── */
interface FloatingPhrase {
  id: number; text: string; x: number; delay: number; dur: number; size: number
}

function usePhrases(active: boolean) {
  const [phrases, setPhrases] = useState<FloatingPhrase[]>([])

  useEffect(() => {
    if (!active) return
    let id = 0
    const spawn = () => {
      const items: FloatingPhrase[] = Array.from({ length: 6 }, () => ({
        id:    id++,
        text:  PHRASES[Math.floor(Math.random() * PHRASES.length)],
        x:     5 + Math.random() * 85,
        delay: Math.random() * 0.8,
        dur:   4 + Math.random() * 3,
        size:  0.85 + Math.random() * 0.55,
      }))
      setPhrases((prev) => [...prev.slice(-30), ...items])
    }
    spawn()
    const iv = setInterval(spawn, 1800)
    return () => clearInterval(iv)
  }, [active])

  return phrases
}

/* ─── Emojis lluvia ───────────────────────────────────────────── */
interface FallingEmoji {
  id: number; emoji: string; x: number; delay: number; dur: number; size: number
}

function useEmojis(active: boolean) {
  const [emojis, setEmojis] = useState<FallingEmoji[]>([])

  useEffect(() => {
    if (!active) return
    let id = 0
    const spawn = () => {
      const items: FallingEmoji[] = Array.from({ length: 8 }, () => ({
        id:    id++,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        x:     2 + Math.random() * 94,
        delay: Math.random() * 1.2,
        dur:   3.5 + Math.random() * 2.5,
        size:  1.2 + Math.random() * 1.8,
      }))
      setEmojis((prev) => [...prev.slice(-40), ...items])
    }
    spawn()
    const iv = setInterval(spawn, 900)
    return () => clearInterval(iv)
  }, [active])

  return emojis
}

/* ─── Componente principal ────────────────────────────────────── */
export default function LoveExplosion({ active }: { active: boolean }) {
  const canvasRef = useCanvasExplosion(active)
  const phrases   = usePhrases(active)
  const emojis    = useEmojis(active)

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="love-explosion"
          style={{ position: 'fixed', inset: 0, zIndex: 100, pointerEvents: 'none', overflow: 'hidden' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Canvas de partículas */}
          <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />

          {/* Flash inicial */}
          <motion.div
            style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(49,133,255,0.35) 0%, transparent 70%)' }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 2, 3] }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />

          {/* Emojis que caen */}
          {emojis.map((e) => (
            <motion.div
              key={e.id}
              style={{
                position: 'absolute',
                left: `${e.x}%`,
                top: '-60px',
                fontSize: `${e.size}rem`,
                lineHeight: 1,
                userSelect: 'none',
              }}
              initial={{ y: 0, opacity: 0, rotate: Math.random() * 30 - 15, x: 0 }}
              animate={{
                y:       window.innerHeight + 80,
                opacity: [0, 1, 1, 0],
                rotate:  [Math.random() * 30 - 15, Math.random() * 60 - 30],
                x:       [(Math.random() - 0.5) * 60, (Math.random() - 0.5) * 120],
              }}
              transition={{ duration: e.dur, delay: e.delay, ease: 'easeIn' }}
            >
              {e.emoji}
            </motion.div>
          ))}

          {/* Frases flotantes */}
          {phrases.map((p) => (
            <motion.div
              key={p.id}
              style={{
                position: 'absolute',
                left:     `${p.x}%`,
                bottom:   '-60px',
                fontFamily: 'Cormorant Garamond, serif',
                fontSize:  `${p.size}rem`,
                color:     'rgba(197,231,255,0.88)',
                whiteSpace: 'nowrap',
                textShadow: '0 0 12px rgba(49,133,255,0.7), 0 0 24px rgba(114,199,255,0.4)',
                userSelect: 'none',
                transform:  'translateX(-50%)',
              }}
              initial={{ y: 0, opacity: 0 }}
              animate={{
                y:       -(window.innerHeight + 100),
                opacity: [0, 0.9, 0.9, 0],
                x:       [(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 80],
              }}
              transition={{ duration: p.dur, delay: p.delay, ease: 'easeOut' }}
            >
              {p.text}
            </motion.div>
          ))}

          {/* Destellos fijos pulsantes */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={`spark-${i}`}
              style={{
                position: 'absolute',
                left:   `${8 + i * 8}%`,
                top:    `${15 + (i % 4) * 20}%`,
                width:  '5px', height: '5px',
                borderRadius: '50%',
                background: i % 3 === 0 ? '#72C7FF' : i % 3 === 1 ? '#3185FF' : '#fff',
              }}
              animate={{
                scale:     [0, 2.5, 0],
                opacity:   [0, 1, 0],
                boxShadow: ['0 0 0 #72C7FF', '0 0 20px #72C7FF, 0 0 40px rgba(114,199,255,0.5)', '0 0 0 #72C7FF'],
              }}
              transition={{ duration: 1.8, delay: 0.2 + i * 0.18, repeat: Infinity, repeatDelay: 2 + i * 0.3 }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
