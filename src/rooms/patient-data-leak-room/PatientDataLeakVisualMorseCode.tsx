import { useState, useEffect, useCallback } from 'react'
import '../../App.css'
import { LanguageSelector, useI18n } from '../../i18n.tsx'
import { getChannel } from '../../supabaseClient.ts'
import {PATIENT_DATA_LEAK_CONNECTION_CODE} from "./constants.ts";

const CODE_LETTERS = PATIENT_DATA_LEAK_CONNECTION_CODE.split('')

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

const LETTERS = MORSE_REFERENCE.filter(({ char }) => /[A-Z]/.test(char))
const DIGITS = MORSE_REFERENCE.filter(({ char }) => /[0-9]/.test(char))

function MorseSymbols({ morse }: { morse: string }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
      {morse.split('').map((s, i) =>
        s === '.' ? (
          <span key={i} style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#6ee7b7',
            flexShrink: 0,
          }} />
        ) : (
          <span key={i} style={{
            width: '24px',
            height: '8px',
            borderRadius: '4px',
            background: '#6ee7b7',
            flexShrink: 0,
          }} />
        )
      )}
    </span>
  )
}

function MorseReferenceChart() {
  const { t } = useI18n()

  // Split letters into 2 columns (13 + 13), digits as a row below
  const col1 = LETTERS.slice(0, 13) // A-M
  const col2 = LETTERS.slice(13)     // N-Z

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem 1rem',
      height: '100dvh',
      boxSizing: 'border-box',
    }}>
      <h2 style={{
        color: 'var(--muted)',
        fontSize: 'clamp(0.8rem, 2vw, 1.1rem)',
        letterSpacing: '.15em',
        textTransform: 'uppercase',
        margin: '0 0 0.8rem',
      }}>
        {t('routes.patientDataLeakRoom.visualMorseCode.morseReference')}
      </h2>

      <div style={{
        display: 'flex',
        gap: '2px',
        width: '100%',
        maxWidth: '28rem',
        justifyContent: 'center',
      }}>
        {[col1, col2].map((col, ci) => (
          <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
            {col.map(({ char, morse }) => (
              <div key={char} style={{
                display: 'grid',
                gridTemplateColumns: '1.4em 1fr',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.3rem 0.6rem',
                background: 'rgba(255,255,255,0.03)',
              }}>
                <span style={{
                  fontWeight: 700,
                  fontSize: 'clamp(0.85rem, 2vw, 1rem)',
                  color: '#fff',
                  textAlign: 'center',
                  fontFamily: 'monospace',
                }}>{char}</span>
                <MorseSymbols morse={morse} />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{
        width: '50%',
        maxWidth: '14rem',
        height: '1px',
        background: 'rgba(255,255,255,0.08)',
        margin: '0.6rem 0',
      }} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, auto)',
        gap: '2px',
        justifyContent: 'center',
      }}>
        {DIGITS.map(({ char, morse }) => (
          <div key={char} style={{
            display: 'grid',
            gridTemplateColumns: '1.4em 1fr',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.3rem 0.6rem',
            background: 'rgba(255,255,255,0.03)',
          }}>
            <span style={{
              fontWeight: 700,
              fontSize: 'clamp(0.85rem, 2vw, 1rem)',
              color: '#fff',
              textAlign: 'center',
              fontFamily: 'monospace',
            }}>{char}</span>
            <MorseSymbols morse={morse} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function PatientDataLeakVisualMorseCode() {
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
            {t('routes.patientDataLeakRoom.visualMorseCode.codeOverlay.title')}
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
