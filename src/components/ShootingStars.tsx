import { useEffect, useRef } from 'react'

interface ShootingStarsProps { count?: number; className?: string }

export default function ShootingStars({ count = 3, className = '' }: ShootingStarsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let animId = 0

    type SS = { x: number; y: number; prog: number; len: number; speed: number; angle: number; active: boolean; delay: number; maxDist: number }
    let stars: SS[] = []

    const make = (W: number, H: number): SS => {
      const maxDist = Math.random() * 120 + 80
      return { x: Math.random() * W * 0.7, y: Math.random() * H * 0.5, prog: 0, len: maxDist, speed: Math.random() * 3 + 2, angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3, active: false, delay: Math.random() * 8000, maxDist: maxDist + 60 }
    }

    const init = () => {
      const W = canvas.offsetWidth || 800
      const H = canvas.offsetHeight || 600
      canvas.width = W
      canvas.height = H
      stars = Array.from({ length: count }, () => make(W, H))
      stars.forEach((s, i) => { setTimeout(() => { s.active = true }, i * 3000 + s.delay) })
    }

    const draw = () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)

      stars.forEach((s, i) => {
        if (!s.active) return
        s.prog += s.speed
        if (s.prog > s.maxDist + 20) { stars[i] = make(W, H); stars[i].active = true; stars[i].prog = 0; return }
        const hx = s.x + Math.cos(s.angle) * s.prog
        const hy = s.y + Math.sin(s.angle) * s.prog
        const tx = hx - Math.cos(s.angle) * s.len
        const ty = hy - Math.sin(s.angle) * s.len
        const fi = Math.min(s.prog / 30, 1)
        const fo = Math.max(1 - (s.prog - (s.maxDist - 30)) / 30, 0)
        const op = Math.min(fi, fo)
        const g = ctx.createLinearGradient(tx, ty, hx, hy)
        g.addColorStop(0, 'rgba(114,199,255,0)')
        g.addColorStop(0.7, `rgba(114,199,255,${(op * 0.4).toFixed(2)})`)
        g.addColorStop(1, `rgba(255,255,255,${op.toFixed(2)})`)
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(hx, hy)
        ctx.strokeStyle = g; ctx.lineWidth = 1.5; ctx.stroke()
        ctx.beginPath(); ctx.arc(hx, hy, 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${op.toFixed(2)})`; ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }

    const ro = new ResizeObserver(() => init())
    ro.observe(canvas)
    init()
    draw()
    return () => { cancelAnimationFrame(animId); ro.disconnect() }
  }, [count])

  return <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} style={{ zIndex: 1 }} />
}
