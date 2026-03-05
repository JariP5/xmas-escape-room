import { Link } from 'react-router-dom'
import '../../App.css'
import { LanguageSelector, useI18n } from '../../i18n.tsx'

export default function PatientDataLeakScreenPicker() {
  const { t } = useI18n()
  const title = t('routes.patientDataLeakRoom.card.title')

  const screens = [
    {
      to: '/patient-data-leak-room/main',
      icon: '/assets/patient-data-leak-room/thumbnail.png',
      label: t('routes.patientDataLeakRoom.screenPicker.main.label'),
      desc: t('routes.patientDataLeakRoom.screenPicker.main.desc'),
    },
    {
      to: '/patient-data-leak-room/morse-code',
      icon: '/assets/patient-data-leak-room/thumbnail.png',
      label: t('routes.patientDataLeakRoom.screenPicker.morseCode.label'),
      desc: t('routes.patientDataLeakRoom.screenPicker.morseCode.desc'),
    },
    {
      to: '/patient-data-leak-room/connection-code',
      icon: '/assets/patient-data-leak-room/thumbnail.png',
      label: t('routes.patientDataLeakRoom.screenPicker.connectionCode.label'),
      desc: t('routes.patientDataLeakRoom.screenPicker.connectionCode.desc'),
    },
  ]

  return (
    <div className="app">
      <div className="scanlines" aria-hidden />
      <LanguageSelector />
      <header className="header">
        <h1 className="glitch" data-text={title}>{title}</h1>
        <p className="tagline">{t('routes.patientDataLeakRoom.screenPicker.title')}</p>
      </header>

      <section className="panel" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 16,
      }}>
        {screens.map(s => (
          <Link
            key={s.to}
            to={s.to}
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
              background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
            }}
          >
            <img
              src={s.icon}
              alt={s.label}
              style={{ width: 150, height: 150, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}
            />
            <div>
              <p className="elf-name" style={{ margin: 0 }}>{s.label}</p>
              <p className="elf-desc" style={{ margin: '4px 0 0' }}>{s.desc}</p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  )
}
