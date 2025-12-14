import { useEffect, useMemo, useState } from 'react'
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

function nextMidnight(from = new Date()) {
  const d = new Date(from)
  d.setHours(24, 0, 0, 0)
  return d
}

function normalize(s: string) {
  return s
    .toLocaleUpperCase('de-DE')
    .replace(/[^A-Z0-9]/g, '')
}

const DEFAULT_PASSWORD = 'WEIHNACHTEN'

function App() {
  const [now, setNow] = useState(Date.now())
  const [input, setInput] = useState('')
  const [solved, setSolved] = useState(false)
  const [destroyed, setDestroyed] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const deadline = useMemo(() => nextMidnight(), [])
  const timeLeft = Math.max(0, deadline.getTime() - now)

  useEffect(() => {
    if (solved || destroyed) return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [solved, destroyed])

  useEffect(() => {
    if (!solved && timeLeft === 0) {
      setDestroyed(true)
    }
  }, [timeLeft, solved])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (solved || destroyed) return
    const ok = normalize(input) === normalize(DEFAULT_PASSWORD)
    if (ok) {
      setSolved(true)
      setFeedback('Zugang gewährt. System wird wiederhergestellt …')
    } else {
      setFeedback('Falsches Passwort! Unbefugter Zugriff erkannt.')
    }
  }

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
          Um Mitternacht aktiviert sich die Selbstzerstörung. Dann sind alle Daten, alle Vorbereitung – alle Hoffnung – für immer verloren.
        </p>
        <p>
          Gib das endgültige Passwort ein, um den Notfall-Reset zu starten. Die Uhr tickt …
        </p>
      </section>

      <section className="panel">
        <div className="timer">
          <span className="label">COUNTDOWN BIS MITTERNACHT</span>
          <span className="value" aria-live="polite">{formatTime(timeLeft)}</span>
        </div>

        <form className="access" onSubmit={handleSubmit}>
          <label htmlFor="pw">ENDPASSWORT</label>
          <input
            id="pw"
            type="password"
            placeholder="••••••••••"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={solved || destroyed}
            autoFocus
          />
          <button type="submit" disabled={solved || destroyed}>Eingeben</button>
        </form>

        {feedback && !solved && !destroyed && (
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
            <p>Selbstzerstörung ausgelöst. Archiv unrettbar zerstört.</p>
          </div>
        )}
      </section>

      <footer className="footer">
        <span className="hint">Hinweis: Passwort ist nicht leer. Schreibweise egal, Sonderzeichen werden ignoriert.</span>
      </footer>
    </div>
  )
}

export default App
