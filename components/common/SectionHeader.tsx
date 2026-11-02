import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  id?: string
  index?: string
  eyebrow: string
  title: string
  highlight?: string
  aside?: React.ReactNode
  className?: string
}

export function HighlightedTitle({ title, highlight }: { title: string; highlight?: string }) {
  const at = highlight ? title.indexOf(highlight) : -1
  if (!highlight || at === -1) return <>{title}</>
  return (
    <>
      {title.slice(0, at)}
      <span className="text-cobalt italic">{highlight}</span>
      {title.slice(at + highlight.length)}
    </>
  )
}

export function SectionHeader({ id, index, eyebrow, title, highlight, aside, className }: SectionHeaderProps) {
  return (
    <header className={cn('flex flex-col gap-4 md:flex-row md:items-end md:justify-between', className)}>
      <div className="min-w-0">
        <p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-ink-muted uppercase">
          {index ? <span className="text-cobalt tabular-nums">{index}</span> : null}
          {index ? <span aria-hidden="true" className="h-px w-6 bg-line" /> : null}
          {eyebrow}
        </p>
        <h2
          id={id}
          className="font-display text-4xl leading-[1] font-bold text-balance text-midnight md:text-6xl"
        >
          <HighlightedTitle title={title} highlight={highlight} />
        </h2>
      </div>
      {aside ? <div className="shrink-0">{aside}</div> : null}
    </header>
  )
}
