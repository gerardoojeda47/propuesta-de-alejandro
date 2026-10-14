import { useEffect, useRef } from 'react'

interface StarFieldProps {
  count?: number
  className?: string
  /** 'static' = no parpadeo, 'slow' = parpadeo lento, 'normal' = parpadeo normal */
  twinkleMode?: 'none' | 'slow' | 'normal'
}

export default function StarField({ count = 180, className = '', twinkleMode = 'normal' }: StarFieldProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let t = 0
    const dpr = window.devicePixelRatio || 1

    type Star = { x: number; y: number; r: number; opacity: number; speed: number; offset: number; blue: boolean }
    let stars: Star[] = []

    const init = () => {
      const W = canvas.offsetWidth  || 800
      const H = canvas.offsetHeight || 600
      canvas.width  = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      canvas.style.width  = W + 'px'
      canvas.style.height = H + 'px'
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.8 + 0.3,
        opacity: Math.random() * 0.65 + 0.15,
        speed: Math.random() * 0.25 + 0.04,
        offset: Math.random() * Math.PI * 2,
        blue: Math.random() < 0.25,
      }))
    }

    const draw = () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const dW = canvas.width
      const dH = canvas.height
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, dW, dH)
      t += 0.012

      const spd = twinkleMode === 'none' ? 0 : twinkleMode === 'slow' ? 0.4 : 1

      stars.forEach((s) => {
        const tw = twinkleMode === 'none' ? s.opacity : s.opacity * (Math.sin(t * s.speed * 5 * spd + s.offset) * 0.38 + 0.62)
        const r = s.blue ? `rgba(114,199,255,${tw.toFixed(3)})` : `rgba(244,248,255,${tw.toFixed(3)})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = r
        ctx.fill()

        if (s.r > 1.2) {
          const gr = s.r * 2.8
          const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, gr)
          g.addColorStop(0, s.blue ? `rgba(114,199,255,${(tw * 0.35).toFixed(3)})` : `rgba(200,225,255,${(tw * 0.25).toFixed(3)})`)
          g.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.beginPath()
          ctx.arc(s.x, s.y, gr, 0, Math.PI * 2)
          ctx.fillStyle = g
          ctx.fill()
        }
      })

      raf = requestAnimationFrame(draw)
    }

    const ro = new ResizeObserver(init)
    ro.observe(canvas)
    init()
    draw()
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [count, twinkleMode])

  return (
    <canvas ref={ref}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 0 }} />
  )
}
