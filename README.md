# North Pole Escape (React + Vite)

A small, stylized escape-room web app. It supports multiple rooms, internationalization (English, Dutch, French, German), real routing with React Router, and a one-time access code flow backed by Supabase.

## Features
- Welcome page with room selection (more rooms can be added over time)
- React Router (clean URLs using BrowserRouter)
- Guarded routes: rooms require a one-time access code before entry
- Supabase-backed access codes (single-use consumption)
- i18n with an animated language selector (EN, NL, FR, DE)
- Designed for static hosting (Firebase) with SPA rewrites

## Tech Stack
- React 19 + TypeScript
- Vite 7 (dev server and build)
- React Router v6
- Supabase (via REST/RPC; no supabase-js dependency)
- CSS (no UI framework)

## Project Structure
```
/ (repo root)
├─ firebase.json       # SPA rewrites for Firebase Hosting
├─ public/             # Static assets
├─ src/
│  ├─ App.tsx          # Routes and guarded layouts
│  ├─ main.tsx         # App bootstrap (BrowserRouter + i18n provider)
│  ├─ App.css          # Styles (incl. language selector)
│  ├─ i18n.tsx         # Translations provider + LanguageSelector
│  ├─ translations.ts  # Language dictionaries
│  ├─ rooms/
│  │  ├─ ChristmasRoom.tsx
│  │  └─ registry.ts      # Central list of rooms, per-room locking flags
│  └─ routes/
│     └─ UnlockRoom.tsx
├─ index.html
├─ package.json
└─ .env.example        # Vite env variables (copy to .env for local dev)
```

## Getting Started

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm (bundled with Node) or pnpm/yarn if you prefer

### Install
```bash
npm install
```

### Configure Environment
Copy the example env file and fill your Supabase credentials:
```bash
cp .env.example .env
```
Set:
- VITE_SUPABASE_URL = https://YOUR-PROJECT-ref.supabase.co
- VITE_SUPABASE_ANON_KEY = your project anon public key
- VITE_LOCK_CHRISTMAS_ROOM = true|false (optional; default true). When false, the Christmas room is open without a code.

Note: Vite exposes variables that start with VITE_. Do not check in real secrets.

### Run (Dev)
```bash
npm run dev
```
Then open the printed localhost URL.

### Build
```bash
npm run build
```

### Preview (serve built files)
```bash
npm run preview
```

## Routing
- `/` — home/welcome + room cards
- `/unlock/:roomId` — access code entry page
- `/christmas-room` — Christmas Archive (guarded by unlock state)

The route guard is implemented using nested routes in `App.tsx`. Users visiting `/christmas-room` without an unlocked state are redirected to `/unlock/christmas-room`.

## Internationalization (i18n)
- Provider and hook live in `src/i18n.tsx` (TranslationProvider, useI18n)
- Language dictionaries are in `src/translations.ts` (en, nl, fr, de)
  - Structure is nested and grouped by routes/sections (e.g., `app`, `common`, `home`, `routes.unlock`, `routes.christmasRoom`)
  - Use dot-path keys with `t('path.to.key')`
- The flag-only circular LanguageSelector is shown in the top-right corner

To add a new language:
1) Add the language code and label to `supportedLangs`
2) Extend the `Lang` union type
3) Provide translations for all keys in `dicts`

## Adding a New Room (quick guide)
1) Create your component under `src/rooms/YourRoom.tsx` (default export the component)
2) Register it in `src/rooms/registry.ts`:
   - Add `{ id: 'your-room', baseKey: 'yourRoom', Component: YourRoom }` to the `rooms` array
   - `id` is the URL slug; `baseKey` is the i18n section under `routes.*`
3) Add translations for that room in `translations.ts` under `routes.yourRoom`:
   - Provide `card.title`, `card.desc`, plus any other keys your page uses
4) Locking behavior (optional): set an env flag
   - Global default: `VITE_LOCK_DEFAULT=true|false`
5) Routes and Home card are automatic
   - Home will show a card for every entry in `rooms`
   - Routes `/unlock/your-room` and `/your-room` are wired automatically; the room is guarded if locked

## Contributing
- Keep the unlock guard intact; never auto-unlock rooms in production
- Keep all user-facing text in `translations.ts`
- Favor small, focused components; no new heavy dependencies unless justified

## License
No license specified. All rights reserved unless the owner adds a license.
