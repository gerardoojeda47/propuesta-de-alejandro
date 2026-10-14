import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import StarField from '../components/StarField'
import ShootingStars from '../components/ShootingStars'
import BlueParticles from '../components/BlueParticles'
import AuroraBackground from '../components/AuroraBackground'
import LoveExplosion from '../components/LoveExplosion'
import { proposalContent } from '../data/romanticContent'

export default function Proposal() {
  const [answer, setAnswer]   = useState<'yes' | 'no' | null>(null)
  const [showExplosion, setShowExplosion] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const handleYes = () => {
    setAnswer('yes')
    setShowExplosion(true)
    // Scroll al tope de la sección para que se vea el mensaje completo
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* Explosión de amor — capa fija sobre todo */}
      <LoveExplosion active={showExplosion} />

      <section
        ref={sectionRef}
        style={{
          position: 'relative',
          minHeight: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(ellipse at 50% 35%,rgba(11,31,58,0.65) 0%,rgba(7,17,31,0.7) 45%,rgba(3,5,11,0.75) 85%)',
          paddingTop: '9rem',
          paddingBottom: '5rem',
        }}
      >
        <StarField count={220} />
        <ShootingStars count={6} />
        <BlueParticles count={35} />
        <AuroraBackground intensity={1.2} />

        {/* Luna pulsante */}
        <motion.div
          style={{
            position: 'absolute',
            width: '155px', height: '155px',
            background: 'radial-gradient(ellipse at 35% 35%, #F0FAFF, #C5E7FF, #72C7FF, #3185FF)',
            borderRadius: '50%',
            top: '5%', left: '50%',
            transform: 'translateX(-50%)',
            opacity: 0.68,
          }}
          animate={{
            boxShadow: [
              '0 0 40px rgba(114,199,255,0.35)',
              '0 0 100px rgba(114,199,255,0.75)',
              '0 0 40px rgba(114,199,255,0.35)',
            ],
            scale: [1, 1.04, 1],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Halo central */}
        <motion.div
          style={{
            position: 'absolute',
            width: '650px', height: '650px',
            background: 'radial-gradient(ellipse, rgba(49,133,255,0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            filter: 'blur(35px)',
            pointerEvents: 'none',
          }}
          animate={{ scale: [1, 1.18, 1], opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 5.5, repeat: Infinity }}
        />

        {/* Contenido */}
        <div style={{
          position: 'relative', zIndex: 10,
          maxWidth: '700px', width: '100%',
          padding: '0 1.5rem',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', textAlign: 'center',
          gap: '2rem',
        }}>
          <AnimatePresence mode="wait">

            {/* ── PREGUNTA ────────────────────────────────────── */}
            {answer === null && (
              <motion.div key="q"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.8rem', width: '100%' }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(6px)' }}
                transition={{ duration: 0.8 }}
              >
                {proposalContent.lines.map((line, i) => (
                  <motion.p key={i}
                    className="font-cormorant"
                    style={{
                      fontSize: i === 0 ? 'clamp(1.3rem,3.5vw,2.1rem)' : 'clamp(1.05rem,2.5vw,1.35rem)',
                      color: i === 0 ? '#72C7FF' : 'rgba(228,242,255,0.88)',
                      fontStyle: i === 0 ? 'italic' : 'normal',
                      lineHeight: 1.68, maxWidth: '580px',
                    }}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.28 }}
                  >{line}</motion.p>
                ))}

                {/* Línea de luz */}
                <motion.div
                  style={{ width: '100%', height: '1px', background: 'linear-gradient(90deg,transparent,rgba(49,133,255,0.7),rgba(114,199,255,0.9),transparent)', margin: '.5rem 0' }}
                  initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.8, delay: 1.2 }}
                />

                {/* Pregunta */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, filter: 'blur(8px)' }}
                  whileInView={{ opacity: 1, scale: 1, filter: 'blur(0)' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.8, delay: 1.6 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.4rem' }}
                >
                  <motion.h1
                    className="font-cormorant text-gradient-shimmer"
                    style={{ fontSize: 'clamp(1.6rem,5vw,3.2rem)', fontWeight: 300, lineHeight: 1.2 }}
                    animate={{ textShadow: ['0 0 20px rgba(49,133,255,0.3)','0 0 55px rgba(114,199,255,0.7)','0 0 20px rgba(49,133,255,0.3)'] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >MÓNICA MARCELA GONZÁLEZ,</motion.h1>
                  <motion.h1
                    className="font-cormorant text-gradient-shimmer"
                    style={{ fontSize: 'clamp(1.6rem,5vw,3.2rem)', fontWeight: 300, lineHeight: 1.2 }}
                  >¿quieres ser mi novia?</motion.h1>
                </motion.div>

                {/* Botones */}
                <motion.div
                  style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', width: '100%' }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 2.4 }}
                >
                  <motion.button
                    style={{
                      padding: '1.1rem 3.2rem',
                      borderRadius: '9999px',
                      fontFamily: 'Cormorant Garamond,serif',
                      fontSize: '1.35rem',
                      letterSpacing: '.05em',
                      cursor: 'pointer',
                      border: '1px solid rgba(49,133,255,0.75)',
                      background: 'linear-gradient(135deg,rgba(49,133,255,0.42),rgba(18,58,112,0.65))',
                      color: '#F4F8FF',
                      boxShadow: '0 0 28px rgba(49,133,255,0.42), 0 0 65px rgba(49,133,255,0.12)',
                      minWidth: '230px',
                    }}
                    whileHover={{ scale: 1.07, boxShadow: '0 0 55px rgba(49,133,255,0.85), 0 0 90px rgba(49,133,255,0.32)', y: -5 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleYes}
                  >{proposalContent.yesButton}</motion.button>

                  <motion.button
                    style={{
                      padding: '.75rem 2.5rem',
                      borderRadius: '9999px',
                      fontFamily: 'Cormorant Garamond,serif',
                      fontSize: '1.05rem',
                      cursor: 'pointer',
                      border: '1px solid rgba(114,199,255,0.3)',
                      background: 'transparent',
                      color: 'rgba(114,199,255,0.72)',
                      letterSpacing: '.02em',
                    }}
                    whileHover={{ borderColor: 'rgba(114,199,255,0.65)', color: '#72C7FF', scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setAnswer('no')}
                  >{proposalContent.noButton}</motion.button>
                </motion.div>
              </motion.div>
            )}

            {/* ── RESPUESTA SÍ ─────────────────────────────────── */}
            {answer === 'yes' && (
              <motion.div key="yes"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.2rem', maxWidth: '580px' }}
                initial={{ opacity: 0, scale: 0.88, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0)' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4 }}
              >
                {/* Corazones animados en fila */}
                <motion.div style={{ display: 'flex', gap: '0.8rem', fontSize: '2.8rem' }}>
                  {['💙','💙','💙'].map((h, i) => (
                    <motion.span key={i}
                      animate={{ scale: [1, 1.45, 1], y: [0, -10, 0] }}
                      transition={{ duration: 1.6, delay: i * 0.22, repeat: Infinity, repeatDelay: 1.5 }}
                    >{h}</motion.span>
                  ))}
                </motion.div>

                {/* Líneas de respuesta */}
                {proposalContent.yesResponse.lines.map((line, i) => (
                  <motion.p key={i}
                    className="font-cormorant"
                    style={{ fontSize: 'clamp(1.1rem,2.6vw,1.3rem)', color: 'rgba(228,242,255,0.92)', lineHeight: 1.75, textAlign: 'center' }}
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4 + i * 0.45 }}
                  >{line}</motion.p>
                ))}

                {/* Cierre */}
                <motion.p
                  className="ff-script"
                  style={{ fontSize: '1.6rem', color: '#72C7FF', textShadow: '0 0 18px rgba(114,199,255,0.55)' }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1.8 }}
                >
                  {proposalContent.yesResponse.closing}
                </motion.p>

                {/* Estrellas decorativas */}
                <motion.div
                  style={{ display: 'flex', gap: '1.2rem', opacity: 0.65 }}
                  initial={{ opacity: 0 }} animate={{ opacity: 0.65 }}
                  transition={{ duration: 1.2, delay: 2.2 }}
                >
                  {['✨','💙','⭐','💙','✨'].map((s, i) => (
                    <motion.span key={i} style={{ fontSize: '1.1rem' }}
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                    >{s}</motion.span>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* ── RESPUESTA NO ──────────────────────────────────── */}
            {answer === 'no' && (
              <motion.div key="no"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', maxWidth: '520px' }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div style={{
                  padding: '2.5rem', borderRadius: '1.25rem',
                  background: 'linear-gradient(135deg,rgba(7,17,31,0.92),rgba(11,31,58,0.78))',
                  border: '1px solid rgba(49,133,255,0.25)',
                  boxShadow: '0 0 32px rgba(49,133,255,0.1)',
                  textAlign: 'center',
                }}>
                  <p className="font-cormorant" style={{ fontSize: '1.5rem', color: '#72C7FF', marginBottom: '1.5rem' }}>
                    {proposalContent.noResponse.title}
                  </p>
                  {proposalContent.noResponse.lines.map((line, i) => (
                    <motion.p key={i}
                      className="font-cormorant"
                      style={{ fontSize: '1.12rem', color: 'rgba(228,242,255,0.85)', lineHeight: 1.75, marginBottom: '.75rem' }}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: .7, delay: i * .22 }}
                    >{line}</motion.p>
                  ))}
                </div>
                <motion.button
                  style={{ padding: '.75rem 2rem', borderRadius: '9999px', fontFamily: 'Cormorant Garamond,serif', fontSize: '1.05rem', cursor: 'pointer', border: '1px solid rgba(114,199,255,0.3)', background: 'transparent', color: '#72C7FF' }}
                  whileHover={{ scale: 1.04, borderColor: 'rgba(114,199,255,0.6)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setAnswer(null)}
                >{proposalContent.noResponse.backButton}</motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  )
}
