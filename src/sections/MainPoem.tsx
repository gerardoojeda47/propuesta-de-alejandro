import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import StarField from '../components/StarField'
import ShootingStars from '../components/ShootingStars'
import AuroraBackground from '../components/AuroraBackground'
import RomanticButton from '../components/RomanticButton'
import { poemContent } from '../data/romanticContent'

interface MainPoemProps { onContinue: () => void }

function PoemLine({ line, i, inView }: { line: string; i: number; inView: boolean }) {
  if (line === '') return <div style={{ height: '.9rem' }} />
  const special = ['Mónica,', 'Le hablaría de ti.', 'Quiero seguir descubriéndote,', 'Pediría algo sencillo,'].includes(line)
  return (
    <motion.p
      className="font-cormorant"
      style={{
        fontSize: 'clamp(1rem,2.3vw,1.2rem)',
        lineHeight: 1.85,
        textAlign: 'center',
        color: special ? '#72C7FF' : 'rgba(228,242,255,.9)',
        fontStyle: special ? 'italic' : 'normal',
        textShadow: special ? '0 0 10px rgba(114,199,255,.3)' : 'none',
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: .65, delay: Math.min(i * .055, 3), ease: 'easeOut' }}
    >{line}</motion.p>
  )
}

export default function MainPoem({ onContinue }: MainPoemProps) {
  const ref    = useRef(null)
  const endRef = useRef(null)
  const inView    = useInView(ref,    { once: true, margin: '-5%' })
  const endInView = useInView(endRef, { once: true, margin: '-5%' })

  return (
    <section style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg,rgba(3,5,11,0.72) 0%,#07111F 15%,#0B1F3A 50%,#07111F 85%,#03050B 100%)', minHeight: '100vh', padding: '5rem 1.5rem' }}>
      <StarField count={200} />
      <ShootingStars count={4} />
      <AuroraBackground intensity={0.5} />

      {/* Galaxia central */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 'min(700px,85vw)', height: 'min(700px,85vw)', background: 'radial-gradient(ellipse at 40% 40%,rgba(18,58,112,.18) 0%,rgba(49,133,255,.05) 40%,transparent 70%)', borderRadius: '50%', filter: 'blur(25px)', pointerEvents: 'none', zIndex: 0, animation: 'nebulaPulse 14s ease-in-out infinite' }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>

        {/* Luna decorativa + título */}
        <motion.div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem', marginBottom: '2.5rem' }}
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
        >
          <motion.div
            style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'radial-gradient(ellipse at 35% 35%,#E8F8FF,#72C7FF,#3185FF)', boxShadow: '0 0 30px rgba(114,199,255,.55)' }}
            animate={{ boxShadow: ['0 0 20px rgba(114,199,255,.4)','0 0 50px rgba(114,199,255,.85)','0 0 20px rgba(114,199,255,.4)'] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <h2 className="font-cormorant text-gradient-shimmer" style={{ fontSize: 'clamp(1.6rem,4.5vw,2.9rem)', fontWeight: 300, textAlign: 'center', lineHeight: 1.2 }}>
            {poemContent.title}
          </h2>
          <motion.div className="divider-glow"
            style={{ width: 0 }}
            whileInView={{ width: '100%' }} viewport={{ once: true }}
            transition={{ duration: 1.6, delay: .5 }}
          />
        </motion.div>

        {/* Líneas del poema */}
        <div ref={ref} style={{ width: '100%' }}>
          {poemContent.lines.map((line, i) => (
            <PoemLine key={i} line={line} i={i} inView={inView} />
          ))}
        </div>

        {/* Estrella fugaz al final */}
        <motion.div ref={endRef} style={{ position: 'relative', width: '100%', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2.5rem' }}
          initial={{ opacity: 0 }} animate={endInView ? { opacity: 1 } : {}} transition={{ duration: .8 }}
        >
          <motion.div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#72C7FF', boxShadow: '0 0 18px #72C7FF', position: 'absolute' }}
            animate={{ x: ['-100px','100px'], y: ['-30px','30px'], opacity: [0,1,0] }}
            transition={{ duration: 2.2, delay: .8, repeat: Infinity, repeatDelay: 5 }}
          />
          <motion.div style={{ height: '1px', width: '0px', background: 'linear-gradient(90deg,transparent,rgba(114,199,255,.6),transparent)', position: 'absolute', transform: 'rotate(17deg)' }}
            animate={{ width: ['0px','80px','0px'] }}
            transition={{ duration: 2.2, delay: 1.1, repeat: Infinity, repeatDelay: 5 }}
          />
        </motion.div>

        {/* Cierre */}
        <motion.p className="ff-script" style={{ fontSize: 'clamp(1.1rem,2.8vw,1.55rem)', color: '#72C7FF', textAlign: 'center', marginTop: '.5rem' }}
          initial={{ opacity: 0, y: 14 }} animate={endInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: .6 }}
        >
          {poemContent.endText}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={endInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 1.1 }} style={{ marginTop: '1.2rem' }}>
          <RomanticButton onClick={onContinue} variant="primary" size="md">
            {poemContent.buttonText}
          </RomanticButton>
        </motion.div>
      </div>
    </section>
  )
}
