import ChristmasRoom from './ChristmasRoom'

export type RoomDef = {
  id: string // url slug, e.g., "christmas-room"
  baseKey: string // i18n base key path under routes.*, e.g., 'christmasRoom'
  Component: React.ComponentType
  boardGameImage?: string // public path to an image of the required board game (optional)
}

// Central registry of available rooms. Add new rooms here.
export const rooms: RoomDef[] = [
  { id: 'christmas-room', baseKey: 'christmasRoom', Component: ChristmasRoom, boardGameImage: '/assets/boardgame-placeholder.svg' },
]

export function getRoom(id: string | undefined): RoomDef | undefined {
  if (!id) return undefined
  return rooms.find(r => r.id === id)
}

function parseBool(v: string | undefined, defaultVal: boolean): boolean {
  if (!v) return defaultVal
  const s = String(v).trim().toLowerCase()
  return s === '1' || s === 'true' || s === 'yes' || s === 'on'
}

function toEnvNameFromId(id: string): string {
  // "christmas-room" -> "CHRISTMAS_ROOM"
  return id.replace(/[^a-z0-9]+/gi, '_').replace(/_+/g, '_').replace(/^_|_$/g, '').toUpperCase()
}

// Determine whether a room is locked (requires code) based on env flags.
// Resolution order:
// 1) VITE_LOCK_<ROOM_ID_AS_ENV> (e.g., VITE_LOCK_CHRISTMAS_ROOM)
// 2) Legacy alias for christmas-room: VITE_LOCK_CHRISTMAS_ROOM
// 3) VITE_LOCK_DEFAULT (applies to all rooms not explicitly set)
// 4) Default: true (locked)
export function lockForRoom(id: string): boolean {
  const env = (import.meta as any).env ?? {}
  const specificKey = `VITE_LOCK_${toEnvNameFromId(id)}`
  if (specificKey in env) return parseBool(env[specificKey], true)
  // Legacy alias (kept for back-compat); same as specific for christmas-room
  if (id === 'christmas-room' && 'VITE_LOCK_CHRISTMAS_ROOM' in env) {
    return parseBool(env['VITE_LOCK_CHRISTMAS_ROOM'], true)
  }
  if ('VITE_LOCK_DEFAULT' in env) return parseBool(env['VITE_LOCK_DEFAULT'], true)
  return true
}
