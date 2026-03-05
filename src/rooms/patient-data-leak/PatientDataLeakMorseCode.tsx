import { useState, useCallback, useRef } from 'react'
import '../../App.css'
import { LanguageSelector, useI18n } from '../../i18n.tsx'

const CONNECTION_CODE = 'GO8A1PF'

type Stage = 'code' | 'ready' | 'playing' | 'done'

// ITU International Morse Code: 2015
const MORSE_MAP: Record<string, string> = {
  '2': '..---', '0': '-----', '1': '.----', '5': '.....',
}

type Symbol = 'dot' | 'dash' | 'gap' | 'charBreak'

function buildSequence(text: string): Symbol[] {
  const seq: Symbol[] = []
  for (let i = 0; i < text.length; i++) {
    const pattern = MORSE_MAP[text[i]]
    if (!pattern) continue
    if (seq.length > 0) seq.push('charBreak')
    for (let j = 0; j < pattern.length; j++) {
      if (j > 0) seq.push('gap')
      seq.push(pattern[j] === '.' ? 'dot' : 'dash')
    }
  }
  return seq
}

const MORSE_SEQUENCE = buildSequence('go8a1pf2')

// Timing: ~200ms unit, slower with clear inter-character breaks
const DOT_MS = 200
const DASH_MS = 600
const GAP_MS = 200       // intra-character
const CHAR_BREAK_MS = 700 // inter-character

function playMorse(onDone: () => void) {
  const ctx = new AudioContext()
  let time = ctx.currentTime + 0.05

  for (const sym of MORSE_SEQUENCE) {
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

export default function PatientDataLeakMorseCode() {
  const { t } = useI18n()
  const [stage, setStage] = useState<Stage>('code')
  const [codeInput, setCodeInput] = useState('')
  const [codeError, setCodeError] = useState(false)
  const playingRef = useRef(false)

  const handleCodeSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (codeInput.trim().toUpperCase() === CONNECTION_CODE) {
      setCodeError(false)
      setStage('ready')
    } else {
      setCodeError(true)
    }
  }, [codeInput])

  const startPlaying = useCallback(() => {
    if (playingRef.current) return
    playingRef.current = true
    setStage('playing')
    playMorse(() => {
      playingRef.current = false
      setStage('done')
    })
  }, [])

  return (
    <>
      {stage === 'code' && (
        <div className="overlay">
          <LanguageSelector />
          <div className="overlay-content">
            <h2>{t('routes.patientDataLeakRoom.morseCode.codeOverlay.title')}</h2>
            <form className="access" onSubmit={handleCodeSubmit}>
              <input
                type="text"
                placeholder={t('routes.patientDataLeakRoom.morseCode.codeOverlay.placeholder')}
                value={codeInput}
                onChange={e => { setCodeInput(e.target.value); setCodeError(false) }}
                autoFocus
              />
              <button type="submit">{t('routes.patientDataLeakRoom.morseCode.codeOverlay.submit')}</button>
            </form>
            {codeError && (
              <p className="feedback danger">{t('routes.patientDataLeakRoom.morseCode.codeOverlay.error')}</p>
            )}
          </div>
        </div>
      )}

      {stage !== 'code' && (
        <div className="pdl-black">
          <LanguageSelector />
          {stage === 'ready' && (
            <button className="pdl-start" onClick={startPlaying}>
              {t('routes.patientDataLeakRoom.morseCode.play')}
            </button>
          )}
          {stage === 'playing' && (
            <button className="pdl-start" disabled style={{ opacity: 0.4, cursor: 'not-allowed' }}>
              {t('routes.patientDataLeakRoom.morseCode.play')}
            </button>
          )}
          {stage === 'done' && (
            <button className="pdl-start" onClick={startPlaying}>
              {t('routes.patientDataLeakRoom.morseCode.replay')}
            </button>
          )}
        </div>
      )}
    </>
  )
}
