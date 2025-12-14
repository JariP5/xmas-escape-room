import { useEffect, useState } from 'react'
import './App.css'

function formatTime(ms: number) {
  if (ms < 0) ms = 0
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

function normalize(s: string) {
  return s
    .toLocaleUpperCase('de-DE')
    .replace(/[^A-Z0-9]/g, '')
}

const ONE_HOUR = 60 * 60 * 1000
const DEFAULT_PASSWORD = 'WEIHNACHTEN'

function App() {
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
    const ok = normalize(input) === normalize(DEFAULT_PASSWORD)
    if (ok) {
      setSolved(true)
      setFeedback('Zugang gewährt. System wird wiederhergestellt …')
    } else {
      setFeedback('Falsches Passwort! Unbefugter Zugriff erkannt.')
    }
  }

  const timerLabel = hasStarted && deadlineTs ? 'COUNTDOWN' : 'WARTET AUF ENTSPERRUNG DES RECHNERS …'

  return (
    <div className={`app ${solved ? 'state-solved' : ''} ${destroyed ? 'state-destroyed' : ''}`}>
      <div className="scanlines" aria-hidden />
      <header className="header">
        <h1 className="glitch" data-text="WEIHNACHTS-ARCHIV">WEIHNACHTS-ARCHIV</h1>
        <p className="subtitle">KRITISCHER NOTFALL – ZENTRALRECHNER KOMPROMITTIERT</p>
      </header>

      <section className="story">
        <p>
          Heiligabend. Die Welt wartet auf das Wunder von Weihnachten – doch dieses Jahr ist alles bedroht.
        </p>
        <p>
          Der zentrale Computer des Weihnachts-Archivs – Hüter aller Wunschlisten, Flugrouten und Sicherheitscodes – wurde sabotiert. Ohne ihn drohen Chaos und Dunkelheit.
        </p>
        <p>
          Vier Elfen, einst Wächter der Technik, haben aus Zorn und Eifersucht das System manipuliert. Jeder von ihnen verbirgt ein Fragment des Sicherheitscodes – so raffiniert, dass keiner ihn allein lösen kann.
        </p>
        <p className="warning">
          Um den Reset zu aktivieren, muss der Rechner zunächst gesperrt und anschließend entsperrt werden. Dann startet ein 60‑Minuten‑Countdown.
        </p>
        <p>
          Gib das endgültige Passwort ein, bevor die Zeit abläuft. Die Uhr tickt …
        </p>
      </section>

      <section className="panel">
        <div className="timer">
          <span className="label">{timerLabel}</span>
          <span className="value" aria-live="polite">{deadlineTs ? formatTime(timeLeft || 0) : '—:—:—'}</span>
        </div>

        <form className="access" onSubmit={handleSubmit} autoComplete="off">
          <label htmlFor="pw">ENDPASSWORT</label>
          <input
            id="pw"
            name="archive-key"
            type="password"
            placeholder="••••••••••"
            value={input}
            onChange={(e) => setInput(e.target.value)}
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
          <button type="submit" disabled={solved || destroyed || !deadlineTs}>Eingeben</button>
        </form>

        {(!deadlineTs && !destroyed && !solved) && (
          <div className="feedback" role="status">Sperre den Computer kurz und entsperre ihn wieder, um den Countdown zu starten.</div>
        )}

        {feedback && !solved && !destroyed && deadlineTs && (
          <div className="feedback danger" role="alert">{feedback}</div>
        )}

        {solved && (
          <div className="success" role="status">
            <h2>Weihnachten ist gerettet!</h2>
            <p>Authentifizierung erfolgreich. Flugrouten kalibriert. Geschenk-Subsystem online.</p>
          </div>
        )}

        {destroyed && !solved && (
          <div className="failure" role="alert">
            <h2>ZEIT ABGELAUFEN</h2>
            <p>Countdown erreicht 0. Archiv unrettbar zerstört.</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default App
