import { ArrowRight } from 'lucide-react'
import { Band } from '@/components/common/Band'
import { Button } from '@/components/common/Button'
import { Reveal } from '@/components/common/Reveal'
import { HighlightedTitle } from '@/components/common/SectionHeader'
import { EVENTS_PAGE } from '@/lib/constants/site'

export function CtaSection() {
  const { cta } = EVENTS_PAGE

  return (
    <Band tone="tint">
      <section aria-labelledby="cta-title">
        <Reveal>
          <div className="grid gap-10 rounded-3xl border border-line bg-paper p-8 shadow-soft md:p-14 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <p className="mb-4 flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-ink-muted uppercase">
                <span aria-hidden="true" className="size-2 rounded-full bg-lime ring-1 ring-midnight/20" />
                {cta.eyebrow}
              </p>
              <h2
                id="cta-title"
                className="font-display text-5xl leading-[0.95] font-bold text-balance text-midnight md:text-7xl"
              >
                <HighlightedTitle title={cta.title} highlight={cta.highlight} />
              </h2>
            </div>
            <div className="flex flex-col justify-end gap-8 lg:col-span-5">
              <p className="text-pretty text-base leading-relaxed text-ink-muted md:text-lg">{cta.description}</p>
              <div className="flex flex-wrap gap-3">
                <Button href={cta.primary.href} size="lg">
                  {cta.primary.label}
                  <ArrowRight aria-hidden="true" />
                </Button>
                <Button href={cta.secondary.href} variant="secondary" size="lg">
                  {cta.secondary.label}
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </Band>
  )
}
