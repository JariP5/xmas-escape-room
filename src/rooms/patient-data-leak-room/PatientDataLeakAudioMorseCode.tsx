import { useState, useCallback, useRef, useEffect } from 'react'
import '../../App.css'
import { LanguageSelector, useI18n } from '../../i18n.tsx'
import { getChannel } from '../../supabaseClient.ts'
import {PATIENT_DATA_LEAK_CONNECTION_CODE} from "./constants.ts";

const MORSE_TEXT = '583'

type Stage = 'code' | 'ready' | 'playing'

// ITU International Morse Code
const MORSE_MAP: Record<string, string> = {
  '5': '.....', '8': '---..', '3': '...--'
}

type Symbol = 'dot' | 'dash' | 'gap' | 'charBreak'

// Build sequence with character index annotations for debug display
function buildAnnotatedSequence(text: string): { sym: Symbol; charIdx: number }[] {
  const seq: { sym: Symbol; charIdx: number }[] = []
  let charIdx = 0
  for (let i = 0; i < text.length; i++) {
    const pattern = MORSE_MAP[text[i]]
    if (!pattern) continue
    if (seq.length > 0) seq.push({ sym: 'charBreak', charIdx })
    for (let j = 0; j < pattern.length; j++) {
      if (j > 0) seq.push({ sym: 'gap', charIdx })
      seq.push({ sym: pattern[j] === '.' ? 'dot' : 'dash', charIdx })
    }
    charIdx++
  }
  return seq
}

const MORSE_SEQUENCE = buildAnnotatedSequence(MORSE_TEXT)

// Characters being encoded (only those in MORSE_MAP)
const MORSE_CHARS = MORSE_TEXT.split('').filter(c => MORSE_MAP[c])

// Timing: ~200ms unit, slower with clear inter-character breaks
const DOT_MS = 300
const DASH_MS = 700
const GAP_MS = 300       // intra-character
const CHAR_BREAK_MS = 900 // inter-character

function playMorse(onCharChange: (charIdx: number) => void, onDone: () => void) {
  const ctx = new AudioContext()
  let time = ctx.currentTime + 0.05
  const startTime = time

  // Schedule character change callbacks
  let lastCharIdx = -1
  for (const { sym, charIdx } of MORSE_SEQUENCE) {
    if (charIdx !== lastCharIdx) {
      const delay = (time - startTime) * 1000
      setTimeout(() => onCharChange(charIdx), delay)
      lastCharIdx = charIdx
    }

    if (sym === 'dot' || sym === 'dash') {
      const dur = (sym === 'dot' ? DOT_MS : DASH_MS) / 1000
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.frequency.value = 600
      osc.type = 'sine'
      osc.connect(gain)
      gain.connect(ctx.destination)
      gain.gain.setValueAtTime(0.4, time)
      gain.gain.setValueAtTime(0, time + dur)
      osc.start(time)
      osc.stop(time + dur)
      time += dur
    } else if (sym === 'gap') {
      time += GAP_MS / 1000
    } else if (sym === 'charBreak') {
      time += CHAR_BREAK_MS / 1000
    }
  }

  const totalMs = (time - ctx.currentTime) * 1000 + 100
  setTimeout(() => {
    ctx.close()
    onDone()
  }, totalMs)
}

export default function PatientDataLeakAudioMorseCode() {
  const { t } = useI18n()
  const [stage, setStage] = useState<Stage>('code')
  const [codeInput, setCodeInput] = useState('')
  const [codeError, setCodeError] = useState(false)
  const [debug, setDebug] = useState(false)
  const [activeCharIdx, setActiveCharIdx] = useState(-1)
  const playingRef = useRef(false)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'd' || e.key === 'D') {
        // Don't toggle when typing in the code input
        if ((e.target as HTMLElement)?.tagName === 'INPUT') return
        setDebug(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const handleCodeSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (codeInput.trim().toUpperCase() === PATIENT_DATA_LEAK_CONNECTION_CODE.toUpperCase()) {
      setCodeError(false)
      setStage('ready')
      getChannel('pdl-sync').send({ type: 'broadcast', event: 'code-accepted', payload: {} })
    } else {
      setCodeError(true)
    }
  }, [codeInput])

  const startPlaying = useCallback(() => {
    if (playingRef.current) return
    playingRef.current = true
    setActiveCharIdx(-1)
    setStage('playing')
    playMorse(
      (charIdx) => setActiveCharIdx(charIdx),
      () => {
        playingRef.current = false
        setActiveCharIdx(-1)
        setStage('ready')
      },
    )
  }, [])

  return (
    <>
      {stage === 'code' && (
        <div className="overlay">
          <LanguageSelector />
          <div className="overlay-content">
            <h2>{t('routes.patientDataLeakRoom.audioMorseCode.codeOverlay.title')}</h2>
            <form className="access" onSubmit={handleCodeSubmit}>
              <input
                type="text"
                placeholder={t('routes.patientDataLeakRoom.audioMorseCode.codeOverlay.placeholder')}
                value={codeInput}
                onChange={e => { setCodeInput(e.target.value); setCodeError(false) }}
                autoFocus
              />
              <button type="submit">{t('routes.patientDataLeakRoom.audioMorseCode.codeOverlay.submit')}</button>
            </form>
            {codeError && (
              <p className="feedback danger">{t('routes.patientDataLeakRoom.audioMorseCode.codeOverlay.error')}</p>
            )}
          </div>
        </div>
      )}

      {stage !== 'code' && (
        <div className="pdl-black">
          <LanguageSelector />
          {stage === 'ready' && (
            <button className="pdl-start" onClick={startPlaying}>
              {t('routes.patientDataLeakRoom.audioMorseCode.play')}
            </button>
          )}
          {stage === 'playing' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
              <button className="pdl-start" disabled style={{ opacity: 0.4, cursor: 'not-allowed' }}>
                {t('routes.patientDataLeakRoom.audioMorseCode.play')}
              </button>
              {debug && activeCharIdx >= 0 && activeCharIdx < MORSE_CHARS.length && (
                <div style={{ textAlign: 'center', color: 'var(--muted)', fontFamily: 'monospace' }}>
                  <p style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', margin: 0, color: '#fff' }}>
                    {MORSE_CHARS[activeCharIdx]}
                  </p>
                  <p style={{ fontSize: 'clamp(1rem, 3vw, 1.6rem)', margin: '.5rem 0 0', letterSpacing: '.3em' }}>
                    {MORSE_MAP[MORSE_CHARS[activeCharIdx]]}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  )
}
