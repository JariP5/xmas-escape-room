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

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang())

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, lang)
    } catch {}
  }, [lang])

  const t = useMemo(() => {
    const d = dicts[lang]
    return (key: TKey) => d[key] ?? key
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
  return (
    <select
      aria-label="Language"
      className={className}
      value={lang}
      onChange={(e) => setLang(e.target.value as Lang)}
      style={{ position: 'absolute', top: 16, right: 16 }}
    >
      {supportedLangs.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
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
