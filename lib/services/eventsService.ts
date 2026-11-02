'use client'

import { useSyncExternalStore } from 'react'
import { useEventsStore } from '@/lib/store/eventsStore'
import type { EcellEvent, NewEcellEvent } from '@/lib/types/event'

/*
 * Single seam between UI and data. Swap these implementations for real API
 * calls (e.g. SWR hooks + fetch) without touching components.
 */

const subscribeToHydration = (onChange: () => void) =>
  useEventsStore.persist.onFinishHydration(onChange)

export function useEventsHydrated(): boolean {
  return useSyncExternalStore(
    subscribeToHydration,
    () => useEventsStore.persist.hasHydrated(),
    () => false,
  )
}

export function useEvents(): EcellEvent[] {
  return useEventsStore((state) => state.events)
}

export function useEvent(id: string): EcellEvent | undefined {
  return useEventsStore((state) => state.events.find((event) => event.id === id))
}

export const eventsService = {
  getAll: (): EcellEvent[] => useEventsStore.getState().events,
  getById: (id: string): EcellEvent | undefined =>
    useEventsStore.getState().events.find((event) => event.id === id),
  create: (event: NewEcellEvent) => useEventsStore.getState().addEvent(event),
  update: (id: string, patch: Partial<NewEcellEvent>) =>
    useEventsStore.getState().updateEvent(id, patch),
  remove: (id: string) => useEventsStore.getState().deleteEvent(id),
  duplicate: (id: string) => useEventsStore.getState().duplicateEvent(id),
  reorder: (fromIndex: number, toIndex: number) =>
    useEventsStore.getState().reorderEvents(fromIndex, toIndex),
  reset: () => useEventsStore.getState().resetToDefault(),
}
