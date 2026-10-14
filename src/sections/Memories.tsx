import { motion } from 'framer-motion'
import StarField from '../components/StarField'
import PhotoGallery from '../components/PhotoGallery'
import AuroraBackground from '../components/AuroraBackground'

export default function Memories() {
  return (
    <section className="section-base" style={{ background: 'linear-gradient(180deg,rgba(7,17,31,0.75) 0%,#03050B 55%,#07111F 100%)', minHeight: '100vh', padding: '6rem 1.5rem' }}>
      <StarField count={90} twinkleMode="slow" />
      <AuroraBackground intensity={0.4} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '920px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem' }}>

        {/* Encabezado */}
        <motion.div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '.8rem', alignItems: 'center' }}
          initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
        >
          <p className="ff-script" style={{ fontSize: '1.1rem', color: 'rgba(114,199,255,.55)', letterSpacing: '.08em' }}>
            momentos guardados
          </p>
          <h2 className="font-cormorant text-gradient" style={{ fontSize: 'clamp(1.8rem,5vw,3rem)', fontWeight: 300 }}>
            Momentos que quiero recordar
          </h2>
          <motion.div className="divider-glow"
            style={{ width: 0 }}
            whileInView={{ width: '60%' }} viewport={{ once: true }}
            transition={{ duration: 1.4 }}
          />
        </motion.div>

        <PhotoGallery />

      </div>
    </section>
  )
}
