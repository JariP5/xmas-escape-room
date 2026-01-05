import ChristmasRoom from './ChristmasRoom'
import DataLeakRoom from './DataLeakRoom'
import type { ComponentType } from 'react'

export type RoomDef = {
  id: string // url slug, e.g., "christmas-room"
  baseKey: string // i18n base key path under routes.*, e.g., 'christmasRoom'
  Component: ComponentType
  boardGameImage?: string // public path to an image of the required board game (optional)
  heroImage?: string // public path to a hero image representing the room theme (optional)
  thumbnailImage?: string // small image for list view (optional)
  difficulty?: string // e.g., "3/5" or localized string (optional)
  players?: string // e.g., "2–6" (optional)
}

// Central registry of available rooms. Add new rooms here.
export const rooms: RoomDef[] = [
  {
    id: 'christmas-room',
    baseKey: 'christmasRoom',
    Component: ChristmasRoom,
    boardGameImage: '/assets/boardgame-placeholder.svg',
    heroImage: '/assets/room-hero-placeholder.svg',
    thumbnailImage: '/assets/christmas-room/thumbnail.png',
    difficulty: '3/5',
    players: '2–6',
  },
  {
    id: 'data-leak',
    baseKey: 'dataLeakRoom',
    Component: DataLeakRoom,
    boardGameImage: '/assets/boardgame-placeholder.svg',
    heroImage: '/assets/room-hero-placeholder.svg',
    thumbnailImage: '/assets/room-hero-placeholder.svg',
    difficulty: '4/5',
    players: '2–8',
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
