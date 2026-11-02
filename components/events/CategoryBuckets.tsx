import { ArrowUpRight } from 'lucide-react'
import { SectionHeader } from '@/components/common/SectionHeader'
import { CATEGORY_META, EVENTS_PAGE } from '@/lib/constants/site'
import { EVENT_CATEGORIES, type EventCategory } from '@/lib/types/event'
import { cn } from '@/lib/utils'

interface CategoryBucketsProps {
  counts: Record<EventCategory, number>
  active: EventCategory | null
  onSelect: (category: EventCategory) => void
}

export function CategoryBuckets({ counts, active, onSelect }: CategoryBucketsProps) {
  const { categories } = EVENTS_PAGE

  return (
    <section aria-labelledby="categories-title" className="flex flex-col gap-10">
      <SectionHeader
        id="categories-title"
        index={categories.index}
        eyebrow={categories.eyebrow}
        title={categories.title}
        highlight={categories.highlight}
      />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {EVENT_CATEGORIES.map((category) => {
          const isActive = active === category
          const meta = CATEGORY_META[category]
          return (
            <li key={category}>
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => onSelect(category)}
                className={cn(
                  'focus-ring group relative flex h-full min-h-60 w-full flex-col justify-between gap-8 overflow-hidden rounded-2xl border p-6 text-left shadow-soft',
                  'transition-[background-color,box-shadow,transform,border-color,color] duration-200 motion-reduce:transition-none',
                  'hover:-translate-y-1 hover:shadow-lift motion-reduce:hover:translate-y-0',
                  isActive
                    ? 'border-cobalt bg-cobalt text-paper'
                    : 'border-line bg-paper text-midnight hover:border-cobalt',
                )}
              >
                <span className="flex items-center justify-between gap-4">
                  <span
                    className={cn(
                      'font-display text-3xl leading-none italic',
                      isActive ? 'text-paper/70' : 'text-cobalt',
                    )}
                  >
                    {meta.numeral}
                  </span>
                  <span
                    className={cn(
                      'inline-flex size-9 items-center justify-center rounded-full border transition-[transform,background-color,border-color,color] motion-reduce:transition-none',
                      isActive
                        ? 'border-paper/30 text-paper'
                        : 'border-line text-midnight group-hover:rotate-45 group-hover:border-cobalt group-hover:bg-cobalt group-hover:text-paper motion-reduce:group-hover:rotate-0',
                    )}
                  >
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </span>
                </span>
                <span>
                  <span className="block font-display text-4xl leading-none font-bold">{category}</span>
                  <span
                    className={cn(
                      'mt-3 block text-sm leading-relaxed',
                      isActive ? 'text-paper/85' : 'text-ink-muted',
                    )}
                  >
                    {meta.blurb}
                  </span>
                  <span
                    className={cn(
                      'mt-5 block text-xs font-semibold tracking-[0.18em] uppercase tabular-nums',
                      isActive ? 'text-paper' : 'text-cobalt',
                    )}
                  >
                    {String(counts[category]).padStart(2, '0')} {categories.countSuffix}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
