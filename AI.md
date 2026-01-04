AI Contributor Guide

Purpose
- This document is a quick-start reference for autonomous code assistants (e.g., Claude Code, GitHub Copilot Agents) working on this repository.
- It summarizes architecture, conventions, common tasks, and pitfalls to speed up safe, minimal-change contributions.

Repository Summary
- Frontend: React + TypeScript (Vite)
- Routing: React Router (BrowserRouter) with SPA rewrites via Firebase Hosting
- i18n: Custom provider and dictionaries (EN, NL, FR, DE)
- Access control: One-time access code per room, validated/consumed via Supabase REST/RPC

Key Paths
- my-react-app/src/main.tsx — App bootstrap (BrowserRouter + TranslationProvider)
- my-react-app/src/App.tsx — Routes, home page, guard layout
- my-react-app/src/rooms/ChristmasRoom.tsx — Current room implementation (christmas-room)
- my-react-app/src/routes/UnlockRoom.tsx — Access code entry + unlock flow
- my-react-app/src/i18n.tsx — i18n provider + LanguageSelector component
- my-react-app/src/translations.ts — Translation dictionaries (nested by routes/sections) and types
- my-react-app/src/supabase.ts — Lightweight Supabase REST/RPC helper and local unlock state
- firebase.json — SPA rewrites config for clean URLs
- my-react-app/.env.example — Vite env placeholders for Supabase

Environment Variables (Vite)
- VITE_SUPABASE_URL: Supabase project URL
- VITE_SUPABASE_ANON_KEY: Supabase public anon key
Notes:
- Only variables prefixed with VITE_ are exposed to the client.
- Do not commit real secrets. Use .env locally and hosting provider config in production.

Supabase Access Codes
- Table: access_codes(code text PK/unique, room text, used_at timestamptz null)
- RLS policies must allow:
  - SELECT by anon (optionally constrained)
  - UPDATE used_at when used_at IS NULL and code/room match
- RPC (recommended): claim_code(code, room) to atomically set used_at = now()
- Client flow (src/supabase.ts):
  1) Try RPC POST /rest/v1/rpc/claim_code
  2) Fallback: PATCH /rest/v1/access_codes where used_at is null
  3) On success, mark local unlock in localStorage: room.<roomId>.unlocked = '1'

Routing and Guards
- BrowserRouter is configured in main.tsx
- App.tsx defines:
  - "/": Home
  - "/unlock/:roomId": Unlock page
  - Guarded layout: <Route element={<RequireUnlock room="christmas-room" />}>
      <Route path="christmas-room" element={<ChristmasRoomPage />} />
    </Route>
Important:
- The guarded child route must be relative (no leading slash) to be wrapped by the guard.
- Visiting /christmas-room without being unlocked must redirect to /unlock/christmas-room.
- Unlock state is checked via isUnlocked(room) which reads localStorage.

i18n Notes
- Add languages by updating:
  - Lang union type
  - supportedLangs array
  - dicts mapping with all necessary keys
- All user-facing strings should be referenced with t('key') and defined in translations.ts.
- The LanguageSelector shows only the active flag by default and animates a menu on click.

Visual/Styles
- Styling is plain CSS residing in my-react-app/src/App.css
- Language selector and general aesthetic live here; avoid adding heavy UI frameworks.

Build and Dev Commands
- cd my-react-app
- npm run dev — start Vite dev server
- npm run build — type-check, then build
- npm run preview — preview built bundle

Deployment (Firebase Hosting)
- Public directory: my-react-app/dist
- SPA rewrite: all routes -> /index.html (see firebase.json)
- Clean URLs like /christmas-room should work on refresh

Common Task Recipes
1) Add a new room "room2"
   - Create my-react-app/src/rooms/Room2.tsx
   - Add a Link on Home to /unlock/room2
   - Add routes in App.tsx:
     <Route path="/unlock/room2" element={<UnlockRoom />} />
     <Route element={<RequireUnlock room="room2" />}>
       <Route path="room2" element={<Room2 />} />
     </Route>
   - Ensure child path is relative ("room2" not "/room2") under the guard layout
   - Add translations for any new text keys in translations.ts

2) Add a new language (e.g., Spanish)
   - Extend type Lang = 'en' | 'de' | 'nl' | 'fr' | 'es'
   - supportedLangs.push({ code: 'es', label: 'Español' })
   - Provide dicts.es with all existing keys

3) Change the unlock message copy
   - Edit the relevant keys in translations.ts across all languages

4) Integrate a checkout URL on the unlock page
   - In UnlockRoom.tsx, replace the placeholder link with a real URL
   - Consider tracking roomId param for per-room checkout links

5) Strengthen guard behavior
   - Verify localStorage key: room.<roomId>.unlocked
   - Ensure RequireUnlock wraps the room route with a relative child path
   - Test in a fresh session/incognito or after clearing localStorage

Quality and Safety Checklist
- Minimal changes: only touch files needed for the task
- i18n: no hard-coded user text; update all languages or leave obvious TODOs
- Routing: child routes inside a guard must be relative
- State: avoid auto-unlocking rooms except via the claimAccessCode flow
- Env: never hardcode real Supabase URL/keys in code; rely on Vite env
- Build: run npm run build to ensure type-check + bundle succeed
- Accessibility: maintain labels (aria-labels, roles) in UI components (e.g., LanguageSelector)

Debugging Tips
- If /christmas-room appears unlocked unexpectedly, clear localStorage (room.christmas-room.unlocked) and retry
- Add temporary console logs to RequireUnlock and UnlockRoom only when necessary; remove before commit
- Network/CORS issues often manifest as 'network' result from claimAccessCode

Definition of Done
- Feature implemented with minimal footprint
- All relevant text is localized
- App builds (npm run build) without errors
- Routing and unlock guard behave as expected (manual test: direct URL and navigation)
- Documentation updated if behavior or setup changes

Notes for Agents
- Prefer editing existing files instead of adding dependencies or new abstractions
- Keep CSS changes scoped in App.css unless a new component warrants separate styles
- For substantial tasks, update README and this AI.md with any new conventions
