// Lightweight Supabase REST helper without depending on supabase-js
// Reads VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from Vite env.
// Exposes claimAccessCode(room, code) which will try to atomically mark a code as used.
// It first tries to call an RPC function `claim_code(code text, room text)` that should
// perform the atomic update server-side. If that function doesn't exist (404), it falls
// back to a best-effort PATCH that only updates rows where used_at is null.

export type ClaimResult =
  | { ok: true; code: string; room: string; used_at: string }
  | { ok: false; reason: 'invalid' | 'used' | 'config' | 'network' | 'unknown'; message?: string }

const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

function headers() {
  if (!URL || !KEY) return null
  return {
    'Content-Type': 'application/json',
    'apikey': KEY,
    'Authorization': `Bearer ${KEY}`,
    'Accept-Profile': 'public',
    'Prefer': 'return=representation',
  } as Record<string, string>
}

export async function claimAccessCode(room: string, code: string): Promise<ClaimResult> {
  const h = headers()
  if (!h) return { ok: false, reason: 'config', message: 'Missing Supabase config' }

  // 1) Try RPC first for true atomicity (requires server function)
  try {
    const resp = await fetch(`${URL}/rest/v1/rpc/claim_code`, {
      method: 'POST',
      headers: h,
      body: JSON.stringify({ code, room }),
    })
    if (resp.ok) {
      const row = await resp.json()
      // Expecting object with code, room, used_at
      if (row && row.code && row.room) {
        return { ok: true, code: row.code, room: row.room, used_at: row.used_at ?? new Date().toISOString() }
      }
      // Some RPCs return arrays; normalize
      if (Array.isArray(row) && row[0]?.code) {
        const r = row[0]
        return { ok: true, code: r.code, room: r.room, used_at: r.used_at ?? new Date().toISOString() }
      }
      // If RPC returns null, treat as invalid/used
      return { ok: false, reason: 'invalid', message: 'Code not found or already used' }
    } else if (resp.status === 400 || resp.status === 404) {
      // 404: function not found; 400: bad request – try fallback
    } else if (resp.status === 409) {
      return { ok: false, reason: 'used', message: 'Code already used' }
    } else if (resp.status === 401) {
      return { ok: false, reason: 'config', message: 'Invalid Supabase anon key' }
    } else {
      const text = await resp.text()
      return { ok: false, reason: 'unknown', message: text }
    }
  } catch (e) {
    // Network or CORS; try fallback
  }

  // 2) Fallback: best-effort optimistic update via PostgREST
  try {
    const usedAt = new Date().toISOString()
    const resp = await fetch(
      `${URL}/rest/v1/access_codes?code=eq.${encodeURIComponent(code)}&room=eq.${encodeURIComponent(room)}&used_at=is.null`,
      {
        method: 'PATCH',
        headers: { ...h, 'Prefer': 'return=representation' },
        body: JSON.stringify({ used_at: usedAt }),
      }
    )
    if (resp.ok) {
      const rows = await resp.json()
      if (Array.isArray(rows) && rows.length === 1) {
        return { ok: true, code: rows[0].code, room: rows[0].room, used_at: rows[0].used_at ?? usedAt }
      } else if (Array.isArray(rows) && rows.length === 0) {
        // Either invalid or already used – check if it exists to differentiate
        const check = await fetch(
          `${URL}/rest/v1/access_codes?code=eq.${encodeURIComponent(code)}&room=eq.${encodeURIComponent(room)}`,
          { headers: h }
        )
        if (check.ok) {
          const exists = await check.json()
          if (Array.isArray(exists) && exists.length > 0) return { ok: false, reason: 'used', message: 'Already used' }
        }
        return { ok: false, reason: 'invalid', message: 'Invalid code' }
      }
      const text = await resp.text()
      return { ok: false, reason: 'unknown', message: text }
    }
    if (resp.status === 401) return { ok: false, reason: 'config', message: 'Invalid Supabase anon key' }
    return { ok: false, reason: 'unknown', message: `HTTP ${resp.status}` }
  } catch (e) {
    return { ok: false, reason: 'network', message: (e as Error).message }
  }
}

export function markUnlocked(room: string) {
  try { localStorage.setItem(`room.${room}.unlocked`, '1') } catch {}
}
export function isUnlocked(room: string) {
  try { return localStorage.getItem(`room.${room}.unlocked`) === '1' } catch { return false }
}
