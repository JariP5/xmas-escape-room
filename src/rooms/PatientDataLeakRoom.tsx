import { useEffect, useRef, useState } from 'react'
import '../App.css'
import { LanguageSelector, useI18n } from '../i18n'

type Stage = 'idle' | 'video' | 'blackout' | 'hacked' | 'solved'

export default function PatientDataLeakRoom() {
  const { t } = useI18n()
  const [stage, setStage] = useState<Stage>('idle')
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Auto-play video when entering video stage
  useEffect(() => {
    if (stage === 'video') videoRef.current?.play()
  }, [stage])

  // Blackout timer → hacked
  useEffect(() => {
    if (stage !== 'blackout') return
    const id = setTimeout(() => setStage('hacked'), 1500)
    return () => clearTimeout(id)
  }, [stage])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (stage !== 'hacked') return
    const answer = t('routes.patientDataLeakRoom.password')
    if (input.trim().toLowerCase() === answer.trim().toLowerCase()) {
      setStage('solved')
      setFeedback(null)
    } else {
      setFeedback(t('routes.patientDataLeakRoom.error.badCode'))
    }
  }

  // Idle — black screen with start button
  if (stage === 'idle') {
    return (
      <div className="pdl-black">
        <LanguageSelector />
        <button className="pdl-start glitch" data-text={t('routes.patientDataLeakRoom.start')} onClick={() => setStage('video')}>
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

      <section className="story" style={{ paddingBottom: '2rem' }}>
        <div className="panel" style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ textAlign: 'center', color: 'var(--muted)' }}>
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
              disabled={stage === 'solved'}
              autoFocus
              autoComplete="off"
              spellCheck={false}
            />
            <button type="submit" disabled={stage === 'solved'}>
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
    </div>
  )
}
