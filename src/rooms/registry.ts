import ChristmasRoom from './ChristmasRoom'
import PatientDataLeakRoom from './PatientDataLeakRoom.tsx'
import type { ComponentType } from 'react'

export type RoomDef = {
  id: string // url slug, e.g., "christmas-room"
  baseKey: string // i18n base key path under routes.*, e.g., 'christmasRoom'
  Component: ComponentType
  boardGameImage?: string // public path to an image of the required board game (optional)
  thumbnailImage?: string // small image for list view (optional)
  difficulty?: number // integer 0–10 (visualized as /10)
  minPlayers?: number
  maxPlayers?: number
}

// Central registry of available rooms. Add new rooms here.
export const rooms: RoomDef[] = [
  {
    id: 'christmas-room',
    baseKey: 'christmasRoom',
    Component: ChristmasRoom,
    boardGameImage: '/assets/christmas-room/thumbnail.png',
    thumbnailImage: '/assets/christmas-room/thumbnail.png',
    difficulty: 6, // out of 10
    minPlayers: 3,
    maxPlayers: 6,
  },
  {
    id: 'patient-data-leak-room',
    baseKey: 'patientDataLeakRoom',
    Component: PatientDataLeakRoom,
    boardGameImage: '/assets/patient-data-leak-room/thumbnail.png',
    thumbnailImage: '/assets/patient-data-leak-room/thumbnail.png',
    difficulty: 9, // out of 10
    minPlayers: 3,
    maxPlayers: 8,
  },
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

export function areRoomsLocked(): boolean {
  const env = (import.meta as any).env ?? {}
  if ('VITE_LOCK_ROOMS' in env) return parseBool(env['VITE_LOCK_ROOMS'], true)
  return true
}
