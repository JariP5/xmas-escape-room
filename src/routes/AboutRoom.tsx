import { Link, useNavigate, useParams } from 'react-router-dom'
import { LanguageSelector, useI18n } from '../i18n'
import { getRoom } from '../rooms/registry'
import '../App.css'

export default function AboutRoom() {
  const { t } = useI18n()
  const { roomId } = useParams()
  const nav = useNavigate()
  const room = getRoom(roomId)

  if (!room) {
    // Fallback: go home if unknown room
    nav('/', { replace: true })
    return null
  }

  const title = t(`routes.${room.baseKey}.card.title`)
  const desc = t(`routes.${room.baseKey}.card.desc`)

  // Images with sensible defaults from public assets
  const heroImg = room.heroImage || '/assets/room-hero-placeholder.svg'
  const boardGameImg = room.boardGameImage || '/assets/boardgame-placeholder.svg'

  return (
    <div className="app">
      <div className="scanlines" aria-hidden />
      <LanguageSelector />
      <header className="header">
        <h1 className="glitch" data-text={title}>{title}</h1>
      </header>

      {/* Full-bleed hero image */}
      <div style={{ width: '100%', margin: 0 }}>
        <img
          src={heroImg}
          alt={t('routes.about.heroAlt')}
          style={{ display: 'block', width: '100%', height: 'auto' }}
        />
      </div>

      <section className="panel" style={{ maxWidth: 920, margin: '0 auto' }}>

        {/* Title and description */}
        <h2 style={{ textAlign: 'center', marginTop: 12 }}>{title}</h2>
        <p style={{ textAlign: 'center', color: 'var(--muted)' }}>{desc}</p>

        {/* Board game illustration with actions */}
        <div style={{ display: 'grid', gap: 16, justifyItems: 'center', marginTop: 16 }}>
          <img src={boardGameImg} alt={t('routes.about.boardGameAlt')}
               style={{ maxWidth: '100%', width: 480, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }} />
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to={`/unlock/${room.id}`} className="button" style={{ textDecoration: 'none' }}>
              {t('routes.about.haveGame')}
            </Link>
            <Link to="/shop" className="button secondary" style={{ textDecoration: 'none' }}>
              {t('routes.about.needToBuy')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
