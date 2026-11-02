import { EventCard } from '@/components/cards/EventCard'
import { Reveal } from '@/components/common/Reveal'
import { SectionHeader } from '@/components/common/SectionHeader'
import { EVENTS_PAGE } from '@/lib/constants/site'
import type { EcellEvent } from '@/lib/types/event'

export function CountPill({ value }: { value: number }) {
  return (
    <span className="inline-flex h-10 items-center rounded-full border border-line bg-paper px-4 font-display text-2xl text-midnight tabular-nums">
      {String(value).padStart(2, '0')}
    </span>
  )
}

export function UpcomingSection({ events, total }: { events: EcellEvent[]; total: number }) {
  const { upcoming } = EVENTS_PAGE
  const [featured, ...rest] = events
  const side = rest.slice(0, 2)
  const overflow = rest.slice(2)

  return (
    <section aria-labelledby="upcoming-title" className="flex flex-col gap-10">
      <SectionHeader
        id="upcoming-title"
        index={upcoming.index}
        eyebrow={upcoming.eyebrow}
        title={upcoming.title}
        highlight={upcoming.highlight}
        aside={<CountPill value={total} />}
      />

      <div className="grid gap-6 lg:grid-cols-12">
        {featured ? (
          <Reveal className={side.length ? 'lg:col-span-7' : 'lg:col-span-12'}>
            <EventCard event={featured} variant="featured" priority />
          </Reveal>
        ) : null}
        {side.length ? (
          <div className="flex flex-col gap-6 lg:col-span-5">
            {side.map((event, index) => (
              <Reveal key={event.id} delay={0.08 * (index + 1)} className="flex-1">
                <EventCard event={event} variant="compact" />
              </Reveal>
            ))}
          </div>
        ) : null}
      </div>

      {overflow.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {overflow.map((event, index) => (
            <Reveal key={event.id} delay={0.05 * (index % 3)}>
              <EventCard event={event} variant="compact" />
            </Reveal>
          ))}
        </div>
      ) : null}
    </section>
  )
}
