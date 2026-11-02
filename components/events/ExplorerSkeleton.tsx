import { Band } from '@/components/common/Band'

const block = 'animate-pulse rounded-2xl bg-tint motion-reduce:animate-none'

export function ExplorerSkeleton() {
  return (
    <Band>
      <div aria-busy="true" aria-label="Loading events" className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <div className={`${block} h-14 w-full rounded-full`} />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className={`${block} h-10 w-24 rounded-full`} />
            ))}
          </div>
        </div>
        <div className={`${block} h-20 w-2/3`} />
        <div className="grid gap-6 lg:grid-cols-12">
          <div className={`${block} h-[34rem] lg:col-span-7`} />
          <div className="flex flex-col gap-6 lg:col-span-5">
            <div className={`${block} h-64`} />
            <div className={`${block} h-64`} />
          </div>
        </div>
      </div>
    </Band>
  )
}
