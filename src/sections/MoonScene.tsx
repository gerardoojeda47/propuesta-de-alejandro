import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import MoonWaterScene from '../components/MoonWaterScene'
import { moonSceneContent } from '../data/romanticContent'

export default function MoonScene() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-8%' })

  return (
    <section style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', background: '#03050B' }}>
      {/* Escena del lago */}
      <MoonWaterScene />

      {/* Overlay para legibilidad */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to right,rgba(3,5,11,.88) 0%,rgba(3,5,11,.35) 35%,rgba(3,5,11,.35) 65%,rgba(3,5,11,.88) 100%)' }} />

      {/* Texto superpuesto */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem 1.5rem' }}>
        <div ref={ref} style={{ maxWidth: '560px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.1rem', alignItems: 'center' }}>

          {/* Ornamento */}
          <motion.div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '.5rem' }}
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 1 }}
          >
            <div style={{ height: '1px', width: '32px', background: 'linear-gradient(90deg,transparent,rgba(49,133,255,.55))' }} />
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#3185FF', boxShadow: '0 0 8px #3185FF' }} />
            <div style={{ height: '1px', width: '32px', background: 'linear-gradient(270deg,transparent,rgba(49,133,255,.55))' }} />
          </motion.div>

          {moonSceneContent.paragraphs.map((txt, i) => (
            <motion.p key={i}
              className="font-cormorant"
              style={{
                fontSize: 'clamp(1.05rem,2.4vw,1.22rem)',
                lineHeight: 1.8,
                color: i === 0 || i === 6 ? '#72C7FF' : 'rgba(228,242,255,.87)',
                fontStyle: i === 0 ? 'italic' : 'normal',
              }}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: .8, delay: i * .14 }}
            >{txt}</motion.p>
          ))}

          {/* Camino de luz → siguiente sección */}
          <motion.div
            className="divider-glow"
            style={{ marginTop: '1.5rem', width: 0 }}
            animate={inView ? { width: '55%', opacity: .65 } : {}}
            transition={{ duration: 2, delay: 1.4 }}
          />
        </div>
      </div>
    </section>
  )
}
