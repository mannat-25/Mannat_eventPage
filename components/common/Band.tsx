import { cn } from '@/lib/utils'

interface BandProps {
  tone?: 'white' | 'tint'
  className?: string
  innerClassName?: string
  children: React.ReactNode
}

/** Full-bleed section background with a centred content column. */
export function Band({ tone = 'white', className, innerClassName, children }: BandProps) {
  return (
    <div className={cn('py-16 md:py-24', tone === 'tint' ? 'bg-tint' : 'bg-paper', className)}>
      <div className={cn('mx-auto max-w-7xl px-4 md:px-8', innerClassName)}>{children}</div>
    </div>
  )
}
