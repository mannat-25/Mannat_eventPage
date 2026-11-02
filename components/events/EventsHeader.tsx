import { ArrowDown } from 'lucide-react'
import { HeaderStats } from '@/components/events/HeaderStats'
import { EVENTS_PAGE } from '@/lib/constants/site'

export function EventsHeader() {
  const { header } = EVENTS_PAGE

  return (
    <section aria-labelledby="events-title" className="bg-paper">
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-16 md:px-8 md:pt-20 md:pb-20">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-7">
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.22em] text-ink-muted uppercase">
              <span aria-hidden="true" className="size-2 rounded-full bg-cobalt" />
              {header.eyebrow}
            </p>
            <h1
              id="events-title"
              className="mt-6 font-display text-[clamp(4.5rem,16vw,11rem)] leading-[0.85] font-bold tracking-tight text-midnight"
            >
              {header.title}
              <span aria-hidden="true" className="text-lime [-webkit-text-stroke:2px_var(--midnight)]">
                .
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-ink-muted md:text-lg">
              {header.description}
            </p>
            <a
              href="#explore"
              className="focus-ring mt-8 inline-flex items-center gap-2 rounded-sm border-b border-midnight/30 pb-1 text-sm font-medium text-midnight transition-colors hover:border-cobalt hover:text-cobalt motion-reduce:transition-none"
            >
              {header.explore}
              <ArrowDown aria-hidden="true" className="size-4" />
            </a>
          </div>

          <div className="lg:col-span-5">
            <div
              aria-hidden="true"
              className="flex aspect-[5/4] flex-col items-center justify-center gap-8 rounded-3xl bg-tint p-8"
            >
              <div className="flex aspect-square w-1/2 max-w-56 -rotate-6 items-center justify-center rounded-2xl bg-midnight shadow-lift">
                <span className="font-display text-[clamp(4rem,9vw,7rem)] leading-none font-bold text-paper italic">
                  {header.mark.slice(0, -1)}
                  <span className="text-lime">{header.mark.slice(-1)}</span>
                </span>
              </div>
              <p className="text-xs font-semibold tracking-[0.3em] text-midnight uppercase">{header.tagline}</p>
            </div>
          </div>
        </div>

        <HeaderStats />
      </div>
    </section>
  )
}
