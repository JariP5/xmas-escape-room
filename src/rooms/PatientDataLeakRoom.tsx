import { useEffect, useRef, useState } from 'react'
import '../App.css'
import { LanguageSelector, useI18n } from '../i18n'

type Stage = 'idle' | 'video' | 'blackout' | 'hacked' | 'solved' | 'failed'

const MAX_TRIES = 4

const ONE_HOUR = 60 * 60 * 1000

const RECOVERY_CODE = "1111"

function formatTime(ms: number) {
  if (ms < 0) ms = 0
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(minutes)}:${pad(seconds)}`
}

export default function PatientDataLeakRoom() {
  const { t } = useI18n()
  const [stage, setStage] = useState<Stage>('idle')
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [tries, setTries] = useState(0)
  const [deadlineTs, setDeadlineTs] = useState<number | null>(null)
  const [now, setNow] = useState(Date.now())
  const videoRef = useRef<HTMLVideoElement>(null)

  const timeLeft = deadlineTs ? Math.max(0, deadlineTs - now) : null

  // Auto-play video when entering video stage + allow 's' to skip
  useEffect(() => {
    if (stage !== 'video') return
    videoRef.current?.play()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 's' || e.key === 'S') setStage('blackout')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [stage])

  // Blackout timer → hacked, also start the countdown
  useEffect(() => {
    if (stage !== 'blackout') return
    setDeadlineTs(Date.now() + ONE_HOUR + 1500) // account for blackout duration
    const id = setTimeout(() => setStage('hacked'), 1500)
    return () => clearTimeout(id)
  }, [stage])

  // Tick the countdown every second while active
  useEffect(() => {
    if (stage !== 'hacked' || !deadlineTs) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [stage, deadlineTs])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (stage !== 'hacked') return
    if (input.trim().toLowerCase() === RECOVERY_CODE.trim().toLowerCase()) {
      setStage('solved')
      setFeedback(null)
    } else {
      const next = tries + 1
      setTries(next)
      if (next >= MAX_TRIES) {
        setStage('failed')
      } else {
        const remaining = MAX_TRIES - next
        const triesLeft = remaining === 1
          ? t('routes.patientDataLeakRoom.error.triesLeftOne')
          : t('routes.patientDataLeakRoom.error.triesLeft').replace('{n}', String(remaining))
        setFeedback(t('routes.patientDataLeakRoom.error.badCode') + ' ' + triesLeft)
      }
    }
  }

  // Idle — black screen with start button
  if (stage === 'idle') {
    return (
      <div className="pdl-black">
        <LanguageSelector />
        <button className="pdl-start" onClick={() => setStage('video')}>
          {t('routes.patientDataLeakRoom.start')}
        </button>
      </div>
    )
  }

  // Video
  if (stage === 'video') {
    return (
      <div className="pdl-black">
        <video
          ref={videoRef}
          className="pdl-video"
          src="/assets/patient-data-leak-room/intro.mp4"
          onEnded={() => setStage('blackout')}
          playsInline
          muted={false}
        />
      </div>
    )
  }

  // Blackout
  if (stage === 'blackout') {
    return <div className="pdl-black" />
  }

  // Hacked + Solved
  return (
    <div className="app">
      <div className="scanlines" aria-hidden />
      <LanguageSelector />
      <header className="header">
        <h1 className="glitch" data-text={t('routes.patientDataLeakRoom.hacked.title')}>
          {t('routes.patientDataLeakRoom.hacked.title')}
        </h1>
      </header>

      <section>
        <div className="panel">
          <div className="timer pdl-timer">
            <span className="value" aria-live="polite">{timeLeft != null ? formatTime(timeLeft) : '—:—'}</span>
          </div>

          <p style={{ textAlign: 'center', color: 'var(--danger)', marginTop: '.75rem', fontWeight: 600 }}>
            {t('routes.patientDataLeakRoom.hacked.urgent')}
          </p>
          <p style={{ textAlign: 'center', color: 'var(--muted)', marginTop: '.5rem' }}>
            {t('routes.patientDataLeakRoom.hacked.desc')}
          </p>

          <form className="access" onSubmit={handleSubmit} autoComplete="off">
            <label htmlFor="code">{t('routes.patientDataLeakRoom.hacked.code.label')}</label>
            <input
              id="code"
              type="text"
              placeholder={t('routes.patientDataLeakRoom.hacked.code.placeholder')}
              value={input}
              onChange={(e) => { setInput(e.target.value); if (feedback) setFeedback(null) }}
              disabled={stage !== 'hacked'}
              autoFocus
              autoComplete="off"
              spellCheck={false}
            />
            <button type="submit" disabled={stage !== 'hacked'}>
              {t('routes.patientDataLeakRoom.hacked.code.submit')}
            </button>
          </form>

          {feedback && stage === 'hacked' && (
            <div className="feedback danger" role="alert">{feedback}</div>
          )}
        </div>
      </section>

      {stage === 'solved' && (
        <div className="overlay overlay-success" role="dialog" aria-modal="true" aria-labelledby="success-title">
          <div className="overlay-content">
            <h2 id="success-title">{t('routes.patientDataLeakRoom.success.title')}</h2>
            <p>{t('routes.patientDataLeakRoom.success.desc')}</p>
            <p className="sub">{t('routes.patientDataLeakRoom.success.sub')}</p>
          </div>
        </div>
      )}

      {stage === 'failed' && (
        <div className="overlay overlay-failed" role="alertdialog" aria-modal="true" aria-labelledby="failed-title">
          <div className="overlay-content">
            <h2 id="failed-title">{t('routes.patientDataLeakRoom.failed.title')}</h2>
            <p>{t('routes.patientDataLeakRoom.failed.desc')}</p>
            <p className="sub">{t('routes.patientDataLeakRoom.failed.sub')}</p>
          </div>
        </div>
      )}
    </div>
  )
}
