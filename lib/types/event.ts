export const EVENT_CATEGORIES = ['Workshop', 'Competition', 'Talk', 'Meetup'] as const

export type EventCategory = (typeof EVENT_CATEGORIES)[number]

export type EventStatus = 'upcoming' | 'past'

export interface EcellEvent {
  id: string
  title: string
  category: EventCategory
  status: EventStatus
  date: string
  time: string
  location: string
  image: string
  description: string
  registerLink: string
  gallery?: string[]
}

export type NewEcellEvent = Omit<EcellEvent, 'id'>
