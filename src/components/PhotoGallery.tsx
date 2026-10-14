import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { memoriesContent } from '../data/romanticContent'

/* ── Lightbox ─────────────────────────────────────────────────── */
function Lightbox({
  photos,
  index,
  onClose,
}: {
  photos: { src: string; caption: string }[]
  index: number
  onClose: () => void
}) {
  const [cur, setCur] = useState(index)
  const prev = () => setCur((c) => (c - 1 + photos.length) % photos.length)
  const next = () => setCur((c) => (c + 1) % photos.length)

  return (
    <motion.div
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(3,5,11,.96)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem',
      }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        style={{ position: 'relative', maxWidth: '820px', width: '100%' }}
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={cur}
            src={photos[cur].src}
            alt={photos[cur].caption}
            style={{ width: '100%', borderRadius: '1rem', maxHeight: '70vh', objectFit: 'contain', border: '1px solid rgba(49,133,255,.2)', boxShadow: '0 0 60px rgba(49,133,255,.15)' }}
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </AnimatePresence>

        <p style={{ textAlign: 'center', marginTop: '1rem', fontFamily: 'Dancing Script, cursive', fontSize: '1.15rem', color: '#72C7FF' }}>
          {photos[cur].caption}
        </p>

        {/* Controles */}
        {photos.length > 1 && (
          <>
            <button onClick={prev} style={{ position: 'absolute', left: '-2.5rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(49,133,255,.2)', border: '1px solid rgba(49,133,255,.4)', color: '#72C7FF', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>‹</button>
            <button onClick={next} style={{ position: 'absolute', right: '-2.5rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(49,133,255,.2)', border: '1px solid rgba(49,133,255,.4)', color: '#72C7FF', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>›</button>
          </>
        )}

        {/* Cerrar */}
        <button onClick={onClose} style={{ position: 'absolute', top: '-1.5rem', right: 0, color: 'rgba(114,199,255,.6)', background: 'none', border: 'none', fontSize: '1.3rem', letterSpacing: '.1em' }}>cerrar ×</button>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '1rem' }}>
          {photos.map((_, i) => (
            <button key={i} onClick={() => setCur(i)}
              style={{ width: '6px', height: '6px', borderRadius: '50%', border: 'none', background: i === cur ? '#3185FF' : 'rgba(114,199,255,.3)', boxShadow: i === cur ? '0 0 8px #3185FF' : 'none' }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── Photo card ───────────────────────────────────────────────── */
function Card({
  src, caption, delay = 0, style = {}, onOpen,
}: {
  src: string; caption: string; delay?: number; style?: React.CSSProperties; onOpen: () => void
}) {
  const [err, setErr] = useState(false)
  const [loaded, setLoaded] = useState(false)

  return (
    <motion.div
      onClick={onOpen}
      style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px', cursor: 'zoom-in', background: 'linear-gradient(135deg,rgba(11,31,58,.9),rgba(18,58,112,.4))', ...style }}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-4%' }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      whileHover={{ scale: 1.025, zIndex: 10 }}
    >
      <motion.div
        style={{ width: '100%', height: '100%' }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5 + delay * 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {err ? (
          /* Placeholder elegante */
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '2rem', opacity: 0.35 }}>💙</span>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '.8rem', color: 'rgba(114,199,255,.45)', textAlign: 'center', padding: '0 1rem', lineHeight: 1.4 }}>{caption}</p>
          </div>
        ) : (
          <>
            {!loaded && (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.5rem', opacity: 0.25 }}>💙</span>
              </div>
            )}
            <img src={src} alt={caption}
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: loaded ? 1 : 0, transition: 'opacity .5s', position: loaded ? 'static' : 'absolute', inset: 0 }}
              onLoad={() => setLoaded(true)}
              onError={() => setErr(true)}
            />
          </>
        )}

        {/* Caption — siempre visible en mobile, hover en desktop */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '.55rem .75rem',
          background: 'linear-gradient(transparent, rgba(3,5,11,.85))',
        }}>
          <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '.85rem', color: '#C5E7FF', lineHeight: 1.3 }}>{caption}</p>
        </div>

        {/* Borde luminoso al hover */}
        <motion.div
          style={{ position: 'absolute', inset: 0, borderRadius: '12px', border: '1px solid rgba(49,133,255,0)', pointerEvents: 'none' }}
          whileHover={{ border: '1px solid rgba(49,133,255,.55)', boxShadow: '0 0 20px rgba(49,133,255,.2) inset' }}
        />
      </motion.div>
    </motion.div>
  )
}

/* ── Galería principal ────────────────────────────────────────── */
export default function PhotoGallery() {
  const photos = memoriesContent.photos
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const open = useCallback((i: number) => setLightboxIdx(i), [])
  const close = useCallback(() => setLightboxIdx(null), [])

  return (
    <>
      {/* Grid artístico */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 200px)',
        gap: '12px',
        width: '100%',
        maxWidth: '860px',
        margin: '0 auto',
        padding: '0 1rem',
      }}
        className="gallery-grid"
      >
        {/* Foto 1 — principal grande */}
        <Card src={photos[0].src} caption={photos[0].caption} delay={0}
          style={{ gridColumn: '1/3', gridRow: '1/3', border: '1px solid rgba(49,133,255,.2)', boxShadow: '0 0 30px rgba(49,133,255,.1)' }}
          onOpen={() => open(0)}
        />

        {/* Foto 2 — vertical derecha */}
        <Card src={photos[1].src} caption={photos[1].caption} delay={0.15}
          style={{ gridColumn: '3/4', gridRow: '1/3', border: '2px solid rgba(49,133,255,.3)', boxShadow: '0 0 20px rgba(49,133,255,.18)' }}
          onOpen={() => open(1)}
        />

        {/* Foto 3 — polaroid inclinado */}
        <Card src={photos[2].src} caption={photos[2].caption} delay={0.25}
          style={{ gridColumn: '1/2', gridRow: '3/4', border: '6px solid rgba(244,248,255,.06)', borderBottom: '22px solid rgba(244,248,255,.06)', transform: 'rotate(-1.2deg)', boxShadow: '0 4px 20px rgba(0,0,0,.4)' }}
          onOpen={() => open(2)}
        />

        {/* Foto 4 */}
        <Card src={photos[3].src} caption={photos[3].caption} delay={0.35}
          style={{ gridColumn: '2/3', gridRow: '3/4', border: '1px solid rgba(114,199,255,.22)', transform: 'rotate(.8deg)', boxShadow: '0 4px 16px rgba(0,0,0,.3)' }}
          onOpen={() => open(3)}
        />

        {/* Foto 5 */}
        <Card src={photos[4].src} caption={photos[4].caption} delay={0.45}
          style={{ gridColumn: '3/4', gridRow: '3/4', border: '1px solid rgba(114,199,255,.2)', transform: 'rotate(-0.6deg)', boxShadow: '0 4px 16px rgba(0,0,0,.3)' }}
          onOpen={() => open(4)}
        />
      </div>

      {/* Nota instrucción */}
      <motion.p
        style={{ textAlign: 'center', marginTop: '1.5rem', fontFamily: 'Cormorant Garamond, serif', fontSize: '.8rem', color: 'rgba(114,199,255,.3)', fontStyle: 'italic' }}
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        Coloca tus fotos en /public/images/ (monica1.jpg → monica5.jpg) · Toca para ampliar
      </motion.p>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox photos={photos} index={lightboxIdx} onClose={close} />
        )}
      </AnimatePresence>

      {/* Responsive grid */}
      <style>{`
        @media (max-width: 640px) {
          .gallery-grid {
            grid-template-columns: 1fr 1fr !important;
            grid-template-rows: repeat(4, 160px) !important;
          }
          .gallery-grid > *:first-child { grid-column: 1/3 !important; grid-row: 1/2 !important; }
          .gallery-grid > *:nth-child(2) { grid-column: 1/3 !important; grid-row: 2/3 !important; }
          .gallery-grid > *:nth-child(3) { grid-column: 1/2 !important; grid-row: 3/4 !important; transform: none !important; }
          .gallery-grid > *:nth-child(4) { grid-column: 2/3 !important; grid-row: 3/4 !important; transform: none !important; }
          .gallery-grid > *:nth-child(5) { grid-column: 1/3 !important; grid-row: 4/5 !important; transform: none !important; }
        }
      `}</style>
    </>
  )
}
