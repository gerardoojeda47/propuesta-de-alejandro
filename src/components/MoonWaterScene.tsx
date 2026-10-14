import { useEffect, useRef } from 'react'

export default function MoonWaterScene({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let animId = 0
    let t = 0

    const draw = () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const W = canvas.offsetWidth || 800
      const H = canvas.offsetHeight || 600
      if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H }

      t += 0.008
      const horizon = H * 0.45
      ctx.clearRect(0, 0, W, H)

      // Cielo
      const sky = ctx.createLinearGradient(0, 0, 0, horizon)
      sky.addColorStop(0, '#03050B'); sky.addColorStop(0.5, '#07111F'); sky.addColorStop(1, '#0B1F3A')
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, horizon + 2)

      // Luna
      const mx = W * 0.5, my = horizon * 0.35, mr = Math.min(W, H) * 0.07
      if (mr > 0) {
        const halo = ctx.createRadialGradient(mx, my, mr, mx, my, mr * 4)
        halo.addColorStop(0, 'rgba(114,199,255,0.15)'); halo.addColorStop(1, 'rgba(114,199,255,0)')
        ctx.beginPath(); ctx.arc(mx, my, mr * 4, 0, Math.PI * 2); ctx.fillStyle = halo; ctx.fill()
        const moon = ctx.createRadialGradient(mx - mr * 0.2, my - mr * 0.2, mr * 0.1, mx, my, mr)
        moon.addColorStop(0, '#E8F8FF'); moon.addColorStop(0.4, '#C5E7FF'); moon.addColorStop(0.8, '#72C7FF'); moon.addColorStop(1, '#3185FF')
        ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI * 2)
        ctx.fillStyle = moon; ctx.shadowBlur = 40 * (Math.sin(t * 0.5) * 0.3 + 0.7); ctx.shadowColor = 'rgba(114,199,255,0.8)'
        ctx.fill(); ctx.shadowBlur = 0
      }

      // Agua
      const water = ctx.createLinearGradient(0, horizon, 0, H)
      water.addColorStop(0, '#0B1F3A'); water.addColorStop(0.3, '#07111F'); water.addColorStop(1, '#03050B')
      ctx.fillStyle = water; ctx.fillRect(0, horizon, W, H - horizon)

      // Ondas
      for (let i = 0; i < 8; i++) {
        const wy = horizon + (i * (H - horizon)) / 8
        const wa = (2 - i * 0.1) * (1 + i * 0.3)
        const wf = 0.015 - i * 0.001
        const wp = t * (1.5 - i * 0.15)
        ctx.beginPath(); ctx.moveTo(0, wy)
        for (let x = 0; x <= W; x += 4) ctx.lineTo(x, wy + Math.sin(x * wf + wp) * wa + Math.sin(x * wf * 2 + wp * 1.3) * (wa * 0.4))
        ctx.strokeStyle = `rgba(114,199,255,${Math.max(0, 0.08 - i * 0.006).toFixed(3)})`; ctx.lineWidth = 1; ctx.stroke()
      }

      // Reflejo de la luna
      if (mr > 0) {
        const rlen = (H - horizon) * 0.7
        const sw = mr * (1 + (H - horizon) / H * 3)
        for (let y = horizon; y < horizon + rlen; y += 3) {
          const prog = (y - horizon) / rlen
          const cw = mr * 0.3 + prog * sw
          const a = (1 - prog) * 0.3 * (0.7 + Math.sin(y * 0.1 + t * 2) * 0.3)
          if (cw > 0 && a > 0) {
            ctx.beginPath()
            ctx.ellipse(mx + Math.sin(y * 0.08 + t * 3) * sw * 0.12, y, cw, 1.5, 0, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(114,199,255,${a.toFixed(3)})`; ctx.fill()
          }
        }
      }

      // Estrellas en el cielo
      for (let i = 0; i < 60; i++) {
        const sx = (i * 137.5) % W, sy = (i * 97.3) % (horizon * 0.85)
        const tw = Math.sin(t * (0.5 + i * 0.1) + i) * 0.4 + 0.6
        ctx.beginPath(); ctx.arc(sx, sy, i % 3 === 0 ? 1.2 : 0.7, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(244,248,255,${(tw * 0.8).toFixed(2)})`; ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    const ro = new ResizeObserver(() => { const W = canvas.offsetWidth; const H = canvas.offsetHeight; if (W > 0 && H > 0) { canvas.width = W; canvas.height = H } })
    ro.observe(canvas)
    draw()
    return () => { cancelAnimationFrame(animId); ro.disconnect() }
  }, [])

  return <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full ${className}`} style={{ zIndex: 0 }} />
}
