import './App.css'
import { Routes, Route, Link, Navigate, Outlet } from 'react-router-dom'
import { LanguageSelector, useI18n } from './i18n'
import UnlockRoom from './routes/UnlockRoom'
import AboutRoom from './routes/AboutRoom'
import Shop from './routes/Shop'
import { isUnlocked } from './supabase'
import { rooms, lockForRoom } from './rooms/registry'
import React from 'react'

function Home() {
  const { t } = useI18n()
  return (
    <div className="app">
      <div className="scanlines" aria-hidden />
      <LanguageSelector />
      <header className="header">
        <h1 className="glitch" data-text={t('app.title')}>{t('app.title')}</h1>
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
          return (
            <Link key={r.id} to={target} className="elf" style={{ textDecoration: 'none' }}>
              <p className="elf-name">{t(`routes.${r.baseKey}.card.title`)}</p>
              <p className="elf-desc">{t(`routes.${r.baseKey}.card.desc`)}</p>
            </Link>
          )
        })}
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

function RoomPage({ Comp }: { Comp: React.ComponentType }) {
  return (
    <>
      <Comp />
    </>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about/:roomId" element={<AboutRoom />} />
      <Route path="/unlock/:roomId" element={<UnlockRoom />} />
      <Route path="/shop" element={<Shop />} />

      {rooms.map(r => {
        const element = <RoomPage Comp={r.Component} />
        const locked = lockForRoom(r.id)
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
  )
}

export default App
