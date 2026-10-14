import { useState, useRef, useEffect, Component } from 'react'
import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import Hero            from './sections/Hero'
import TimeWithYou     from './sections/TimeWithYou'
import RealFeelings    from './sections/RealFeelings'
import MainPoem        from './sections/MainPoem'
import TwoConstellations from './sections/TwoConstellations'
import Memories        from './sections/Memories'
import MoonScene       from './sections/MoonScene'
import ShootingStarSection from './sections/ShootingStar'
import Proposal        from './sections/Proposal'
import FinalLetter     from './sections/FinalLetter'
import ProgressIndicator    from './components/ProgressIndicator'
import MusicPlayer          from './components/MusicPlayer'
import UniverseBackground   from './components/UniverseBackground'

/* ── Error boundary ──────────────────────────────────────────── */
class Safe extends Component<
  { name: string; children: ReactNode },
  { err: boolean }
> {
  constructor(p: { name: string; children: ReactNode }) {
    super(p)
    this.state = { err: false }
  }
  static getDerivedStateFromError() { return { err: true } }
  componentDidCatch(e: Error) { console.warn('[Safe]', this.props.name, e.message) }
  render() {
    if (this.state.err) return <div style={{ minHeight: '8vh', background: '#03050B' }} />
    return this.props.children
  }
}

type Phase = 'hero' | 'fx' | 'story'

/* Partículas de la transición — generadas una sola vez */
const FX_PARTICLES = Array.from({ length: 32 }, (_, i) => {
  const angle = (i / 32) * Math.PI * 2
  const dist  = 220 + (i % 4) * 85
  return { angle, dist, i }
})

export default function App() {
  const [phase, setPhase] = useState<Phase>('hero')
  const [sect,  setSect]  = useState(0)
  const refs = useRef<(HTMLElement | null)[]>([])

  /* IntersectionObserver para progreso */
  useEffect(() => {
    if (phase !== 'story') return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = refs.current.indexOf(e.target as HTMLElement)
            if (i >= 0) setSect(i)
          }
        })
      },
      { threshold: 0.22 }
    )
    refs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [phase])

  /* Scroll de teclado */
  useEffect(() => {
    if (phase !== 'story') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') go(Math.min(sect + 1, refs.current.length - 1))
      if (e.key === 'ArrowUp'   || e.key === 'PageUp')   go(Math.max(sect - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, sect])

  const enter = () => {
    setPhase('fx')
    setTimeout(() => { setPhase('story'); window.scrollTo({ top: 0 }) }, 2900)
  }

  const go  = (i: number) => refs.current[i]?.scrollIntoView({ behavior: 'smooth' })
  const ref = (i: number) => (el: HTMLElement | null) => { refs.current[i] = el }

  return (
    <div style={{ background: '#03050B' }}>

      {/* ── HERO ──────────────────────────────── */}
      {phase === 'hero' && <Hero onEnter={enter} />}

      {/* ── TRANSICIÓN CINEMATOGRÁFICA ────────── */}
      <AnimatePresence>
        {phase === 'fx' && (
          <motion.div
            key="fx"
            style={{ position: 'fixed', inset: 0, zIndex: 200, background: '#03050B', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, delay: 2.0 }}
          >
            {/* Nebulosa que se expande */}
            <motion.div
              style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%,rgba(49,133,255,.22) 0%,transparent 65%)' }}
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 4.5, opacity: [0, 0.85, 0.85, 0] }}
              transition={{ duration: 2.8, ease: 'easeInOut' }}
            />

            {/* Partículas */}
            {FX_PARTICLES.map(({ angle, dist, i }) => (
              <motion.div key={i}
                style={{
                  position: 'absolute',
                  width:  i % 5 === 0 ? '4px' : '2px',
                  height: i % 5 === 0 ? '4px' : '2px',
                  borderRadius: '50%',
                  background: i % 3 === 0 ? '#72C7FF' : i % 3 === 1 ? '#3185FF' : '#fff',
                }}
                initial={{ x: 0, y: 0, opacity: 0 }}
                animate={{
                  x: Math.cos(angle) * dist,
                  y: Math.sin(angle) * dist,
                  opacity: [0, 1, 1, 0],
                  scale: [0, 2, 1, 0],
                }}
                transition={{ duration: 2.3, delay: 0.4 + (i % 8) * 0.05, ease: 'easeOut' }}
              />
            ))}

            {/* Barras de cine */}
            <motion.div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: '#000', zIndex: 10 }}
              initial={{ height: 0 }} animate={{ height: '8vh' }} transition={{ duration: 0.5 }} />
            <motion.div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#000', zIndex: 10 }}
              initial={{ height: 0 }} animate={{ height: '8vh' }} transition={{ duration: 0.5 }} />

            {/* Texto */}
            <motion.p
              style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(1.1rem,3vw,1.65rem)', color: 'rgba(197,231,255,.92)', textAlign: 'center', position: 'relative', zIndex: 5, letterSpacing: '.06em' }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2.6, times: [0, 0.15, 0.72, 1] }}
            >
              Hay algo que quiero decirte...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HISTORIA ──────────────────────────── */}
      {phase === 'story' && (
        <>
          {/* Fondo del universo — fijo, detrás de todo */}
          <UniverseBackground section={sect} />

          <ProgressIndicator current={sect} total={9} onNavigate={go} />
          <MusicPlayer />

          {/* Botón scroll-to-top */}
          <motion.button
            onClick={() => go(0)}
            style={{
              position: 'fixed', bottom: '1.2rem', right: '1.2rem', zIndex: 50,
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'rgba(7,17,31,.85)',
              border: '1px solid rgba(49,133,255,.3)',
              color: '#72C7FF', fontSize: '1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
            }}
            whileHover={{ scale: 1.12, boxShadow: '0 0 16px rgba(49,133,255,.4)' }}
            whileTap={{ scale: 0.93 }}
            title="Volver al inicio"
            aria-label="Volver al inicio"
          >
            ↑
          </motion.button>

          <section ref={ref(0)}><Safe name="TimeWithYou"><TimeWithYou /></Safe></section>
          <section ref={ref(1)}><Safe name="RealFeelings"><RealFeelings /></Safe></section>
          <section ref={ref(2)}><Safe name="MainPoem"><MainPoem onContinue={() => go(3)} /></Safe></section>
          <section ref={ref(3)}><Safe name="Constellations"><TwoConstellations /></Safe></section>
          <section ref={ref(4)}><Safe name="Memories"><Memories /></Safe></section>
          <section ref={ref(5)}><Safe name="MoonScene"><MoonScene /></Safe></section>
          <section ref={ref(6)}><Safe name="ShootingStar"><ShootingStarSection onStarTouched={() => go(7)} /></Safe></section>
          <section ref={ref(7)}><Safe name="Proposal"><Proposal /></Safe></section>
          <section ref={ref(8)}><Safe name="FinalLetter"><FinalLetter /></Safe></section>
        </>
      )}
    </div>
  )
}
