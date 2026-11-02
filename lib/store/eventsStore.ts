import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { MOCK_EVENTS } from '@/lib/data/events'
import type { EcellEvent, NewEcellEvent } from '@/lib/types/event'

interface EventsState {
  events: EcellEvent[]
  addEvent: (event: NewEcellEvent) => string
  updateEvent: (id: string, patch: Partial<NewEcellEvent>) => void
  deleteEvent: (id: string) => void
  duplicateEvent: (id: string) => string | null
  reorderEvents: (fromIndex: number, toIndex: number) => void
  resetToDefault: () => void
}

const createId = (base: string) =>
  `${base}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 40) || 'event'

export const useEventsStore = create<EventsState>()(
  persist(
    (set, get) => ({
      events: MOCK_EVENTS,

      addEvent: (event) => {
        const id = createId(slugify(event.title))
        set((state) => ({ events: [...state.events, { ...event, id }] }))
        return id
      },

      updateEvent: (id, patch) =>
        set((state) => ({
          events: state.events.map((event) => (event.id === id ? { ...event, ...patch } : event)),
        })),

      deleteEvent: (id) =>
        set((state) => ({ events: state.events.filter((event) => event.id !== id) })),

      duplicateEvent: (id) => {
        const events = get().events
        const index = events.findIndex((event) => event.id === id)
        if (index === -1) return null
        const source = events[index]
        const copy: EcellEvent = { ...source, id: createId(source.id), title: `${source.title} (Copy)` }
        const next = [...events]
        next.splice(index + 1, 0, copy)
        set({ events: next })
        return copy.id
      },

      reorderEvents: (fromIndex, toIndex) =>
        set((state) => {
          const { events } = state
          if (
            fromIndex === toIndex ||
            fromIndex < 0 ||
            toIndex < 0 ||
            fromIndex >= events.length ||
            toIndex >= events.length
          ) {
            return state
          }
          const next = [...events]
          const [moved] = next.splice(fromIndex, 1)
          next.splice(toIndex, 0, moved)
          return { events: next }
        }),

      resetToDefault: () => set({ events: MOCK_EVENTS }),
    }),
    {
      name: 'ecell-events',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ events: state.events }),
    },
  ),
)
