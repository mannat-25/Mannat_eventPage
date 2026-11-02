'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, Calendar, Clock, MapPin } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { EventImage } from '@/components/common/EventImage'
import { EVENT_DETAIL } from '@/lib/constants/site'
import { useEvent, useEventsHydrated } from '@/lib/services/eventsService'
import { formatDate } from '@/lib/utils/formatDate'

const block = 'animate-pulse rounded-2xl bg-tint motion-reduce:animate-none'

function BackLink() {
  return (
    <Link
      href="/events"
      className="focus-ring inline-flex w-fit items-center gap-2 rounded-sm text-sm font-medium text-ink-muted hover:text-cobalt"
    >
      <ArrowLeft aria-hidden="true" className="size-4" />
      {EVENT_DETAIL.back}
    </Link>
  )
}

export function EventDetail({ id }: { id: string }) {
  const hydrated = useEventsHydrated()
  const event = useEvent(id)

  if (!hydrated) {
    return (
      <div aria-busy="true" className="flex flex-col gap-6">
        <div className={`${block} h-5 w-28`} />
        <div className={`${block} h-28 w-3/4`} />
        <div className={`${block} aspect-[21/9] w-full`} />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="flex flex-col items-start gap-6">
        <BackLink />
        <h1 className="font-display text-5xl font-bold text-midnight md:text-7xl">{EVENT_DETAIL.notFoundTitle}</h1>
        <p className="text-ink-muted">{EVENT_DETAIL.notFoundDescription}</p>
      </div>
    )
  }

  const meta = [
    { icon: Calendar, label: EVENT_DETAIL.dateLabel, value: formatDate(event.date) },
    { icon: Clock, label: EVENT_DETAIL.timeLabel, value: event.time },
    { icon: MapPin, label: EVENT_DETAIL.locationLabel, value: event.location },
  ]

  return (
    <article className="flex flex-col gap-10">
      <div className="flex flex-col gap-6">
        <BackLink />
        <span className="w-fit rounded-full bg-tint px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-cobalt uppercase">
          {event.category}
        </span>
        <h1 className="max-w-5xl font-display text-5xl leading-[0.95] font-bold text-balance break-words text-midnight md:text-7xl">
          {event.title}
        </h1>
      </div>

      <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-tint shadow-soft md:aspect-[21/9]">
        <EventImage src={event.image} alt={event.title} fallbackLabel={event.category} sizes="100vw" priority />
      </div>

      <div className="grid gap-10 lg:grid-cols-12">
        <dl className="flex flex-col content-start divide-y divide-line rounded-2xl border border-line bg-paper shadow-soft lg:col-span-4">
          {meta.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex gap-3 p-5">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-tint text-cobalt">
                <Icon aria-hidden="true" className="size-4" />
              </span>
              <div>
                <dt className="text-[11px] font-semibold tracking-[0.16em] text-ink-muted uppercase">{label}</dt>
                <dd className="mt-1 text-midnight">{value}</dd>
              </div>
            </div>
          ))}
        </dl>
        <div className="flex flex-col items-start gap-8 lg:col-span-8">
          <p className="text-pretty text-lg leading-relaxed text-ink-muted md:text-xl">{event.description}</p>
          {event.registerLink ? (
            <Button href={event.registerLink} size="lg" aria-label={`${EVENT_DETAIL.register} (opens in new tab)`}>
              {EVENT_DETAIL.register}
              <ArrowUpRight aria-hidden="true" />
            </Button>
          ) : (
            <Button size="lg" disabled>
              {EVENT_DETAIL.closed}
            </Button>
          )}
        </div>
      </div>

      {event.gallery?.length ? (
        <section id="gallery" aria-labelledby="gallery-title" className="flex scroll-mt-28 flex-col gap-6">
          <h2 id="gallery-title" className="border-b border-line pb-4 font-display text-4xl font-bold text-midnight">
            {EVENT_DETAIL.galleryTitle}
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {event.gallery.map((src, index) => (
              <li key={`${src}-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-tint">
                <EventImage
                  src={src}
                  alt={`${event.title}, photo ${index + 1}`}
                  fallbackLabel={String(index + 1)}
                  sizes="(min-width: 640px) 50vw, 100vw"
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  )
}
