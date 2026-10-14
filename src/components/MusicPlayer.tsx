import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react'

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.4)
  const [isExpanded, setIsExpanded] = useState(false)
  const [hasAudio, setHasAudio] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = volume

    const handleCanPlay = () => setHasAudio(true)
    const handleError = () => setHasAudio(false)

    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('error', handleError)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = isMuted ? 0 : volume
  }, [volume, isMuted])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio || !hasAudio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch(() => setHasAudio(false))
    }
    setIsPlaying(!isPlaying)
  }

  if (!hasAudio) {
    return (
      <>
        <audio ref={audioRef} loop src="/music/romantic.mp3" preload="auto" />
        <motion.div
          className="fixed bottom-4 left-4 z-40 rounded-full p-3 opacity-30 cursor-not-allowed"
          style={{
            background: 'rgba(7,17,31,0.8)',
            border: '1px solid rgba(49,133,255,0.2)',
          }}
          title="Agrega /public/music/romantic.mp3 para habilitar la música"
        >
          <Music size={16} color="#72C7FF" />
        </motion.div>
      </>
    )
  }

  return (
    <>
      <audio ref={audioRef} loop src="/music/romantic.mp3" preload="auto" />

      <motion.div
        className="fixed bottom-4 left-4 z-40 rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(7,17,31,0.9)',
          border: '1px solid rgba(49,133,255,0.3)',
          backdropFilter: 'blur(10px)',
        }}
        animate={{ width: isExpanded ? 220 : 48, height: 48 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="flex items-center h-full px-3 gap-3">
          {/* Botón principal */}
          <motion.button
            onClick={togglePlay}
            className="flex-shrink-0 flex items-center justify-center rounded-full"
            style={{
              width: '28px',
              height: '28px',
              background: isPlaying
                ? 'rgba(49,133,255,0.4)'
                : 'rgba(49,133,255,0.2)',
              border: '1px solid rgba(49,133,255,0.5)',
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isPlaying ? (
              <Pause size={12} color="#72C7FF" />
            ) : (
              <Play size={12} color="#72C7FF" />
            )}
          </motion.button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                className="flex items-center gap-2 flex-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Ecualizador animado */}
                {isPlaying && (
                  <div className="flex items-end gap-0.5 h-5">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        className="rounded-full"
                        style={{
                          width: '3px',
                          background: '#3185FF',
                        }}
                        animate={{ height: ['6px', '14px', '8px', '16px', '6px'] }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.15,
                          ease: 'easeInOut',
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Volumen */}
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="flex-1 h-1 rounded-full cursor-pointer accent-blue-400"
                  style={{ accentColor: '#3185FF' }}
                />

                {/* Mute */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="flex-shrink-0"
                >
                  {isMuted ? (
                    <VolumeX size={14} color="#72C7FF" />
                  ) : (
                    <Volume2 size={14} color="#72C7FF" />
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle expand */}
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-shrink-0"
            whileHover={{ scale: 1.1 }}
          >
            <Music size={14} color={isPlaying ? '#3185FF' : '#72C7FF'} />
          </motion.button>
        </div>
      </motion.div>
    </>
  )
}
