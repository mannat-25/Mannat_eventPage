import { EventCard } from '@/components/cards/EventCard'
import { Reveal } from '@/components/common/Reveal'
import { SectionHeader } from '@/components/common/SectionHeader'
import { CountPill } from '@/components/events/UpcomingSection'
import { EVENTS_PAGE } from '@/lib/constants/site'
import type { EcellEvent } from '@/lib/types/event'

export function PastSection({ events, total }: { events: EcellEvent[]; total: number }) {
  const { past } = EVENTS_PAGE

  return (
    <section aria-labelledby="past-title" className="flex flex-col gap-6">
      <SectionHeader
        id="past-title"
        index={past.index}
        eyebrow={past.eyebrow}
        title={past.title}
        highlight={past.highlight}
        aside={<CountPill value={total} />}
      />
      <ol className="border-t border-tint-strong">
        {events.map((event) => (
          <Reveal key={event.id} as="li">
            <EventCard event={event} variant="archive" />
          </Reveal>
        ))}
      </ol>
    </section>
  )
}
