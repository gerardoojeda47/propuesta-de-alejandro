import { useEffect, useRef } from 'react'

/* ─────────────────────────────────────────────────────────────────
   UniverseBackground — canvas fijo de fondo para toda la historia.
   Dibuja: estrellas, nebulosas, luna, reflejo en el agua (abajo),
   y responde a la sección activa para cambiar la escena.
───────────────────────────────────────────────────────────────── */

interface Props {
  section: number   // sección activa (0–8)
}

export default function UniverseBackground({ section }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef(section)

  useEffect(() => { sectionRef.current = section }, [section])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    let raf = 0, t = 0

    const resize = () => {
      canvas.width  = window.innerWidth  * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width  = window.innerWidth  + 'px'
      canvas.style.height = window.innerHeight + 'px'
    }
    resize()
    window.addEventListener('resize', resize)

    // ── Estrellas ──────────────────────────────────────────────
    type Star = { x: number; y: number; r: number; op: number; spd: number; off: number; blue: boolean }
    const W = () => window.innerWidth
    const H = () => window.innerHeight

    const makeStars = (): Star[] =>
      Array.from({ length: 220 }, () => ({
        x: Math.random() * W(), y: Math.random() * H(),
        r: Math.random() * 1.6 + 0.2,
        op: Math.random() * 0.65 + 0.12,
        spd: Math.random() * 0.22 + 0.04,
        off: Math.random() * Math.PI * 2,
        blue: Math.random() < 0.22,
      }))

    let stars = makeStars()
    window.addEventListener('resize', () => { stars = makeStars() })

    // ── Estrellas fugaces ─────────────────────────────────────
    type Shooting = { x: number; y: number; prog: number; len: number; spd: number; angle: number; active: boolean; delay: number }
    const makeShooting = (): Shooting => ({
      x: Math.random() * W() * 0.75,
      y: Math.random() * H() * 0.45,
      prog: 0, len: Math.random() * 110 + 70,
      spd: Math.random() * 3 + 2,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.35,
      active: false,
      delay: Math.random() * 8000,
    })
    const shootings: Shooting[] = Array.from({ length: 4 }, makeShooting)
    shootings.forEach((s, i) => { setTimeout(() => { s.active = true }, i * 2500 + s.delay) })

    // ── Nebulosas ─────────────────────────────────────────────
    const nebulas = [
      { x: 0.25, y: 0.3,  rx: 0.35, ry: 0.25, color: [49,133,255,0.055],  phase: 0 },
      { x: 0.78, y: 0.55, rx: 0.28, ry: 0.2,  color: [18,58,112,0.075],   phase: 2 },
      { x: 0.5,  y: 0.15, rx: 0.4,  ry: 0.18, color: [114,199,255,0.038], phase: 4 },
      { x: 0.1,  y: 0.7,  rx: 0.22, ry: 0.18, color: [49,133,255,0.04],   phase: 1 },
      { x: 0.88, y: 0.2,  rx: 0.2,  ry: 0.15, color: [18,58,112,0.06],    phase: 3 },
    ]

    // ── Luna ─────────────────────────────────────────────────
    const moonData = {
      baseX: 0.72, baseY: 0.18, baseR: 0.065,
    }

    const draw = () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const cW = W() * dpr, cH = H() * dpr
      const lW = W(), lH = H()     // logical size
      t += 0.007

      ctx.clearRect(0, 0, cW, cH)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const sec = sectionRef.current

      // ── Gradiente de fondo (cambia con la sección) ──────────
      const bgColors: [string, string, string][] = [
        ['#03050B', '#07111F', '#0B1F3A'],  // 0 TimeWithYou
        ['#03050B', '#07111F', '#0B2040'],  // 1 RealFeelings
        ['#03050B', '#060F1C', '#0A1C38'],  // 2 MainPoem
        ['#030609', '#05101E', '#091830'],  // 3 Constellations
        ['#03050B', '#07111F', '#091A35'],  // 4 Memories
        ['#020408', '#060F1C', '#0B1F3A'],  // 5 MoonScene
        ['#02030A', '#05111E', '#091830'],  // 6 ShootingStar
        ['#03050B', '#061220', '#0B2040'],  // 7 Proposal
        ['#02040A', '#06111D', '#091830'],  // 8 FinalLetter
      ]
      const [c0, c1, c2] = bgColors[Math.min(sec, 8)]
      const bg = ctx.createLinearGradient(0, 0, 0, lH)
      bg.addColorStop(0, c0); bg.addColorStop(0.5, c1); bg.addColorStop(1, c2)
      ctx.fillStyle = bg; ctx.fillRect(0, 0, lW, lH)

      // ── Nebulosas animadas ──────────────────────────────────
      nebulas.forEach((n, ni) => {
        const pulse = Math.sin(t * 0.6 + n.phase) * 0.3 + 0.7
        const rx = n.rx * lW * (0.9 + pulse * 0.2)
        const ry = n.ry * lH * (0.9 + pulse * 0.2)
        const px = (n.x + Math.sin(t * 0.18 + ni) * 0.03) * lW
        const py = (n.y + Math.cos(t * 0.14 + ni) * 0.025) * lH
        const al = n.color[3]! * pulse * (sec === ni ? 1.5 : 1)

        const g = ctx.createRadialGradient(px, py, 0, px, py, Math.max(rx, ry))
        g.addColorStop(0, `rgba(${n.color[0]},${n.color[1]},${n.color[2]},${al.toFixed(3)})`)
        g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.save()
        ctx.scale(1, ry / rx)
        ctx.beginPath(); ctx.arc(px, py * (rx / ry), rx, 0, Math.PI * 2)
        ctx.fillStyle = g; ctx.fill()
        ctx.restore()
      })

      // ── Luna (visible en todas las secciones, más brillante en 5,7) ──
      const moonBright  = (sec === 5 || sec === 7) ? 1.5 : 1
      const mx = moonData.baseX * lW + Math.sin(t * 0.08) * lW * 0.01
      const my = moonData.baseY * lH + Math.cos(t * 0.06) * lH * 0.008
      const mr = moonData.baseR * Math.min(lW, lH)

      // Halo exterior
      const moonHalo = ctx.createRadialGradient(mx, my, mr, mx, my, mr * 5)
      moonHalo.addColorStop(0, `rgba(114,199,255,${(0.12 * moonBright).toFixed(3)})`)
      moonHalo.addColorStop(0.4, `rgba(49,133,255,${(0.05 * moonBright).toFixed(3)})`)
      moonHalo.addColorStop(1, 'rgba(49,133,255,0)')
      ctx.beginPath(); ctx.arc(mx, my, mr * 5, 0, Math.PI * 2)
      ctx.fillStyle = moonHalo; ctx.fill()

      // Luna principal
      const moonGrad = ctx.createRadialGradient(mx - mr * 0.22, my - mr * 0.22, mr * 0.08, mx, my, mr)
      moonGrad.addColorStop(0, '#F0FAFF')
      moonGrad.addColorStop(0.35, '#C5E7FF')
      moonGrad.addColorStop(0.7, '#72C7FF')
      moonGrad.addColorStop(1, '#3185FF')
      const glow = (Math.sin(t * 0.5) * 0.28 + 0.72) * moonBright
      ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI * 2)
      ctx.fillStyle = moonGrad
      ctx.shadowBlur = 35 * glow; ctx.shadowColor = 'rgba(114,199,255,0.85)'
      ctx.fill(); ctx.shadowBlur = 0

      // ── Reflejo de luna en agua (visible en secciones 5,6,7,8) ──
      if (sec >= 5) {
        const waterY = lH * 0.6
        const rlen = lH * 0.38
        const sw = mr * (1 + 3 * (sec - 5) / 3)

        for (let y = waterY; y < waterY + rlen; y += 3) {
          const prog = (y - waterY) / rlen
          const cw = mr * 0.25 + prog * sw
          const shimmer = Math.sin(y * 0.09 + t * 3.5) * 0.38
          const al = (1 - prog) * 0.28 * (0.65 + shimmer)
          if (cw > 0 && al > 0.005) {
            ctx.beginPath()
            ctx.ellipse(mx + Math.sin(y * 0.07 + t * 2.8) * sw * 0.1, y, cw, 1.6, 0, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(114,199,255,${al.toFixed(3)})`; ctx.fill()
          }
        }

        // Ondas sutiles del agua
        for (let wi = 0; wi < 5; wi++) {
          const wy = waterY + wi * (lH - waterY) / 5
          ctx.beginPath(); ctx.moveTo(0, wy)
          for (let x = 0; x <= lW; x += 5) {
            const wf = 0.013 - wi * 0.0008
            const wp = t * (1.4 - wi * 0.14)
            ctx.lineTo(x, wy + Math.sin(x * wf + wp) * (1.8 + wi * 0.2))
          }
          ctx.strokeStyle = `rgba(114,199,255,${(0.055 - wi * 0.006).toFixed(3)})`
          ctx.lineWidth = 1; ctx.stroke()
        }
      }

      // ── Planetas/objetos especiales por sección ──────────────
      if (sec === 0 || sec === 3) {
        // Planeta pequeño lejano (sección 0 y 3)
        const px = lW * 0.85, py = lH * 0.15, pr = lW * 0.025
        const pg = ctx.createRadialGradient(px - pr * 0.3, py - pr * 0.3, pr * 0.05, px, py, pr)
        pg.addColorStop(0, '#4a9eff'); pg.addColorStop(0.5, '#1a4a9e'); pg.addColorStop(1, '#030810')
        ctx.beginPath(); ctx.arc(px, py, pr, 0, Math.PI * 2)
        ctx.fillStyle = pg; ctx.shadowBlur = 18; ctx.shadowColor = 'rgba(49,133,255,0.4)'
        ctx.fill(); ctx.shadowBlur = 0
      }

      if (sec === 2 || sec === 3) {
        // Galaxia espiral sutil en el fondo
        for (let arm = 0; arm < 3; arm++) {
          for (let j = 0; j < 40; j++) {
            const radius = j * lW * 0.004
            const angle = j * 0.35 + arm * ((Math.PI * 2) / 3) + t * 0.03
            const gx = lW * 0.2 + Math.cos(angle) * radius
            const gy = lH * 0.35 + Math.sin(angle) * radius * 0.45
            const al = (1 - j / 40) * 0.25
            ctx.beginPath(); ctx.arc(gx, gy, 1.5, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(114,199,255,${al.toFixed(3)})`; ctx.fill()
          }
        }
      }

      if (sec === 7) {
        // Halo extra grande para la propuesta
        const hg = ctx.createRadialGradient(lW / 2, lH / 2, 0, lW / 2, lH / 2, lW * 0.45)
        hg.addColorStop(0, `rgba(49,133,255,${(0.06 * (Math.sin(t * 0.8) * 0.3 + 0.7)).toFixed(3)})`)
        hg.addColorStop(1, 'rgba(49,133,255,0)')
        ctx.beginPath(); ctx.arc(lW / 2, lH / 2, lW * 0.45, 0, Math.PI * 2)
        ctx.fillStyle = hg; ctx.fill()
      }

      // ── Estrellas parpadeantes ────────────────────────────────
      stars.forEach((s) => {
        const tw = s.op * (Math.sin(t * s.spd * 5 + s.off) * 0.38 + 0.62)
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = s.blue
          ? `rgba(114,199,255,${tw.toFixed(3)})`
          : `rgba(244,248,255,${tw.toFixed(3)})`
        ctx.fill()

        if (s.r > 1.1) {
          const gr = s.r * 2.8
          const g2 = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, gr)
          g2.addColorStop(0, `rgba(${s.blue ? '114,199,255' : '220,235,255'},${(tw * 0.32).toFixed(3)})`)
          g2.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.beginPath(); ctx.arc(s.x, s.y, gr, 0, Math.PI * 2)
          ctx.fillStyle = g2; ctx.fill()
        }
      })

      // ── Estrellas fugaces ─────────────────────────────────────
      shootings.forEach((s, i) => {
        if (!s.active) return
        s.prog += s.spd
        const total = s.len + 50
        if (s.prog > total + 20) {
          Object.assign(s, makeShooting()); s.active = true; s.prog = 0
        }
        const hx = s.x + Math.cos(s.angle) * s.prog
        const hy = s.y + Math.sin(s.angle) * s.prog
        const tx = hx - Math.cos(s.angle) * s.len
        const ty = hy - Math.sin(s.angle) * s.len
        const fi = Math.min(s.prog / 25, 1)
        const fo = Math.max(1 - (s.prog - (total - 25)) / 25, 0)
        const op = Math.min(fi, fo)
        const g2 = ctx.createLinearGradient(tx, ty, hx, hy)
        g2.addColorStop(0, 'rgba(114,199,255,0)')
        g2.addColorStop(0.65, `rgba(114,199,255,${(op * 0.42).toFixed(3)})`)
        g2.addColorStop(1, `rgba(255,255,255,${op.toFixed(3)})`)
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(hx, hy)
        ctx.strokeStyle = g2; ctx.lineWidth = 1.4; ctx.stroke()
        ctx.beginPath(); ctx.arc(hx, hy, 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${op.toFixed(3)})`; ctx.fill()
        void i
      })

      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
      }}
    />
  )
}
