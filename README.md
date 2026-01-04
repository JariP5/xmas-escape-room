# Xmas Escape Room (React + Vite)

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
├─ firebase.json              # SPA rewrites for Firebase Hosting
├─ my-react-app/
│  ├─ public/                 # Static assets
│  ├─ src/
│  │  ├─ App.tsx              # Routes and guarded layouts
│  │  ├─ main.tsx             # App bootstrap (BrowserRouter + i18n provider)
│  │  ├─ App.css              # Styles (incl. language selector)
│  │  ├─ i18n.tsx             # Translations provider + LanguageSelector
│  │  ├─ translations.ts      # Language dictionaries
│  │  ├─ rooms/
│  │  │  └─ ChristmasRoom.tsx # Current room (room1)
│  │  └─ routes/
│  │     └─ UnlockRoom.tsx    # Enter/validate one-time access code
│  ├─ package.json
│  └─ .env.example            # Vite env variables (copy to .env for local dev)
```

## Getting Started

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm (bundled with Node) or pnpm/yarn if you prefer

### Install
```bash
cd my-react-app
npm install
```

### Configure Environment
Copy the example env file and fill your Supabase credentials:
```bash
cp my-react-app/.env.example my-react-app/.env
```
Set:
- VITE_SUPABASE_URL = https://YOUR-PROJECT-ref.supabase.co
- VITE_SUPABASE_ANON_KEY = your project anon public key

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
- `/room1` — Christmas Archive (guarded by unlock state)

The route guard is implemented using nested routes in `App.tsx`. Users visiting `/room1` without an unlocked state are redirected to `/unlock/room1`.

## Internationalization (i18n)
- Provider and hook live in `src/i18n.tsx` (TranslationProvider, useI18n)
- Language dictionaries are in `src/translations.ts` (en, nl, fr, de)
- The flag-only circular LanguageSelector is shown in the top-right corner

To add a new language:
1) Add the language code and label to `supportedLangs`
2) Extend the `Lang` union type
3) Provide translations for all keys in `dicts`

## One-time Access Codes with Supabase
The helper `src/supabase.ts` provides:
- `claimAccessCode(room, code)` — attempts to atomically mark a code as used via an RPC `claim_code(code, room)`. Falls back to a guarded PATCH if RPC doesn’t exist.
- `markUnlocked(room)` / `isUnlocked(room)` — store unlock state in localStorage

Recommended Supabase setup:
1) Table `access_codes`
   - `code` text primary key (or unique)
   - `room` text not null
   - `used_at` timestamptz null (null = unused)
2) Enable RLS and add policies allowing the anonymous role to:
   - SELECT codes (optionally filtered by room)
   - UPDATE `used_at` where `used_at is null` and code/room match
3) Optional RPC for true atomic claim (recommended):
```sql
create or replace function claim_code(code text, room text)
returns access_codes as $$
declare r access_codes;
begin
  update access_codes set used_at = now()
  where access_codes.code = claim_code.code
    and access_codes.room = claim_code.room
    and used_at is null
  returning * into r;
  return r; -- null if invalid/used
end; $$ language plpgsql security definer;
```
Add a policy that permits executing this function for the anon role.

## Deployment (Firebase Hosting)
This repo includes `firebase.json` configured for SPA rewrites. Steps:
1) Build the app: `npm run build`
2) Install Firebase CLI if needed: `npm i -g firebase-tools`
3) Login: `firebase login`
4) Initialize hosting (once): `firebase init hosting`
   - Select your project
   - Public directory: `my-react-app/dist`
   - Configure as a SPA (rewrite all to /index.html): Yes
5) Deploy: `firebase deploy`

Clean URLs (e.g. `/room1`) will work on refresh thanks to the rewrites.

## Adding a New Room (quick guide)
1) Create a component under `src/rooms/YourRoom.tsx`
2) Add a card/link to Home in `App.tsx` pointing to `/unlock/yourRoom`
3) Add an unlock route: `<Route path="/unlock/yourRoom" element={<UnlockRoom />}/>`
4) Guard the room with `<Route element={<RequireUnlock room="yourRoom" />}><Route path="yourRoom" element={<YourRoom/>} /></Route>` (child path is relative — no leading slash)
5) Add translations (title, card text, etc.) in `translations.ts`

## Contributing
- Keep the unlock guard intact; never auto-unlock rooms in production
- Keep all user-facing text in `translations.ts`
- Favor small, focused components; no new heavy dependencies unless justified

## License
No license specified. All rights reserved unless the owner adds a license.
