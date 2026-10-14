import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import StarField from '../components/StarField'
import ShootingStars from '../components/ShootingStars'
import BlueParticles from '../components/BlueParticles'
import AuroraBackground from '../components/AuroraBackground'
import RomanticButton from '../components/RomanticButton'
import { heroContent } from '../data/romanticContent'

interface HeroProps { onEnter: () => void }

export default function Hero({ onEnter }: HeroProps) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const t = [
      setTimeout(() => setStep(1), 1000),
      setTimeout(() => setStep(2), 3200),
      setTimeout(() => setStep(3), 5600),
      setTimeout(() => setStep(4), 7200),
    ]
    return () => t.forEach(clearTimeout)
  }, [])

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 40%, #0B1F3A 0%, #07111F 45%, #03050B 100%)',
      }}
    >
      <StarField count={260} />
      <ShootingStars count={5} />
      <BlueParticles count={45} />
      <AuroraBackground />

      {/* Nebulosas */}
      <motion.div
        style={{
          position: 'absolute',
          width: '700px', height: '450px',
          background: 'radial-gradient(ellipse, rgba(49,133,255,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          top: '20%', left: '15%',
          pointerEvents: 'none',
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        style={{
          position: 'absolute',
          width: '500px', height: '350px',
          background: 'radial-gradient(ellipse, rgba(18,58,112,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(70px)',
          bottom: '20%', right: '10%',
          pointerEvents: 'none',
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      {/* Planeta lejano */}
      <motion.div
        style={{
          position: 'absolute',
          width: '130px', height: '130px',
          background: 'radial-gradient(ellipse at 35% 35%, #3185FF, #0B1F3A, #03050B)',
          borderRadius: '50%',
          top: '10%', right: '7%',
          boxShadow: '0 0 50px rgba(49,133,255,0.2), inset -12px -12px 30px rgba(0,0,0,0.6)',
          opacity: 0.55,
        }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Anillo del planeta */}
      <motion.div
        style={{
          position: 'absolute',
          width: '180px', height: '30px',
          border: '1px solid rgba(49,133,255,0.25)',
          borderRadius: '50%',
          top: 'calc(10% + 55px)', right: 'calc(7% - 25px)',
          transform: 'rotateX(70deg)',
          opacity: 0.3,
        }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Contenido central */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '2rem 1.5rem',
          maxWidth: '760px',
          margin: '0 auto',
          gap: '1.5rem',
        }}
      >
        <AnimatePresence>
          {step >= 1 && (
            <motion.p key="l1"
              className="font-cormorant"
              style={{ fontSize: 'clamp(1rem, 2.8vw, 1.4rem)', color: 'rgba(197,231,255,0.8)', fontStyle: 'italic', letterSpacing: '0.02em' }}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
            >
              {heroContent.line1}
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {step >= 2 && (
            <motion.p key="l2"
              className="font-cormorant"
              style={{ fontSize: 'clamp(1rem, 2.8vw, 1.4rem)', color: 'rgba(114,199,255,0.9)', fontStyle: 'italic', letterSpacing: '0.02em' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
            >
              {heroContent.line2}
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {step >= 3 && (
            <motion.div key="title"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            >
              <h1 className="font-cormorant text-gradient-shimmer"
                style={{ fontSize: 'clamp(2rem, 7vw, 4.5rem)', fontWeight: 300, lineHeight: 1.1 }}>
                {heroContent.title}
              </h1>
              {/* Línea luminosa */}
              <motion.div
                style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(49,133,255,0.9), rgba(114,199,255,0.8), transparent)' }}
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.8, delay: 0.5 }}
              />
              {/* Subtítulo */}
              <motion.p
                className="font-dancing"
                style={{ fontSize: 'clamp(1.1rem, 3vw, 1.6rem)', color: '#72C7FF', marginTop: '0.4rem' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
              >
                {heroContent.subtitle}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {step >= 4 && (
            <motion.div key="btn"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <RomanticButton onClick={onEnter} variant="primary">
                {heroContent.buttonText}
              </RomanticButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 45%, rgba(3,5,11,0.65) 100%)', pointerEvents: 'none', zIndex: 2 }} />
    </section>
  )
}
