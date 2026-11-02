import { Button } from '@/components/common/Button'
import { EVENTS_PAGE } from '@/lib/constants/site'

export function EmptyState({ onClear }: { onClear: () => void }) {
  const { empty, filters } = EVENTS_PAGE

  return (
    <div className="flex flex-col items-start gap-6 rounded-2xl border border-dashed border-tint-strong bg-tint p-8 md:p-14">
      <p aria-hidden="true" className="font-display text-8xl leading-none font-bold text-cobalt italic">
        0
      </p>
      <h2 className="font-display text-4xl font-bold text-balance text-midnight md:text-5xl">{empty.title}</h2>
      <p className="max-w-md text-pretty leading-relaxed text-ink-muted">{empty.description}</p>
      <Button onClick={onClear}>{filters.clear}</Button>
    </div>
  )
}
