import { useState, useCallback, useRef } from 'react'
import '../App.css'
import { LanguageSelector, useI18n } from '../i18n'

const CONNECTION_CODE = 'BREACH'

type Stage = 'code' | 'ready' | 'playing' | 'done'

// Morse sequence: O R S V
// O = ---   R = .-.   S = ...   V = ...-
const MORSE_SEQUENCE: ('dot' | 'dash' | 'gap' | 'pause')[] = [
  // O: ---
  'dash', 'gap', 'dash', 'gap', 'dash',
  'pause',
  // R: .-.
  'dot', 'gap', 'dash', 'gap', 'dot',
  'pause',
  // S: ...
  'dot', 'gap', 'dot', 'gap', 'dot',
  'pause',
  // V: ...-
  'dot', 'gap', 'dot', 'gap', 'dot', 'gap', 'dash',
]

const DOT_MS = 100
const DASH_MS = 300
const GAP_MS = 100
const PAUSE_MS = 300

function playMorse(onDone: () => void) {
  const ctx = new AudioContext()
  let time = ctx.currentTime + 0.05

  for (const sym of MORSE_SEQUENCE) {
    if (sym === 'dot' || sym === 'dash') {
      const dur = sym === 'dot' ? DOT_MS / 1000 : DASH_MS / 1000
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
    } else if (sym === 'pause') {
      time += PAUSE_MS / 1000
    }
  }

  // Schedule callback after sequence ends
  const totalMs = (time - ctx.currentTime) * 1000 + 100
  setTimeout(() => {
    ctx.close()
    onDone()
  }, totalMs)
}

export default function PatientDataLeakScreen1() {
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

  const handlePlay = useCallback(() => {
    if (playingRef.current) return
    playingRef.current = true
    setStage('playing')
    playMorse(() => {
      playingRef.current = false
      setStage('done')
    })
  }, [])

  const handleReplay = useCallback(() => {
    if (playingRef.current) return
    playingRef.current = true
    setStage('playing')
    playMorse(() => {
      playingRef.current = false
      setStage('done')
    })
  }, [])

  const title = t('routes.patientDataLeakRoom.screen1.title')

  return (
    <div className="app">
      <div className="scanlines" aria-hidden />
      <LanguageSelector />

      {stage === 'code' && (
        <div className="overlay">
          <div className="overlay-content">
            <h2>{t('routes.patientDataLeakRoom.screen1.codeOverlay.title')}</h2>
            <form className="access" onSubmit={handleCodeSubmit}>
              <label>{t('routes.patientDataLeakRoom.screen1.codeOverlay.title')}</label>
              <input
                type="text"
                placeholder={t('routes.patientDataLeakRoom.screen1.codeOverlay.placeholder')}
                value={codeInput}
                onChange={e => { setCodeInput(e.target.value); setCodeError(false) }}
                autoFocus
              />
              <button type="submit">{t('routes.patientDataLeakRoom.screen1.codeOverlay.submit')}</button>
            </form>
            {codeError && (
              <p className="feedback danger">{t('routes.patientDataLeakRoom.screen1.codeOverlay.error')}</p>
            )}
          </div>
        </div>
      )}

      {stage !== 'code' && (
        <>
          <header className="header">
            <h1 className="glitch" data-text={title}>{title}</h1>
          </header>
          <section className="panel" style={{ textAlign: 'center', display: 'grid', placeItems: 'center', minHeight: '40vh' }}>
            {stage === 'ready' && (
              <button className="pdl-start" onClick={handlePlay}>
                {t('routes.patientDataLeakRoom.screen1.play')}
              </button>
            )}
            {stage === 'playing' && (
              <button className="pdl-start" disabled style={{ opacity: 0.4, cursor: 'not-allowed' }}>
                {t('routes.patientDataLeakRoom.screen1.play')}
              </button>
            )}
            {stage === 'done' && (
              <button className="pdl-start" onClick={handleReplay}>
                {t('routes.patientDataLeakRoom.screen1.replay')}
              </button>
            )}
          </section>
        </>
      )}
    </div>
  )
}
