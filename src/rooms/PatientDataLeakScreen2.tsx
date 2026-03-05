import { useState, useEffect, useCallback } from 'react'
import '../App.css'
import { LanguageSelector, useI18n } from '../i18n'

const CODE_LETTERS = 'go8a1pf2'.split('')

// Duration of one letter's flicker-in + hold + fade-out (matches CSS animation)
const LETTER_ANIM_MS = 2500
// Dark pause between letters
const PAUSE_MS = 1000
// Total cycle = all letters shown once in random order
const STEP_MS = LETTER_ANIM_MS + PAUSE_MS

function useLoopingReveal() {
  // Which letter index (position) is currently animating, -1 = none
  const [activePos, setActivePos] = useState(-1)
  // Incremented each cycle to force re-render / new animation
  const [cycle, setCycle] = useState(0)

  const shuffle = useCallback(() => {
    const indices = CODE_LETTERS.map((_, i) => i)
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[indices[i], indices[j]] = [indices[j], indices[i]]
    }
    return indices
  }, [])

  useEffect(() => {
    let order = shuffle()
    let step = 0

    const tick = () => {
      const idx = step % order.length
      if (idx === 0 && step > 0) {
        // New cycle — reshuffle
        order = shuffle()
        setCycle(c => c + 1)
      }
      setActivePos(order[idx])
      step++
    }

    // Show first letter after a short initial delay
    const initialTimeout = setTimeout(() => {
      tick()
    }, 600)

    const interval = setInterval(tick, STEP_MS)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [shuffle])

  return { activePos, cycle }
}

export default function PatientDataLeakScreen2() {
  const { t } = useI18n()
  const { activePos, cycle } = useLoopingReveal()

  return (
    <div className="pdl-black">
      <LanguageSelector />
      <div style={{ textAlign: 'center' }}>
        <h2 style={{
          color: 'var(--muted)',
          fontSize: 'clamp(1rem, 3vw, 1.4rem)',
          letterSpacing: '.15em',
          textTransform: 'uppercase',
          marginBottom: '2rem',
        }}>
          {t('routes.patientDataLeakRoom.screen2.title')}
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(0.8rem, 3vw, 2rem)' }}>
          {CODE_LETTERS.map((letter, i) => (
            <span
              key={`${i}-${cycle}-${activePos === i ? 'on' : 'off'}`}
              className={activePos === i ? 'pdl-code-letter pdl-code-letter--active' : 'pdl-code-letter'}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
