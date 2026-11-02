'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowDown, ArrowUp, ArrowUpDown, Copy, GripVertical, Pencil, Plus, Trash2 } from 'lucide-react'
import { DeleteEventDialog } from '@/components/admin/DeleteEventDialog'
import { EventsTableSkeleton } from '@/components/admin/EventsTableSkeleton'
import { Button } from '@/components/common/Button'
import { EventImage } from '@/components/common/EventImage'
import { FilterChip } from '@/components/common/FilterChip'
import { SearchInput } from '@/components/common/SearchInput'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ADMIN } from '@/lib/constants/admin'
import { eventsService, useEvents, useEventsHydrated } from '@/lib/services/eventsService'
import { EVENT_CATEGORIES, type EcellEvent, type EventCategory, type EventStatus } from '@/lib/types/event'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils/formatDate'

type StatusFilter = 'all' | EventStatus
type SortKey = 'featured' | 'title' | 'category' | 'status' | 'date'
type SortDir = 'asc' | 'desc'

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: ADMIN.list.all },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Past' },
]

const matchesQuery = (event: EcellEvent, query: string) => {
  if (!query) return true
  const haystack = `${event.title} ${event.location} ${event.category} ${event.description}`.toLowerCase()
  return haystack.includes(query)
}

const compareEvents = (a: EcellEvent, b: EcellEvent, key: SortKey, dir: SortDir) => {
  if (key === 'featured') return 0
  const left = key === 'date' ? a.date : String(a[key])
  const right = key === 'date' ? b.date : String(b[key])
  const cmp = left.localeCompare(right, undefined, { numeric: true, sensitivity: 'base' })
  return dir === 'asc' ? cmp : -cmp
}

function StatusBadge({ status }: { status: EventStatus }) {
  return (
    <span
      className={cn(
        'inline-flex border-2 px-2 py-0.5 text-[11px] font-semibold tracking-[0.12em] uppercase',
        status === 'upcoming'
          ? 'border-midnight bg-lime text-midnight'
          : 'border-cobalt bg-tint text-cobalt',
      )}
    >
      {status}
    </span>
  )
}

function SortButton({
  label,
  active,
  dir,
  onClick,
}: {
  label: string
  active: boolean
  dir: SortDir
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'focus-ring inline-flex items-center gap-1 text-xs font-semibold tracking-[0.12em] uppercase',
        active ? 'text-cobalt' : 'text-midnight',
      )}
    >
      {label}
      {active ? (
        dir === 'asc' ? (
          <ArrowUp className="size-3.5" aria-hidden="true" />
        ) : (
          <ArrowDown className="size-3.5" aria-hidden="true" />
        )
      ) : (
        <ArrowUpDown className="size-3.5 opacity-40" aria-hidden="true" />
      )}
    </button>
  )
}

export function EventsAdmin() {
  const events = useEvents()
  const hydrated = useEventsHydrated()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [category, setCategory] = useState<EventCategory | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('featured')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [pendingDelete, setPendingDelete] = useState<EcellEvent | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)

  const featuredId = useMemo(
    () => events.find((event) => event.status === 'upcoming')?.id ?? null,
    [events],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const next = events.filter(
      (event) =>
        (status === 'all' || event.status === status) &&
        (!category || event.category === category) &&
        matchesQuery(event, q),
    )
    if (sortKey === 'featured') return next
    return [...next].sort((a, b) => compareEvents(a, b, sortKey, sortDir))
  }, [events, query, status, category, sortKey, sortDir])

  const canReorder = sortKey === 'featured' && status === 'all' && category === null && !query.trim()

  const toggleSort = (key: SortKey) => {
    if (key === 'featured') {
      setSortKey('featured')
      setSortDir('asc')
      return
    }
    if (sortKey === key) {
      setSortDir((dir) => (dir === 'asc' ? 'desc' : 'asc'))
      return
    }
    setSortKey(key)
    setSortDir(key === 'date' ? 'desc' : 'asc')
  }

  const move = (id: string, direction: -1 | 1) => {
    const from = events.findIndex((event) => event.id === id)
    eventsService.reorder(from, from + direction)
  }

  const dropOn = (targetId: string) => {
    if (!draggingId || draggingId === targetId) return
    const from = events.findIndex((event) => event.id === draggingId)
    const to = events.findIndex((event) => event.id === targetId)
    eventsService.reorder(from, to)
    setDraggingId(null)
  }

  if (!hydrated) return <EventsTableSkeleton />

  const isFiltered = Boolean(query) || status !== 'all' || category !== null

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold text-paper md:text-5xl">{ADMIN.list.title}</h1>
          <p className="mt-2 max-w-xl text-sm text-paper/70">{ADMIN.list.reorderHint}</p>
        </div>
        <Button
          href={ADMIN.list.addHref}
          className="rounded-none border-2 border-midnight bg-lime text-midnight hover:bg-lime/90"
        >
          <Plus aria-hidden="true" />
          {ADMIN.list.add}
        </Button>
      </div>

      <div className="border-2 border-midnight bg-paper p-4 md:p-6">
        <SearchInput
          value={query}
          onChange={setQuery}
          label={ADMIN.list.searchLabel}
          placeholder={ADMIN.list.searchPlaceholder}
          inputClassName="h-11 rounded-none border-2 border-midnight shadow-none"
        />
        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label={ADMIN.list.statusLabel} className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((item) => (
              <FilterChip
                key={item.value}
                variant="tab"
                label={item.label}
                active={status === item.value}
                className="rounded-none border-2"
                onClick={() => setStatus(item.value)}
              />
            ))}
          </div>
          <div role="group" aria-label={ADMIN.list.categoryLabel} className="flex flex-wrap gap-2">
            <FilterChip
              label={ADMIN.list.all}
              active={category === null}
              className="rounded-none border-2"
              onClick={() => setCategory(null)}
            />
            {EVENT_CATEGORIES.map((name) => (
              <FilterChip
                key={name}
                label={name}
                active={category === name}
                className="rounded-none border-2"
                onClick={() => setCategory(category === name ? null : name)}
              />
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t-2 border-line pt-3">
          <p className="text-xs font-semibold tracking-[0.16em] text-ink-muted uppercase tabular-nums">
            {String(filtered.length).padStart(2, '0')} {ADMIN.list.countSuffix}
          </p>
          {isFiltered ? (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setStatus('all')
                setCategory(null)
              }}
              className="focus-ring text-sm font-medium text-cobalt underline underline-offset-4"
            >
              Clear filters
            </button>
          ) : null}
        </div>
        {canReorder ? null : (
          <p className="mt-3 text-xs text-ink-muted">{ADMIN.list.sortHint}</p>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="border-2 border-dashed border-lime bg-paper p-10">
          <h2 className="font-display text-3xl font-bold text-midnight">{ADMIN.list.emptyTitle}</h2>
          <p className="mt-2 max-w-md text-ink-muted">{ADMIN.list.emptyDescription}</p>
          <Button
            className="mt-6 rounded-none border-2"
            onClick={() => {
              setQuery('')
              setStatus('all')
              setCategory(null)
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="border-2 border-midnight bg-paper">
          <Table className="min-w-[860px]">
            <TableHeader>
              <TableRow className="border-midnight hover:bg-transparent">
                <TableHead className="w-10 px-3" />
                <TableHead className="w-16 px-3">Image</TableHead>
                <TableHead className="px-3">
                  <SortButton
                    label="Title"
                    active={sortKey === 'title'}
                    dir={sortDir}
                    onClick={() => toggleSort('title')}
                  />
                </TableHead>
                <TableHead className="px-3">
                  <SortButton
                    label="Category"
                    active={sortKey === 'category'}
                    dir={sortDir}
                    onClick={() => toggleSort('category')}
                  />
                </TableHead>
                <TableHead className="px-3">
                  <SortButton
                    label="Status"
                    active={sortKey === 'status'}
                    dir={sortDir}
                    onClick={() => toggleSort('status')}
                  />
                </TableHead>
                <TableHead className="px-3">
                  <SortButton
                    label="Date"
                    active={sortKey === 'date'}
                    dir={sortDir}
                    onClick={() => toggleSort('date')}
                  />
                </TableHead>
                <TableHead className="px-3">
                  <SortButton
                    label={ADMIN.list.featured}
                    active={sortKey === 'featured'}
                    dir={sortDir}
                    onClick={() => toggleSort('featured')}
                  />
                </TableHead>
                <TableHead className="px-3 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((event, index) => {
                const storeIndex = events.findIndex((item) => item.id === event.id)
                return (
                  <TableRow
                    key={event.id}
                    draggable={canReorder}
                    onDragStart={() => setDraggingId(event.id)}
                    onDragOver={(nativeEvent) => nativeEvent.preventDefault()}
                    onDrop={() => dropOn(event.id)}
                    onDragEnd={() => setDraggingId(null)}
                    className={cn(
                      'border-line',
                      draggingId === event.id && 'bg-tint',
                      featuredId === event.id && 'bg-tint/60',
                    )}
                  >
                    <TableCell className="px-2">
                      {canReorder ? (
                        <div className="flex flex-col items-center gap-1">
                          <span className="cursor-grab text-ink-muted" aria-hidden="true">
                            <GripVertical className="size-4" />
                          </span>
                          <button
                            type="button"
                            aria-label={ADMIN.list.actions.moveUp}
                            disabled={storeIndex <= 0}
                            onClick={() => move(event.id, -1)}
                            className="focus-ring text-midnight disabled:opacity-30"
                          >
                            <ArrowUp className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            aria-label={ADMIN.list.actions.moveDown}
                            disabled={storeIndex >= events.length - 1}
                            onClick={() => move(event.id, 1)}
                            className="focus-ring text-midnight disabled:opacity-30"
                          >
                            <ArrowDown className="size-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-ink-muted tabular-nums">{index + 1}</span>
                      )}
                    </TableCell>
                    <TableCell className="px-3">
                      <div className="relative size-14 overflow-hidden border-2 border-midnight bg-tint">
                        <EventImage
                          src={event.image}
                          alt=""
                          fallbackLabel={event.category.slice(0, 1)}
                          sizes="56px"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[280px] px-3 whitespace-normal">
                      <p className="font-medium text-pretty text-midnight">{event.title}</p>
                    </TableCell>
                    <TableCell className="px-3 text-cobalt">{event.category}</TableCell>
                    <TableCell className="px-3">
                      <StatusBadge status={event.status} />
                    </TableCell>
                    <TableCell className="px-3 tabular-nums text-midnight">{formatDate(event.date)}</TableCell>
                    <TableCell className="px-3">
                      {featuredId === event.id ? (
                        <span className="inline-flex border-2 border-midnight bg-lime px-2 py-0.5 text-[11px] font-semibold tracking-[0.12em] text-midnight uppercase">
                          {ADMIN.list.featured}
                        </span>
                      ) : (
                        <span className="text-xs text-ink-muted tabular-nums">#{storeIndex + 1}</span>
                      )}
                    </TableCell>
                    <TableCell className="px-3">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/admin/event/${event.id}`}
                          className="focus-ring inline-flex h-9 items-center gap-1 border-2 border-cobalt px-2 text-xs font-medium text-cobalt hover:bg-tint"
                        >
                          <Pencil className="size-3.5" aria-hidden="true" />
                          {ADMIN.list.actions.edit}
                        </Link>
                        <button
                          type="button"
                          onClick={() => eventsService.duplicate(event.id)}
                          className="focus-ring inline-flex h-9 items-center gap-1 border-2 border-midnight px-2 text-xs font-medium text-midnight hover:bg-tint"
                        >
                          <Copy className="size-3.5" aria-hidden="true" />
                          {ADMIN.list.actions.duplicate}
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(event)}
                          className="focus-ring inline-flex h-9 items-center gap-1 border-2 border-[#d92d20] px-2 text-xs font-medium text-[#d92d20] hover:bg-[#d92d20]/10"
                        >
                          <Trash2 className="size-3.5" aria-hidden="true" />
                          {ADMIN.list.actions.delete}
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <DeleteEventDialog
        event={pendingDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={(id) => {
          eventsService.remove(id)
          setPendingDelete(null)
        }}
      />
    </div>
  )
}
