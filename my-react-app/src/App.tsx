import './App.css'
import EscapeRoomOne from './rooms/EscapeRoomOne'
import { Routes, Route, Link } from 'react-router-dom'

function Home() {
  return (
    <div className="app">
      <div className="scanlines" aria-hidden />
      <header className="header">
        <h1 className="glitch" data-text="ESCAPE ROOMS">ESCAPE ROOMS</h1>
      </header>

      <section className="story">
        <div className="columns">
          <div className="left">
            <p>Willkommen! Wähle einen Escape Room, um das Abenteuer zu starten.</p>
            <p>Du kannst künftig aus mehreren Rätseln auswählen. Aktuell ist ein Raum verfügbar.</p>
          </div>
          <div className="right">
            <div className="elf">
              <p className="elf-name">Weihnachts-Archiv</p>
              <p className="elf-desc">Der Weihnachtscomputer wurde kompromittiert. Starte die Wiederherstellung, bevor die Zeit abläuft.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="panel" style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
        <Link to="/room1" aria-label="Weihnachts-Archiv starten">
          Weihnachts-Archiv starten
        </Link>
      </section>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/room1"
        element={
          <>
            <Link className="back" to="/" aria-label="Zurück zur Auswahl" style={{ position: 'absolute', top: 16, left: 16 }}>
              ← Zurück
            </Link>
            <EscapeRoomOne />
          </>
        }
      />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}

export default App
