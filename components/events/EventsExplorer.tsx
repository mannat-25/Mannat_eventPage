'use client'

import { useDeferredValue, useMemo, useState } from 'react'
import { Band } from '@/components/common/Band'
import { FilterChip } from '@/components/common/FilterChip'
import { SearchInput } from '@/components/common/SearchInput'
import { Button } from '@/components/common/Button'
import { CategoryBuckets } from '@/components/events/CategoryBuckets'
import { EmptyState } from '@/components/events/EmptyState'
import { ExplorerSkeleton } from '@/components/events/ExplorerSkeleton'
import { PastSection } from '@/components/events/PastSection'
import { UpcomingSection } from '@/components/events/UpcomingSection'
import { EVENTS_PAGE } from '@/lib/constants/site'
import { useEvents, useEventsHydrated } from '@/lib/services/eventsService'
import { EVENT_CATEGORIES, type EcellEvent, type EventCategory } from '@/lib/types/event'

type StatusTab = (typeof EVENTS_PAGE.filters.tabs)[number]['value']

const PAGE_SIZE = EVENTS_PAGE.loadMore.pageSize

const matchesQuery = (event: EcellEvent, query: string) => {
  if (!query) return true
  const haystack = `${event.title} ${event.location} ${event.description} ${event.category}`.toLowerCase()
  return haystack.includes(query)
}

export function EventsExplorer() {
  const events = useEvents()
  const hydrated = useEventsHydrated()
  const { filters, loadMore } = EVENTS_PAGE

  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<StatusTab>('all')
  const [category, setCategory] = useState<EventCategory | null>(null)
  const [visible, setVisible] = useState<number>(PAGE_SIZE)
  const deferredQuery = useDeferredValue(query.trim().toLowerCase())

  const resetPaging = () => setVisible(PAGE_SIZE)
  const updateQuery = (value: string) => {
    setQuery(value)
    resetPaging()
  }
  const updateTab = (value: StatusTab) => {
    setTab(value)
    resetPaging()
  }
  const updateCategory = (value: EventCategory | null) => {
    setCategory(value)
    resetPaging()
  }
  const clearAll = () => {
    setQuery('')
    setTab('all')
    setCategory(null)
    resetPaging()
  }

  const categoryCounts = useMemo(() => {
    const counts = Object.fromEntries(EVENT_CATEGORIES.map((name) => [name, 0])) as Record<EventCategory, number>
    for (const event of events) counts[event.category] += 1
    return counts
  }, [events])

  const { upcoming, past } = useMemo(() => {
    const filtered = events.filter(
      (event) =>
        (tab === 'all' || event.status === tab) &&
        (!category || event.category === category) &&
        matchesQuery(event, deferredQuery),
    )
    return {
      upcoming: filtered.filter((event) => event.status === 'upcoming'),
      past: filtered.filter((event) => event.status === 'past'),
    }
  }, [events, tab, category, deferredQuery])

  if (!hydrated) return <ExplorerSkeleton />

  const total = upcoming.length + past.length
  const shownUpcoming = upcoming.slice(0, visible)
  const shownPast = past.slice(0, visible)
  const shownCount = shownUpcoming.length + shownPast.length
  const hasMore = shownCount < total
  const isFiltered = Boolean(query) || tab !== 'all' || category !== null

  const selectBucket = (value: EventCategory) => {
    updateCategory(category === value ? null : value)
    document.getElementById('explore')?.scrollIntoView({ block: 'start' })
  }

  const loadMoreBlock = hasMore ? (
    <div className="mt-12 flex flex-col items-center gap-3">
      <Button variant="secondary" size="lg" onClick={() => setVisible((value) => value + PAGE_SIZE)}>
        {loadMore.label}
      </Button>
      <p className="text-xs text-ink-muted tabular-nums">
        {shownCount} / {total}
      </p>
    </div>
  ) : null
  const showPast = total > 0 && shownPast.length > 0

  return (
    <>
      <Band>
      <div id="explore" className="flex scroll-mt-28 flex-col gap-4">
        <SearchInput
          value={query}
          onChange={updateQuery}
          label={filters.searchLabel}
          placeholder={filters.searchPlaceholder}
        />
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label={filters.tabsLabel} className="flex gap-2">
            {filters.tabs.map((item) => (
              <FilterChip
                key={item.value}
                variant="tab"
                label={item.label}
                active={tab === item.value}
                onClick={() => updateTab(item.value)}
              />
            ))}
          </div>
          <div
            role="group"
            aria-label={filters.categoriesLabel}
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:px-0 lg:pb-0"
          >
            <FilterChip
              label={filters.allCategories}
              active={category === null}
              onClick={() => updateCategory(null)}
            />
            {EVENT_CATEGORIES.map((name) => (
              <FilterChip
                key={name}
                label={name}
                count={categoryCounts[name]}
                active={category === name}
                onClick={() => updateCategory(category === name ? null : name)}
              />
            ))}
          </div>
        </div>
        <div className="flex min-h-9 items-center justify-between gap-4 border-t border-line pt-3">
          <p aria-live="polite" className="text-xs font-semibold tracking-[0.16em] text-ink-muted uppercase tabular-nums">
            {String(total).padStart(2, '0')} {filters.resultsSuffix}
          </p>
          {isFiltered ? (
            <button
              type="button"
              onClick={clearAll}
              className="focus-ring rounded-sm text-sm font-medium text-cobalt underline decoration-cobalt/30 underline-offset-4 hover:decoration-cobalt"
            >
              {filters.clear}
            </button>
          ) : null}
        </div>
      </div>

      {total === 0 ? (
        <div className="mt-16">
          <EmptyState onClear={clearAll} />
        </div>
      ) : shownUpcoming.length > 0 ? (
        <div className="mt-16 md:mt-20">
          <UpcomingSection events={shownUpcoming} total={upcoming.length} />
          {showPast ? null : loadMoreBlock}
        </div>
      ) : null}
      </Band>

      {showPast ? (
        <Band tone="tint">
          <PastSection events={shownPast} total={past.length} />
          {loadMoreBlock}
        </Band>
      ) : null}

      <Band className={showPast ? undefined : 'border-t border-line'}>
        <CategoryBuckets counts={categoryCounts} active={category} onSelect={selectBucket} />
      </Band>
    </>
  )
}
