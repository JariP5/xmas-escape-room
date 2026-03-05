import '../App.css'
import { LanguageSelector, useI18n } from '../i18n'

export default function PatientDataLeakScreen1() {
  const { t } = useI18n()

  return (
    <div className="app">
      <div className="scanlines" aria-hidden />
      <LanguageSelector />
      <header className="header">
        <h1 className="glitch" data-text={t('routes.patientDataLeakRoom.screen1.title')}>
          {t('routes.patientDataLeakRoom.screen1.title')}
        </h1>
      </header>
      <section className="panel" style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)' }}>
          {t('routes.patientDataLeakRoom.screen1.placeholder')}
        </p>
      </section>
    </div>
  )
}
