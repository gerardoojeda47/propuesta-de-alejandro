import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import StarField from '../components/StarField'
import { constellationsContent } from '../data/romanticContent'

function ConstellationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const progressRef = useRef(0)
  const isInViewRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const W = canvas.offsetWidth || 600
      const H = canvas.offsetHeight || 280
      canvas.width = W
      canvas.height = H
    }
    resize()

    // Constelación A (izquierda — él)
    const constA = [
      { x: 0.12, y: 0.3 }, { x: 0.18, y: 0.2 }, { x: 0.25, y: 0.35 },
      { x: 0.15, y: 0.45 }, { x: 0.22, y: 0.55 }, { x: 0.08, y: 0.5 },
    ]

    // Constelación B (derecha — ella)
    const constB = [
      { x: 0.88, y: 0.3 }, { x: 0.82, y: 0.2 }, { x: 0.75, y: 0.35 },
      { x: 0.85, y: 0.45 }, { x: 0.78, y: 0.55 }, { x: 0.92, y: 0.5 },
    ]

    // Constelación unida (centro)
    const united = [
      { x: 0.35, y: 0.3 }, { x: 0.42, y: 0.2 }, { x: 0.5, y: 0.35 },
      { x: 0.45, y: 0.45 }, { x: 0.55, y: 0.45 }, { x: 0.58, y: 0.3 },
      { x: 0.65, y: 0.2 },
    ]

    // Conexiones por constelación
    const linksA = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]]
    const linksB = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]]
    const linksU = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[2,5]]

    const drawConst = (
      points: { x: number; y: number }[],
      links: number[][],
      opacity: number,
      offsetX: number,
      color: string
    ) => {
      const W = canvas.width
      const H = canvas.height

      links.forEach(([a, b]) => {
        const ax = points[a].x * W + offsetX
        const ay = points[a].y * H
        const bx = points[b].x * W + offsetX
        const by = points[b].y * H
        ctx.beginPath()
        ctx.moveTo(ax, ay)
        ctx.lineTo(bx, by)
        ctx.strokeStyle = `rgba(${color}, ${opacity * 0.4})`
        ctx.lineWidth = 1
        ctx.stroke()
      })

      points.forEach((p) => {
        const px = p.x * W + offsetX
        const py = p.y * H

        const grad = ctx.createRadialGradient(px, py, 0, px, py, 8)
        grad.addColorStop(0, `rgba(255,255,255,${opacity * 0.9})`)
        grad.addColorStop(0.5, `rgba(${color}, ${opacity * 0.5})`)
        grad.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.beginPath()
        ctx.arc(px, py, 8, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()

        ctx.beginPath()
        ctx.arc(px, py, 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${opacity * 0.9})`
        ctx.fill()
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const p = Math.min(progressRef.current, 1)

      if (p < 0.5) {
        // Fase 1: constelaciones separadas
        const alpha = Math.min(p * 2, 1)
        const moveOffset = p * 2 * -canvas.width * 0.15

        drawConst(constA, linksA, alpha, moveOffset, '49,133,255')
        drawConst(constB, linksB, alpha, -moveOffset, '114,199,255')
      } else {
        // Fase 2: unión de constelaciones
        const alpha2 = (p - 0.5) * 2

        // Fade out separadas
        const fadeOut = Math.max(1 - alpha2, 0)
        if (fadeOut > 0.01) {
          const finalOffset = -canvas.width * 0.15
          drawConst(constA, linksA, fadeOut, finalOffset, '49,133,255')
          drawConst(constB, linksB, fadeOut, -finalOffset, '114,199,255')
        }

        // Fade in unidas
        drawConst(united, linksU, alpha2, 0, '114,199,255')

        // Partículas de conexión
        if (alpha2 > 0.5) {
          const sparkAlpha = (alpha2 - 0.5) * 2
          for (let i = 0; i < 20; i++) {
            const sx = (0.35 + Math.random() * 0.3) * canvas.width
            const sy = (0.2 + Math.random() * 0.4) * canvas.height
            ctx.beginPath()
            ctx.arc(sx, sy, Math.random() * 2, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(114,199,255,${sparkAlpha * 0.3})`
            ctx.fill()
          }
        }
      }

      // Avanzar si está en vista
      if (isInViewRef.current && progressRef.current < 1) {
        progressRef.current += 0.004
      }

      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    const observer = new IntersectionObserver(
      (entries) => {
        isInViewRef.current = entries[0].isIntersecting
      },
      { threshold: 0.3 }
    )
    observer.observe(canvas)

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)

    return () => {
      cancelAnimationFrame(animRef.current)
      observer.disconnect()
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full"
      style={{ height: '280px', maxWidth: '600px' }}
    />
  )
}

export default function TwoConstellations() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section
      className="section-base py-24"
      style={{
        background: 'linear-gradient(180deg, #03050B 0%, #07111F 40%, #0B1F3A 70%, #07111F 100%)',
        minHeight: '100vh',
      }}
    >
      <StarField count={160} />

      <div className="relative z-10 max-w-3xl mx-auto px-6 flex flex-col items-center gap-12">

        {/* Constelaciones */}
        <ConstellationCanvas />

        {/* Párrafos */}
        <div ref={ref} className="space-y-5 max-w-xl text-center">
          {constellationsContent.paragraphs.map((text, i) => (
            <motion.p
              key={i}
              className="font-cormorant text-xl leading-relaxed"
              style={{ color: 'rgba(228,242,255,0.88)' }}
              initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
              animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0)' } : {}}
              transition={{ duration: 0.8, delay: i * 0.12 }}
            >
              {text}
            </motion.p>
          ))}
        </div>

        {/* Cita destacada */}
        <motion.blockquote
          className="text-center max-w-xl px-8 py-6 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(11,31,58,0.6), rgba(18,58,112,0.3))',
            border: '1px solid rgba(49,133,255,0.25)',
            boxShadow: '0 0 30px rgba(49,133,255,0.1)',
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <p
            className="font-cormorant italic text-xl md:text-2xl leading-relaxed"
            style={{ color: '#72C7FF' }}
          >
            "{constellationsContent.quote}"
          </p>
        </motion.blockquote>
      </div>
    </section>
  )
}
