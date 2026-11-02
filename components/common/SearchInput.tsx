import { useId } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  label: string
  placeholder?: string
  clearLabel?: string
  className?: string
  inputClassName?: string
}

export function SearchInput({
  value,
  onChange,
  label,
  placeholder,
  clearLabel = 'Clear search',
  className,
  inputClassName,
}: SearchInputProps) {
  const id = useId()

  return (
    <div className={cn('relative', className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-ink-muted"
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && value) onChange('')
        }}
        placeholder={placeholder}
        autoComplete="off"
        className={cn(
          'h-14 w-full rounded-full border border-line bg-paper pr-12 pl-13 text-base text-midnight shadow-soft placeholder:text-ink-muted/80',
          'transition-[border-color,box-shadow] duration-150 hover:border-tint-strong motion-reduce:transition-none',
          'focus-visible:border-cobalt focus-visible:ring-4 focus-visible:ring-cobalt/15 focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-40',
          '[&::-webkit-search-cancel-button]:appearance-none',
          inputClassName,
        )}
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label={clearLabel}
          className="focus-ring absolute top-1/2 right-3 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted hover:bg-tint hover:text-cobalt"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      ) : null}
    </div>
  )
}
