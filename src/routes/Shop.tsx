import { Link } from 'react-router-dom'
import { LanguageSelector, useI18n } from '../i18n'
import '../App.css'

export default function Shop() {
  const { t } = useI18n()
  return (
    <div className="app">
      <div className="scanlines" aria-hidden />
      <LanguageSelector />
      <header className="header">
        <h1 className="glitch" data-text={t('app.title')}>{t('app.title')}</h1>
      </header>

      <section className="panel" style={{ maxWidth: 720, margin: '0 auto' }}>
        <Link className="back" to="/" aria-label={t('common.back')} style={{ position: 'absolute', top: 16, left: 16 }}>
          {t('common.back')}
        </Link>
        <h2 style={{ textAlign: 'center', marginTop: 8 }}>{t('routes.shop.title')}</h2>
        <p style={{ textAlign: 'center', color: 'var(--muted)' }}>{t('routes.shop.comingSoon')}</p>
      </section>
    </div>
  )
}
