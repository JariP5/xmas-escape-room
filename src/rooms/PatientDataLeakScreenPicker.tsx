import { Link } from 'react-router-dom'
import '../App.css'
import { LanguageSelector, useI18n } from '../i18n'

export default function PatientDataLeakScreenPicker() {
  const { t } = useI18n()

  return (
    <div className="pdl-black" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
      <LanguageSelector />
      <h2 style={{ color: 'var(--text)', textAlign: 'center', margin: 0 }}>
        {t('routes.patientDataLeakRoom.screenPicker.title')}
      </h2>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 600 }}>
        <Link
          to="/patient-data-leak-room/main"
          className="button"
          style={{
            textDecoration: 'none',
            flex: '1 1 240px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            padding: '20px 24px',
            textAlign: 'center',
          }}
        >
          <strong>{t('routes.patientDataLeakRoom.screenPicker.main.label')}</strong>
          <span style={{ fontSize: '.85rem', opacity: 0.8 }}>
            {t('routes.patientDataLeakRoom.screenPicker.main.desc')}
          </span>
        </Link>

        <Link
          to="/patient-data-leak-room/screen1"
          className="button"
          style={{
            textDecoration: 'none',
            flex: '1 1 240px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            padding: '20px 24px',
            textAlign: 'center',
          }}
        >
          <strong>{t('routes.patientDataLeakRoom.screenPicker.screen1.label')}</strong>
          <span style={{ fontSize: '.85rem', opacity: 0.8 }}>
            {t('routes.patientDataLeakRoom.screenPicker.screen1.desc')}
          </span>
        </Link>
      </div>
    </div>
  )
}
