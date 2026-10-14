import { motion } from 'framer-motion'
import StarField from '../components/StarField'
import RomanticButton from '../components/RomanticButton'
import { finalLetterContent } from '../data/romanticContent'

export default function FinalLetter() {
  return (
    <section className="section-base" style={{ background: 'linear-gradient(180deg,rgba(3,5,11,0.72) 0%,#07111F 50%,#03050B 100%)', minHeight: '100vh', padding: '6rem 1.5rem' }}>
      <StarField count={90} twinkleMode="slow" />

      {/* Bruma */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%,rgba(18,58,112,.12) 0%,transparent 65%)', filter: 'blur(30px)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '600px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>

        {/* Título */}
        <motion.h2 className="font-cormorant text-gradient" style={{ fontSize: 'clamp(1.6rem,4vw,2.5rem)', fontWeight: 300, textAlign: 'center' }}
          initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
        >
          {finalLetterContent.title}
        </motion.h2>

        {/* Card de carta */}
        <motion.div
          className="glass"
          style={{ width: '100%', borderRadius: '1.25rem', padding: 'clamp(1.8rem,5vw,3rem)' }}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1 }}
        >
          {/* Saludo */}
          <motion.p className="ff-script" style={{ fontSize: '1.6rem', color: '#72C7FF', marginBottom: '1.5rem' }}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: .8, delay: .3 }}
          >
            Mónica,
          </motion.p>

          {/* Párrafos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {finalLetterContent.paragraphs.map((txt, i) => (
              <motion.p key={i} className="font-cormorant"
                style={{ fontSize: 'clamp(1rem,2.3vw,1.15rem)', lineHeight: 1.8, color: 'rgba(228,242,255,.86)' }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: .7, delay: .3 + i * .08 }}
              >{txt}</motion.p>
            ))}
          </div>

          {/* Firma */}
          <motion.div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(49,133,255,.14)' }}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: .8, delay: 1 }}
          >
            <p className="font-cormorant" style={{ fontSize: '.95rem', color: 'rgba(197,231,255,.55)' }}>{finalLetterContent.closing}</p>
            <p className="ff-script" style={{ fontSize: '1.3rem', color: '#72C7FF', marginTop: '.35rem' }}>{finalLetterContent.signature}</p>
          </motion.div>
        </motion.div>

        {/* Cierre decorativo */}
        <motion.div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.75rem', marginTop: '.5rem' }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: .5 }}
        >
          <div className="divider-glow" style={{ width: '140px' }} />
          <p className="font-cormorant" style={{ fontSize: '.78rem', color: 'rgba(114,199,255,.3)', fontStyle: 'italic', letterSpacing: '.12em' }}>
            una historia escrita en azul
          </p>
        </motion.div>

        {/* Volver al inicio */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: .8 }}>
          <RomanticButton variant="ghost" size="sm" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            ↑ Volver al inicio
          </RomanticButton>
        </motion.div>
      </div>
    </section>
  )
}
