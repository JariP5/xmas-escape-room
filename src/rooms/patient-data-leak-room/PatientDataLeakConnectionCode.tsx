import { useState, useEffect, useCallback } from 'react'
import '../../App.css'
import { LanguageSelector, useI18n } from '../../i18n.tsx'
import { getChannel } from '../../supabaseClient.ts'

const CODE_LETTERS = 'go8a1pf2'.split('')

// Duration of one letter's flicker-in + hold + fade-out (matches CSS animation)
const LETTER_ANIM_MS = 2500
// Dark pause between letters
const PAUSE_MS = 1000
// Total cycle = all letters shown once in random order
const STEP_MS = LETTER_ANIM_MS + PAUSE_MS

// ITU 2015 Morse code reference: a-z and 0-9
const MORSE_REFERENCE: { char: string; morse: string }[] = [
  { char: 'A', morse: '.-' },
  { char: 'B', morse: '-...' },
  { char: 'C', morse: '-.-.' },
  { char: 'D', morse: '-..' },
  { char: 'E', morse: '.' },
  { char: 'F', morse: '..-.' },
  { char: 'G', morse: '--.' },
  { char: 'H', morse: '....' },
  { char: 'I', morse: '..' },
  { char: 'J', morse: '.---' },
  { char: 'K', morse: '-.-' },
  { char: 'L', morse: '.-..' },
  { char: 'M', morse: '--' },
  { char: 'N', morse: '-.' },
  { char: 'O', morse: '---' },
  { char: 'P', morse: '.--.' },
  { char: 'Q', morse: '--.-' },
  { char: 'R', morse: '.-.' },
  { char: 'S', morse: '...' },
  { char: 'T', morse: '-' },
  { char: 'U', morse: '..-' },
  { char: 'V', morse: '...-' },
  { char: 'W', morse: '.--' },
  { char: 'X', morse: '-..-' },
  { char: 'Y', morse: '-.--' },
  { char: 'Z', morse: '--..' },
  { char: '0', morse: '-----' },
  { char: '1', morse: '.----' },
  { char: '2', morse: '..---' },
  { char: '3', morse: '...--' },
  { char: '4', morse: '....-' },
  { char: '5', morse: '.....' },
  { char: '6', morse: '-....' },
  { char: '7', morse: '--...' },
  { char: '8', morse: '---..' },
  { char: '9', morse: '----.' },
]

type Stage = 'code' | 'morse'

function useLoopingReveal() {
  const [activePos, setActivePos] = useState(-1)
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
        order = shuffle()
        setCycle(c => c + 1)
      }
      setActivePos(order[idx])
      step++
    }

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

function MorseReferenceChart() {
  const { t } = useI18n()

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem 1rem',
      maxHeight: '100dvh',
      overflow: 'auto',
    }}>
      <h2 style={{
        color: 'var(--muted)',
        fontSize: 'clamp(1rem, 3vw, 1.4rem)',
        letterSpacing: '.15em',
        textTransform: 'uppercase',
        marginBottom: '1.5rem',
      }}>
        {t('routes.patientDataLeakRoom.connectionCode.morseReference')}
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(7rem, 1fr))',
        gap: '0.5rem',
        width: '100%',
        maxWidth: '40rem',
      }}>
        {MORSE_REFERENCE.map(({ char, morse }) => (
          <div key={char} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.4rem 0.7rem',
            borderRadius: '4px',
            background: 'rgba(255,255,255,0.04)',
          }}>
            <span style={{
              fontWeight: 700,
              fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
              color: '#fff',
              width: '1.5em',
              textAlign: 'center',
            }}>{char}</span>
            <span style={{
              fontFamily: 'monospace',
              fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
              color: 'var(--muted)',
              letterSpacing: '.15em',
            }}>{morse}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function PatientDataLeakConnectionCode() {
  const { t } = useI18n()
  const { activePos, cycle } = useLoopingReveal()
  const [stage, setStage] = useState<Stage>('code')

  useEffect(() => {
    const channel = getChannel('pdl-sync')

    channel
      .on('broadcast', { event: 'code-accepted' }, () => {
        setStage('morse')
      })
      .subscribe()

    return () => { channel.unsubscribe() }
  }, [])

  return (
    <div className="pdl-black">
      <LanguageSelector />
      {stage === 'code' && (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{
            color: 'var(--muted)',
            fontSize: 'clamp(1rem, 3vw, 1.4rem)',
            letterSpacing: '.15em',
            textTransform: 'uppercase',
            marginBottom: '2rem',
          }}>
            {t('routes.patientDataLeakRoom.connectionCode.title')}
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
      )}
      {stage === 'morse' && <MorseReferenceChart />}
    </div>
  )
}
