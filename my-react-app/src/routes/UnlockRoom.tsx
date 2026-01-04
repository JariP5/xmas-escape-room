import React from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { LanguageSelector, useI18n } from '../i18n'
import { claimAccessCode, markUnlocked } from '../supabase'
import '../App.css'

export default function UnlockRoom() {
  const { t } = useI18n()
  const nav = useNavigate()
  const { roomId } = useParams()
  const room = roomId ?? 'room1'

  const [code, setCode] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    setError(null)
    const res = await claimAccessCode(room, code.trim())
    setLoading(false)
    if (res.ok) {
      markUnlocked(room)
      nav(`/${room}`, { replace: true })
    } else {
      switch (res.reason) {
        case 'invalid':
          setError(t('unlock.error.invalid'))
          break
        case 'used':
          setError(t('unlock.error.used'))
          break
        case 'config':
          setError(t('unlock.error.config'))
          break
        case 'network':
          setError(t('unlock.error.network'))
          break
        default:
          setError(res.message || t('unlock.error.generic'))
      }
    }
  }

  return (
    <div className="app">
      <div className="scanlines" aria-hidden />
      <LanguageSelector />
      <header className="header">
        <h1 className="glitch" data-text={t('app.title')}>{t('app.title')}</h1>
      </header>

      <section className="story" style={{ maxWidth: 800, margin: '0 auto', paddingBottom: '2rem' }}>
        <h2 style={{ textAlign: 'center', margin: '1rem 0 0.5rem' }}>{t('unlock.title')}</h2>
        <p style={{ textAlign: 'center', marginBottom: '1rem' }}>{t('unlock.desc')}</p>

        <form onSubmit={onSubmit} className="panel" style={{ display: 'grid', gap: 12, maxWidth: 420, margin: '0 auto' }}>
          <label htmlFor="code" style={{ fontWeight: 600 }}>{t('unlock.code.label')}</label>
          <input
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={t('unlock.code.placeholder')}
            autoComplete="one-time-code"
            inputMode="text"
            pattern="[A-Za-z0-9\-\_\s]+"
            className="input"
            style={{ padding: '0.75rem 1rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.2)', color: 'var(--text)' }}
          />
          {error && (
            <div role="alert" style={{ color: 'var(--danger)', fontWeight: 600, marginTop: 4 }}>{error}</div>
          )}
          <button type="submit" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? t('unlock.submitting') : t('unlock.submit')}
          </button>
          <p style={{ textAlign: 'center', color: 'var(--muted)', marginTop: 8 }}>
            {t('unlock.hintWhereToBuy')}{' '}
            <a href="#" onClick={(e) => e.preventDefault()}>{t('unlock.checkoutLink')}</a>
          </p>
        </form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link to="/">{t('back')}</Link>
        </div>
      </section>
    </div>
  )
}
