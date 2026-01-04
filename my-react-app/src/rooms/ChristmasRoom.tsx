import { useEffect, useState } from 'react'
import '../App.css'
import { useI18n, LanguageSelector, langToLocale } from '../i18n'

function formatTime(ms: number) {
  if (ms < 0) ms = 0
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

function normalize(s: string, locale: string) {
  // Remove diacritics, uppercase with locale, map digits to words, and strip non A–Z
  const digitWord = (l: string) => {
    if (l.startsWith('de')) return 'EINS'
    if (l.startsWith('nl')) return 'EEN'
    if (l.startsWith('fr')) return 'UN'
    return 'ONE'
  }
  const l = locale.toLowerCase()
  const base = s
    .normalize('NFD')
    .replace(/\p{Diacritic}+/gu, '')
    .toLocaleUpperCase(locale)
    .replace(/1/g, digitWord(l))
    .replace(/[^A-Z]/g, '')
  return base
}

const ONE_HOUR = 60 * 60 * 1000

function ChristmasRoom() {
  const { t, lang } = useI18n()
  const locale = langToLocale(lang)
  const [now, setNow] = useState(Date.now())
  const [input, setInput] = useState('')
  const [solved, setSolved] = useState(false)
  const [destroyed, setDestroyed] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [deadlineTs, setDeadlineTs] = useState<number | null>(null)
  const [hasLockedOnce, setHasLockedOnce] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  const timeLeft = deadlineTs ? Math.max(0, deadlineTs - now) : null

  // Global ticker when active
  useEffect(() => {
    if (solved || destroyed || !deadlineTs) return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [solved, destroyed, deadlineTs])

  // Handle finish
  useEffect(() => {
    if (!solved && deadlineTs && timeLeft === 0) {
      setDestroyed(true)
    }
  }, [timeLeft, solved, deadlineTs])

  // Detect lock/unlock via Page Visibility API
  useEffect(() => {
    const onVis = () => {
      const hidden = document.hidden
      if (hidden) {
        setHasLockedOnce(true)
      } else {
        if (!hasStarted && hasLockedOnce) {
          const ts = Date.now() + ONE_HOUR
          setDeadlineTs(ts)
          setHasStarted(true)
        }
      }
    }
    document.addEventListener('visibilitychange', onVis)
    // Initial check
    onVis()
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [hasStarted, hasLockedOnce])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (solved || destroyed || !deadlineTs) return
    const ok = normalize(input, locale) === normalize(t('password'), locale)
    if (ok) {
      setSolved(true)
      setFeedback(t('success.desc'))
    } else {
      setFeedback(t('error.badPass'))
    }
  }

  const timerLabel = hasStarted && deadlineTs ? t('countdown.label') : t('countdown.waiting')

  return (
    <div className={`app ${solved ? 'state-solved' : ''} ${destroyed ? 'state-destroyed' : ''}`}>
      <div className="scanlines" aria-hidden />
      <LanguageSelector />
      <header className="header">
        <h1 className="glitch" data-text={t('room1.title')}>{t('room1.title')}</h1>
      </header>

      <section className="story">
        <div className="columns">
          <div className="left">
            <p>{t('story.1')}</p>
            <p>{t('story.2')}</p>
            <p>{t('story.3')}</p>
            <p className="final-code">{t('story.4')}</p>
            <p>{t('story.5')}</p>
            <p>{t('story.6')}</p>
            <p>{t('story.lists')}</p>
            <p>{t('story.7')}</p>
          </div>
          <div className="right">
            <div className="elf">
              <p className="elf-name">{t('elf1.name')}</p>
              <p className="elf-desc">{t('elf1.desc')}</p>
            </div>
            <div className="elf">
              <p className="elf-name">{t('elf2.name')}</p>
              <p className="elf-desc">{t('elf2.desc')}</p>
            </div>
            <div className="elf">
              <p className="elf-name">{t('elf3.name')}</p>
              <p className="elf-desc">{t('elf3.desc')}</p>
            </div>
            <div className="elf">
              <p className="elf-name">{t('elf4.name')}</p>
              <p className="elf-desc">{t('elf4.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="timer">
          <span className="label">{timerLabel}</span>
          <span className="value" aria-live="polite">{deadlineTs ? formatTime(timeLeft || 0) : '—:—:—'}</span>
        </div>

        <form className="access" onSubmit={handleSubmit} autoComplete="off">
          <label htmlFor="pw">{t('pass.label')}</label>
          <input
            id="pw"
            name="archive-key"
            type="password"
            placeholder={t('pass.placeholder')}
            value={input}
            onChange={(e) => { const v = e.target.value; setInput(v); if (feedback) setFeedback(null); }}
            disabled={solved || destroyed || !deadlineTs}
            autoFocus
            autoComplete="new-password"
            inputMode="text"
            spellCheck={false}
            autoCapitalize="off"
            aria-autocomplete="none"
            data-1p-ignore
            data-lpignore="true"
            data-bwignore="true"
            data-form-type="other"
          />
          <button type="submit" disabled={solved || destroyed || !deadlineTs}>{t('pass.submit')}</button>
        </form>

        {(!deadlineTs && !destroyed && !solved) && (
          <div className="feedback" role="status">{t('hint.lockToStart')}</div>
        )}

        {feedback && !solved && !destroyed && deadlineTs && (
          <div className="feedback danger" role="alert">{feedback}</div>
        )}
      </section>

      {/* Overlays */}
      {solved && (
        <div className="overlay overlay-success" role="dialog" aria-modal="true" aria-labelledby="success-title">
          <div className="overlay-content">
            <h2 id="success-title">{t('success.title')}</h2>
            <p>{t('success.desc')}</p>
            <p className="sub">{t('success.sub')}</p>
          </div>
        </div>
      )}

      {destroyed && !solved && (
        <div className="overlay overlay-timeout" role="alertdialog" aria-modal="true" aria-labelledby="timeout-title">
          <div className="overlay-content dramatic">
            <h2 id="timeout-title">{t('timeout.title')}</h2>
            <p>{t('timeout.desc')}</p>
            <div className="shutdown-bar" aria-hidden />
          </div>
        </div>
      )}
    </div>
  )
}

export default ChristmasRoom
