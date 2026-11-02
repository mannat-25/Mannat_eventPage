import { cn } from '@/lib/utils'

interface FilterChipProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  label: string
  active: boolean
  count?: number
  variant?: 'chip' | 'tab'
}

export function FilterChip({
  label,
  active,
  count,
  variant = 'chip',
  className,
  ...props
}: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        'focus-ring inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium',
        'transition-[background-color,color,border-color] duration-150 motion-reduce:transition-none',
        'disabled:pointer-events-none disabled:opacity-40',
        active
          ? variant === 'tab'
            ? 'border-midnight bg-midnight text-paper'
            : 'border-cobalt bg-cobalt text-paper'
          : variant === 'tab'
            ? 'border-line bg-paper text-midnight hover:border-midnight'
            : 'border-cobalt bg-paper text-cobalt hover:bg-tint',
        className,
      )}
      {...props}
    >
      <span>{label}</span>
      {typeof count === 'number' ? (
        <span
          className={cn(
            'min-w-5 rounded-full px-1.5 text-center text-[11px] tabular-nums',
            active ? 'bg-paper/20 text-paper' : 'bg-tint text-cobalt',
          )}
        >
          {count}
        </span>
      ) : null}
    </button>
  )
}
