import './App.css'
import ChristmasRoom from './rooms/ChristmasRoom.tsx'
import { Routes, Route, Link, Navigate, Outlet } from 'react-router-dom'
import { LanguageSelector, useI18n } from './i18n'
import UnlockRoom from './routes/UnlockRoom'
import { isUnlocked } from './supabase'

const lockChristmasRoom = (() => {
  const raw = (import.meta as any).env?.VITE_LOCK_CHRISTMAS_ROOM as string | undefined
  if (!raw) return true
  const v = String(raw).trim().toLowerCase()
  return v === '1' || v === 'true' || v === 'yes' || v === 'on'
})()

function Home() {
  const { t } = useI18n()
  const target = lockChristmasRoom ? '/unlock/christmas-room' : '/christmas-room'
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
              <p className="elf-name">{t('routes.christmasRoom.card.title')}</p>
              <p className="elf-desc">{t('routes.christmasRoom.card.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="panel" style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
        <Link to={target} aria-label={t('home.startRoom')}>
          {t('home.startRoom')}
        </Link>
      </section>
    </div>
  )
}

function RequireUnlock({ room }: { room: string }) {
  if (!isUnlocked(room)) {
    return <Navigate to={`/unlock/${room}`} replace />
  }
  return <Outlet />
}

function ChristmasRoomPage() {
  const { t } = useI18n()
  return (
    <>
      <Link className="back" to="/" aria-label={t('common.back')} style={{ position: 'absolute', top: 16, left: 16 }}>
        {t('common.back')}
      </Link>
      <ChristmasRoom />
    </>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/unlock/:roomId" element={<UnlockRoom />} />

      {lockChristmasRoom ? (
        <Route element={<RequireUnlock room="christmas-room" />}>
          <Route path="christmas-room" element={<ChristmasRoomPage />} />
        </Route>
      ) : (
        <Route path="christmas-room" element={<ChristmasRoomPage />} />
      )}

      <Route path="*" element={<Home />} />
    </Routes>
  )
}

export default App
