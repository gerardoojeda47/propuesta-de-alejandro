import { useEffect, useRef } from 'react'

interface BlueParticlesProps {
  count?: number
  interactive?: boolean
  className?: string
}

export default function BlueParticles({ count = 60, interactive = false, className = '' }: BlueParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let animId = 0

    type P = { x: number; y: number; vx: number; vy: number; size: number; opacity: number; life: number; maxLife: number; hue: number }
    let particles: P[] = []
    let mouse = { x: -1000, y: -1000 }

    const makeParticle = (W: number, H: number, px?: number, py?: number): P => {
      const ml = Math.random() * 200 + 100
      return { x: px ?? Math.random() * W, y: py ?? Math.random() * H, vx: (Math.random() - 0.5) * 0.8, vy: (Math.random() - 0.5) * 0.8 - 0.2, size: Math.random() * 3 + 0.5, opacity: Math.random() * 0.8 + 0.2, life: Math.random() * ml, maxLife: ml, hue: Math.random() * 40 + 190 }
    }

    const init = () => {
      const W = canvas.offsetWidth || 800
      const H = canvas.offsetHeight || 600
      canvas.width = W
      canvas.height = H
      particles = Array.from({ length: count }, () => makeParticle(W, H))
    }

    const onMouseMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse = { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    if (interactive) canvas.addEventListener('mousemove', onMouseMove)

    const draw = () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)

      particles.forEach((p, i) => {
        p.life++
        if (p.life > p.maxLife) { particles[i] = makeParticle(W, H); return }
        if (interactive) {
          const dx = mouse.x - p.x, dy = mouse.y - p.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 150) { p.vx += dx / d * 0.05; p.vy += dy / d * 0.05 }
        }
        const sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (sp > 2) { p.vx = p.vx / sp * 2; p.vy = p.vy / sp * 2 }
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -0.8
        if (p.y < 0 || p.y > H) p.vy *= -0.8
        const lr = p.life / p.maxLife
        const fa = lr < 0.2 ? lr / 0.2 : lr > 0.8 ? 1 - (lr - 0.8) / 0.2 : 1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue},80%,70%,${(p.opacity * fa).toFixed(2)})`
        ctx.fill()
        if (p.size * 3 > 0) {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3)
          g.addColorStop(0, `hsla(${p.hue},80%,70%,${(0.2 * fa).toFixed(2)})`)
          g.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
          ctx.fillStyle = g
          ctx.fill()
        }
      })
      animId = requestAnimationFrame(draw)
    }

    const ro = new ResizeObserver(() => init())
    ro.observe(canvas)
    init()
    draw()

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
      if (interactive) canvas.removeEventListener('mousemove', onMouseMove)
    }
  }, [count, interactive])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    />
  )
}
