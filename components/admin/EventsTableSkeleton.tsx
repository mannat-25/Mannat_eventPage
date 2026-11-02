import { ADMIN } from '@/lib/constants/admin'

const block = 'animate-pulse bg-tint motion-reduce:animate-none'

export function EventsTableSkeleton() {
  return (
    <div aria-busy="true" aria-label={ADMIN.list.loading} className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className={`${block} h-12 w-64`} />
        <div className={`${block} h-11 w-36`} />
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className={`${block} h-10 w-24`} />
        ))}
      </div>
      <div className="border-2 border-midnight bg-paper">
        <div className={`${block} h-12 w-full`} />
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 border-t-2 border-line px-4 py-3">
            <div className={`${block} size-14 shrink-0`} />
            <div className={`${block} h-4 flex-1`} />
            <div className={`${block} h-4 w-24`} />
            <div className={`${block} h-4 w-20`} />
            <div className={`${block} h-4 w-28`} />
          </div>
        ))}
      </div>
    </div>
  )
}
