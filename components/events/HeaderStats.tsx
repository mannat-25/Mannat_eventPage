'use client'

import { EVENTS_PAGE } from '@/lib/constants/site'
import { useEvents, useEventsHydrated } from '@/lib/services/eventsService'

export function HeaderStats() {
  const events = useEvents()
  const hydrated = useEventsHydrated()
  const { stats } = EVENTS_PAGE.header

  const items = [
    { label: stats.total, value: events.length },
    { label: stats.upcoming, value: events.filter((event) => event.status === 'upcoming').length },
    { label: stats.categories, value: new Set(events.map((event) => event.category)).size },
  ]

  return (
    <dl
      className="mt-14 grid grid-cols-3 divide-x divide-line border-y border-line md:mt-20"
      aria-busy={!hydrated}
    >
      {items.map((item) => (
        <div key={item.label} className="flex flex-col-reverse gap-2 px-3 py-6 first:pl-0 md:px-8 md:first:pl-0">
          <dt className="text-[11px] font-semibold tracking-[0.16em] text-ink-muted uppercase md:text-xs">
            {item.label}
          </dt>
          <dd className="font-display text-4xl leading-none font-bold text-midnight tabular-nums md:text-6xl">
            {hydrated ? (
              String(item.value).padStart(2, '0')
            ) : (
              <span className="inline-block h-10 w-14 animate-pulse rounded-md bg-tint motion-reduce:animate-none md:h-14" />
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}
