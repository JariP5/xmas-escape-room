import '../App.css'
import { LanguageSelector, useI18n } from '../i18n'

export default function PatientDataLeakRoom() {
  const { t } = useI18n()
  return (
    <div className="app">
      <div className="scanlines" aria-hidden />
      <LanguageSelector />
      <header className="header">
        <h1 className="glitch" data-text={t('routes.patientDataLeakRoom.title')}>{t('routes.patientDataLeakRoom.title')}</h1>
      </header>

      <section className="story" style={{ paddingBottom: '2rem' }}>
        <div className="panel" style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginTop: 8 }}>{t('routes.patientDataLeakRoom.card.title')}</h2>
          <p style={{ textAlign: 'center', color: 'var(--muted)' }}>{t('routes.patientDataLeakRoom.card.desc')}</p>
          <p style={{ textAlign: 'center', marginTop: 16 }}>
            {/* Placeholder intro for the new room */}
            {t('routes.patientDataLeakRoom.intro')}
          </p>
        </div>
      </section>
    </div>
  )
}
