import '../App.css'
import { LanguageSelector, useI18n } from '../i18n'

export default function DataLeakRoom() {
  const { t } = useI18n()
  return (
    <div className="app">
      <div className="scanlines" aria-hidden />
      <LanguageSelector />
      <header className="header">
        <h1 className="glitch" data-text={t('routes.dataLeakRoom.title')}>{t('routes.dataLeakRoom.title')}</h1>
      </header>

      <section className="story" style={{ paddingBottom: '2rem' }}>
        <div className="panel" style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginTop: 8 }}>{t('routes.dataLeakRoom.card.title')}</h2>
          <p style={{ textAlign: 'center', color: 'var(--muted)' }}>{t('routes.dataLeakRoom.card.desc')}</p>
          <p style={{ textAlign: 'center', marginTop: 16 }}>
            {/* Placeholder intro for the new room */}
            {t('routes.dataLeakRoom.intro', 'Find the traces of a breach and seal the leak before the clock runs out.')}
          </p>
        </div>
      </section>
    </div>
  )
}
