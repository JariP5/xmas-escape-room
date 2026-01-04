import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { dicts, type Lang, supportedLangs, type TKey } from './translations'

export type I18nCtx = {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: TKey) => string
}

const Ctx = createContext<I18nCtx | null>(null)

const LS_KEY = 'app.lang'

function detectLang(): Lang {
  const fromLs = (typeof localStorage !== 'undefined' && (localStorage.getItem(LS_KEY) as Lang | null)) || null
  if (fromLs && dicts[fromLs]) return fromLs
  const nav = typeof navigator !== 'undefined' ? navigator.language : 'en'
  const base = nav.split('-')[0] as Lang
  if (base && (['en', 'de', 'nl', 'fr'] as Lang[]).includes(base)) return base
  return 'en'
}

function getNested(d: any, path: string): string | undefined {
  const parts = path.split('.')
  let cur: any = d
  for (const p of parts) {
    if (cur == null) return undefined
    cur = cur[p]
  }
  return typeof cur === 'string' ? cur : undefined
}

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang())

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, lang)
    } catch {}
  }, [lang])

  const t = useMemo(() => {
    const d = dicts[lang]
    return (key: TKey) => getNested(d, key) ?? key
  }, [lang])

  const setLang = (l: Lang) => setLangState(l)

  const value = useMemo(() => ({ lang, setLang, t }), [lang])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useI18n() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useI18n must be used within TranslationProvider')
  return ctx
}

export function LanguageSelector({ className }: { className?: string }) {
  const { lang, setLang } = useI18n()
  const [open, setOpen] = React.useState(false)
  const wrapRef = React.useRef<HTMLDivElement | null>(null)

  const flagFor = (code: Lang) => {
    switch (code) {
      case 'en':
        return '🇬🇧'
      case 'de':
        return '🇩🇪'
      case 'nl':
        return '🇳🇱'
      case 'fr':
        return '🇫🇷'
      default:
        return '🏳️'
    }
  }

  // Close on outside click or escape
  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keyup', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keyup', onKey)
    }
  }, [open])

  const active = supportedLangs.find(l => l.code === lang)!
  const others = supportedLangs.filter(l => l.code !== lang)

  return (
    <div
      ref={wrapRef}
      className={`lang-switch ${className ?? ''}`.trim()}
      aria-label="Language selector"
      style={{ position: 'absolute', top: 16, right: 16 }}
    >
      <button
        type="button"
        className={`lang-toggle ${open ? 'open' : ''}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={active.label}
        title={active.label}
        onClick={() => setOpen(o => !o)}
      >
        <span className="flag" aria-hidden>{flagFor(active.code)}</span>
        <span className="sr-only">{active.label}</span>
      </button>

      <div className={`lang-menu ${open ? 'show' : ''}`} role="menu" aria-hidden={!open}>
        {others.map((l) => (
          <button
            key={l.code}
            type="button"
            role="menuitemradio"
            aria-checked={false}
            className="lang-option"
            title={l.label}
            onClick={() => {
              setLang(l.code)
              setOpen(false)
            }}
          >
            <span className="flag" aria-hidden>{flagFor(l.code)}</span>
            <span className="sr-only">{l.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function langToLocale(lang: Lang): string {
  switch (lang) {
    case 'de':
      return 'de-DE'
    case 'nl':
      return 'nl-NL'
    case 'fr':
      return 'fr-FR'
    default:
      return 'en-US'
  }
}
