import './App.css'
import EscapeRoomOne from './rooms/EscapeRoomOne'
import { Routes, Route, Link } from 'react-router-dom'
import { LanguageSelector, useI18n } from './i18n'

function Home() {
  const { t } = useI18n()
  return (
    <div className="app">
      <div className="scanlines" aria-hidden />
      <LanguageSelector />
      <header className="header">
        <h1 className="glitch" data-text={t('app.title')}>{t('app.title')}</h1>
      </header>

      <section className="story">
        <div className="columns">
          <div className="left">
            <p>{t('home.welcome')}</p>
            <p>{t('home.moreComing')}</p>
          </div>
          <div className="right">
            <div className="elf">
              <p className="elf-name">{t('room1.card.title')}</p>
              <p className="elf-desc">{t('room1.card.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="panel" style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
        <Link to="/room1" aria-label={t('home.startRoom')}>
          {t('home.startRoom')}
        </Link>
      </section>
    </div>
  )
}

function App() {
  const { t } = useI18n()
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/room1"
        element={
          <>
            <Link className="back" to="/" aria-label={t('back')} style={{ position: 'absolute', top: 16, left: 16 }}>
              {t('back')}
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
