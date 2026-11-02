import Link from 'next/link'
import { ArrowUpRight, Clock, MapPin } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { EventImage } from '@/components/common/EventImage'
import { EVENTS_PAGE, EVENT_DETAIL } from '@/lib/constants/site'
import type { EcellEvent } from '@/lib/types/event'
import { cn } from '@/lib/utils'
import { dateParts, formatDate } from '@/lib/utils/formatDate'

type Variant = 'featured' | 'compact' | 'archive'

interface EventCardProps {
  event: EcellEvent
  variant?: Variant
  priority?: boolean
}

const cardBase =
  'group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper text-midnight shadow-soft transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-tint-strong hover:shadow-lift motion-reduce:transition-none motion-reduce:hover:translate-y-0'

function CategoryTag({ category, className }: { category: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-paper px-2.5 py-1 text-[11px] font-semibold tracking-[0.12em] text-cobalt uppercase',
        className,
      )}
    >
      {category}
    </span>
  )
}

function RegisterButton({ event }: { event: EcellEvent }) {
  if (!event.registerLink) {
    return (
      <Button size="sm" disabled>
        {EVENT_DETAIL.closed}
      </Button>
    )
  }
  return (
    <Button
      href={event.registerLink}
      size="sm"
      aria-label={`${EVENTS_PAGE.upcoming.register} for ${event.title} (opens in new tab)`}
    >
      {EVENTS_PAGE.upcoming.register}
      <ArrowUpRight aria-hidden="true" />
    </Button>
  )
}

export function EventCard({ event, variant = 'compact', priority }: EventCardProps) {
  const { day, month, year } = dateParts(event.date)
  const detailsHref = `/events/${event.id}`

  if (variant === 'featured') {
    return (
      <article className={cardBase}>
        <div className="relative aspect-[16/10] overflow-hidden bg-tint">
          <EventImage
            src={event.image}
            alt={event.title}
            fallbackLabel={event.category}
            sizes="(min-width: 1024px) 58vw, 100vw"
            priority={priority}
            className="transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="inline-flex items-center rounded-full bg-lime px-2.5 py-1 text-[11px] font-semibold tracking-[0.12em] text-midnight uppercase">
              {EVENTS_PAGE.upcoming.badge}
            </span>
            <CategoryTag category={event.category} />
          </div>
        </div>

        <div className="grid flex-1 grid-cols-[auto_1fr] gap-x-6 gap-y-5 p-6 md:p-8">
          <time dateTime={event.date} className="flex flex-col items-start border-r border-line pr-6">
            <span className="font-display text-7xl leading-[0.8] font-bold text-cobalt md:text-8xl">{day}</span>
            <span className="mt-2 text-xs font-semibold tracking-[0.2em] text-ink-muted uppercase">
              {month} {year}
            </span>
          </time>
          <div className="min-w-0">
            <h3 className="font-display text-3xl leading-[1.05] font-bold text-pretty break-words line-clamp-3 md:text-5xl">
              {event.title}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-muted">
              <li className="flex min-w-0 items-center gap-1.5">
                <MapPin aria-hidden="true" className="size-4 shrink-0 text-cobalt" />
                <span className="truncate">{event.location}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Clock aria-hidden="true" className="size-4 shrink-0 text-cobalt" />
                {event.time}
              </li>
            </ul>
          </div>
          <p className="col-span-2 text-pretty leading-relaxed text-ink-muted line-clamp-3">{event.description}</p>
          <div className="col-span-2 mt-auto flex flex-wrap gap-3">
            <Button href={detailsHref} variant="secondary" size="sm" aria-label={`View details for ${event.title}`}>
              {EVENTS_PAGE.upcoming.viewDetails}
            </Button>
            <RegisterButton event={event} />
          </div>
        </div>
      </article>
    )
  }

  if (variant === 'archive') {
    return (
      <article className="group grid grid-cols-[4.5rem_1fr] items-center gap-4 border-b border-tint-strong py-5 transition-colors hover:bg-paper motion-reduce:transition-none sm:grid-cols-[5.5rem_9rem_1fr_auto] sm:gap-6 md:rounded-xl md:px-4">
        <time dateTime={event.date} className="flex flex-col">
          <span className="font-display text-5xl leading-[0.85] font-bold text-midnight transition-colors group-hover:text-cobalt motion-reduce:transition-none">
            {day}
          </span>
          <span className="mt-1 text-[11px] font-semibold tracking-[0.2em] text-ink-muted uppercase">
            {month} {year}
          </span>
        </time>
        <div className="relative hidden aspect-[4/3] overflow-hidden rounded-lg bg-tint-strong sm:block">
          <EventImage
            src={event.image}
            alt=""
            fallbackLabel={event.category.slice(0, 1)}
            sizes="144px"
            className="grayscale transition-[filter] duration-300 group-hover:grayscale-0 motion-reduce:transition-none"
          />
        </div>
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <CategoryTag category={event.category} className="border border-tint-strong" />
            <span className="flex min-w-0 items-center gap-1 text-xs text-ink-muted">
              <MapPin aria-hidden="true" className="size-3.5 shrink-0" />
              <span className="truncate">{event.location}</span>
            </span>
          </div>
          <h3 className="font-display text-2xl leading-tight font-bold break-words text-midnight md:text-3xl">
            <Link
              href={detailsHref}
              className="focus-ring rounded-sm transition-colors group-hover:text-cobalt motion-reduce:transition-none"
            >
              {event.title}
            </Link>
          </h3>
        </div>
        <div className="col-span-2 sm:col-span-1 sm:justify-self-end">
          {event.gallery?.length ? (
            <Link
              href={`${detailsHref}#gallery`}
              aria-label={`${EVENTS_PAGE.past.highlights} from ${event.title}`}
              className="focus-ring inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-cobalt underline decoration-cobalt/30 underline-offset-4 hover:decoration-cobalt"
            >
              {EVENTS_PAGE.past.highlights}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          ) : (
            <span className="sr-only">{formatDate(event.date)}</span>
          )}
        </div>
      </article>
    )
  }

  return (
    <article className={cn(cardBase, 'sm:flex-row lg:flex-col xl:flex-row')}>
      <div className="relative aspect-[16/9] shrink-0 overflow-hidden bg-tint sm:aspect-auto sm:w-2/5 lg:aspect-[16/9] lg:w-full xl:aspect-auto xl:w-2/5">
        <EventImage
          src={event.image}
          alt={event.title}
          fallbackLabel={event.category}
          sizes="(min-width: 1280px) 16vw, (min-width: 1024px) 40vw, (min-width: 640px) 40vw, 100vw"
        />
        <CategoryTag category={event.category} className="absolute top-3 left-3" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-4 p-5">
        <time dateTime={event.date} className="flex items-baseline gap-2">
          <span className="font-display text-5xl leading-none font-bold text-cobalt">{day}</span>
          <span className="text-xs font-semibold tracking-[0.2em] text-ink-muted uppercase">
            {month} {year}
          </span>
        </time>
        <h3 className="font-display text-2xl leading-tight font-bold text-pretty break-words line-clamp-3">
          {event.title}
        </h3>
        <p className="flex min-w-0 items-center gap-1.5 text-sm text-ink-muted">
          <MapPin aria-hidden="true" className="size-4 shrink-0 text-cobalt" />
          <span className="truncate">{event.location}</span>
          <span aria-hidden="true" className="text-line">
            /
          </span>
          <span className="shrink-0">{event.time}</span>
        </p>
        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          <Button href={detailsHref} variant="secondary" size="sm" aria-label={`View details for ${event.title}`}>
            {EVENTS_PAGE.upcoming.viewDetails}
          </Button>
          <RegisterButton event={event} />
        </div>
      </div>
    </article>
  )
}
