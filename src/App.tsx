import './App.css'
import { Routes, Route, Link, Navigate, Outlet, useLocation } from 'react-router-dom'
import { LanguageSelector, useI18n } from './i18n'
import UnlockRoom from './routes/UnlockRoom'
import AboutRoom from './routes/AboutRoom'
import Shop from './routes/Shop'
import { isUnlocked } from './supabase'
import { rooms, areRoomsLocked } from './rooms/registry'
import React, { useEffect } from 'react'
import DifficultyMeter from './components/DifficultyMeter'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    // Always reset scroll to top on route change
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function Home() {
  const { t } = useI18n()
  return (
    <div className="app home">
      <div className="scanlines" aria-hidden />
      <div className="snowfall" aria-hidden />
      <div className="confetti" aria-hidden />
      <LanguageSelector />
      <header className="header">
        <h1 className="glitch" data-text={t('app.title')}>{t('app.title')}</h1>
        <p className="tagline">{t('app.tagline')}</p>
      </header>

      {/* Front page: show a list/grid of all escape rooms */}
      <section className="panel" style={{
        width: '92vw',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 16
      }}>
        {rooms.map(r => {
          const target = `/about/${r.id}`
          const title = t(`routes.${r.baseKey}.card.title`)
          const desc = t(`routes.${r.baseKey}.card.desc`)
          const thumb = r.thumbnailImage || '/assets/room-thumbnail-placeholder.svg'
          return (
            <Link
              key={r.id}
              to={target}
              className="elf room-card"
              style={{
                textDecoration: 'none',
                display: 'grid',
                gridTemplateColumns: '150px 1fr',
                alignItems: 'center',
                gap: 12,
                padding: '12px',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))'
              }}
            >
              <img src={thumb} alt={title} style={{ width: 150, height: 150, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }} />
              <div>
                <p className="elf-name" style={{ margin: 0 }}>{title}</p>
                <p className="elf-desc" style={{ margin: '4px 0 0' }}>{desc}</p>
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', color: 'var(--muted)', fontSize: '.95rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <strong>{t('routes.homeList.difficulty')}:</strong>
                    <DifficultyMeter value={r.difficulty} title={t('routes.homeList.difficulty')} />
                    <span aria-hidden style={{ fontVariantNumeric: 'tabular-nums' }}>{r.difficulty ?? '—'}/10</span>
                  </div>
                  <div><strong>{t('routes.homeList.players')}:</strong> {r.minPlayers} - {r.maxPlayers}</div>
                </div>
              </div>
            </Link>
          )
        })}
      </section>
    </div>
  )
}

function RequireUnlock({ room }: { room: string }) {
  if (!isUnlocked(room) && areRoomsLocked()) {
    return <Navigate to={`/unlock/${room}`} replace />
  }
  return <Outlet />
}

function RoomPage({ Comp }: { Comp: React.ComponentType }) {
  return (
    <>
      <Comp />
    </>
  )
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about/:roomId" element={<AboutRoom />} />
        <Route path="/unlock/:roomId" element={<UnlockRoom />} />
        <Route path="/shop" element={<Shop />} />

        {rooms.map(r => {
          const element = <RoomPage Comp={r.Component} />
          const locked = areRoomsLocked()
          return locked ? (
            <Route key={r.id} element={<RequireUnlock room={r.id} />}>
              <Route path={r.id} element={element} />
            </Route>
          ) : (
            <Route key={r.id} path={r.id} element={element} />
          )
        })}

        <Route path="*" element={<Home />} />
      </Routes>
    </>
  )
}

export default App
