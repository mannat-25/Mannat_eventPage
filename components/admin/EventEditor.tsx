'use client'

import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { DeleteEventDialog } from '@/components/admin/DeleteEventDialog'
import { EventCard } from '@/components/cards/EventCard'
import { Button } from '@/components/common/Button'
import { eventsService, useEvent, useEventsHydrated } from '@/lib/services/eventsService'
import { EVENT_CATEGORIES, type EcellEvent } from '@/lib/types/event'

const MAX_IMAGE_SIZE = 2 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const eventSchema = z
  .object({
    title: z.string().trim().min(1, 'Enter an event title.').max(80, 'Title must be 80 characters or fewer.'),
    category: z.enum(EVENT_CATEGORIES),
    status: z.enum(['upcoming', 'past']),
    date: z.string(),
    time: z.string(),
    location: z.string(),
    description: z.string(),
    image: z.string(),
    registerLink: z.string().trim(),
    gallery: z.array(z.string()),
  })
  .superRefine((event, context) => {
    if (event.status === 'upcoming' && !event.registerLink) {
      context.addIssue({
        code: 'custom',
        path: ['registerLink'],
        message: 'A registration link is required for upcoming events.',
      })
    }

    if (event.registerLink) {
      const isValidUrl = z.string().url().safeParse(event.registerLink).success
      const isHttpUrl = /^https?:\/\//i.test(event.registerLink)
      if (!isValidUrl || !isHttpUrl) {
        context.addIssue({
          code: 'custom',
          path: ['registerLink'],
          message: 'Enter a valid http or https URL.',
        })
      }
    }
  })

const imageFileSchema = z
  .custom<File>((file) => typeof File !== 'undefined' && file instanceof File, 'Choose an image file.')
  .refine((file) => ALLOWED_IMAGE_TYPES.includes(file.type), 'Use a JPG, PNG, or WebP image.')
  .refine((file) => file.size <= MAX_IMAGE_SIZE, 'Image must be 2 MB or smaller.')

type EventFormValues = z.infer<typeof eventSchema>

const EMPTY_VALUES: EventFormValues = {
  title: '',
  category: EVENT_CATEGORIES[0],
  status: 'upcoming',
  date: '',
  time: '',
  location: '',
  description: '',
  image: '',
  registerLink: '',
  gallery: [],
}

function toTimeInputValue(time: string) {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return time

  let hours = Number(match[1]) % 12
  if (match[3].toUpperCase() === 'PM') hours += 12
  return `${String(hours).padStart(2, '0')}:${match[2]}`
}

function toStoredTime(time: string) {
  const match = time.match(/^(\d{2}):(\d{2})$/)
  if (!match) return time

  const hours = Number(match[1])
  const suffix = hours >= 12 ? 'PM' : 'AM'
  return `${String(hours % 12 || 12).padStart(2, '0')}:${match[2]} ${suffix}`
}

function getEventValues(event: EcellEvent): EventFormValues {
  return {
    title: event.title,
    category: event.category,
    status: event.status,
    date: event.date,
    time: toTimeInputValue(event.time),
    location: event.location,
    description: event.description,
    image: event.image,
    registerLink: event.registerLink,
    gallery: event.gallery ?? [],
  }
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} role="alert" className="mt-1 text-sm font-medium text-[#b42318]">
      {message}
    </p>
  )
}

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result)
      else reject(new Error('The selected image could not be read.'))
    }
    reader.onerror = () => reject(reader.error ?? new Error('The selected image could not be read.'))
    reader.readAsDataURL(file)
  })
}

function fileValidationMessage(file: File) {
  const result = imageFileSchema.safeParse(file)
  return result.success ? undefined : result.error.issues[0]?.message ?? 'Choose a supported image.'
}

interface EventEditorProps {
  title: string
  eventId?: string
}

export function EventEditor({ title, eventId }: EventEditorProps) {
  const router = useRouter()
  const hydrated = useEventsHydrated()
  const [createdId, setCreatedId] = useState<string | null>(null)
  const activeId = eventId ?? createdId ?? undefined
  const existingEvent = useEvent(activeId ?? '')
  const [initializedId, setInitializedId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; error: boolean } | null>(null)
  const [galleryError, setGalleryError] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const allowNavigation = useRef(false)

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    getFieldState,
    setValue,
    trigger,
    setError,
    clearErrors,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: EMPTY_VALUES,
    mode: 'onBlur',
  })

  const values = watch()
  const formReady = hydrated && initializedId === (activeId ?? '')

  useEffect(() => {
    if (!hydrated) return
    if (activeId && existingEvent?.id === activeId) {
      reset(getEventValues(existingEvent))
    } else if (!activeId) {
      reset(EMPTY_VALUES)
    }
    setInitializedId(activeId ?? '')
  }, [activeId, existingEvent?.id, hydrated, reset])

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(null), 4000)
    return () => window.clearTimeout(timeout)
  }, [toast])

  useEffect(() => {
    if (!isDirty) return

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (allowNavigation.current) return
      event.preventDefault()
      event.returnValue = ''
    }

    const currentUrl = window.location.href

    const handleClick = (event: MouseEvent) => {
      if (
        allowNavigation.current ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }

      const target = event.target
      if (!(target instanceof Element)) return
      const link = target.closest('a[href]')
      if (!(link instanceof HTMLAnchorElement) || link.target || link.hasAttribute('download')) return

      const destination = new URL(link.href, window.location.href)
      if (destination.origin !== window.location.origin || destination.href === window.location.href) return

      if (!window.confirm('You have unsaved changes. Leave this page?')) {
        event.preventDefault()
        event.stopPropagation()
        return
      }

      event.preventDefault()
      event.stopPropagation()
      allowNavigation.current = true
      router.push(`${destination.pathname}${destination.search}${destination.hash}`)
    }

    const handlePopState = (event: PopStateEvent) => {
      if (allowNavigation.current) return
      if (window.confirm('You have unsaved changes. Leave this page?')) {
        allowNavigation.current = true
        return
      }

      event.stopImmediatePropagation()
      window.history.pushState(null, '', currentUrl)
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('popstate', handlePopState, true)
    document.addEventListener('click', handleClick, true)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('popstate', handlePopState, true)
      document.removeEventListener('click', handleClick, true)
    }
  }, [isDirty, router])

  if (!formReady) {
    return (
      <div className="border-2 border-midnight bg-paper p-6 text-sm text-ink-muted" role="status">
        Loading event…
      </div>
    )
  }

  if (eventId && !existingEvent) {
    return (
      <section className="border-2 border-midnight bg-paper p-6 md:p-8">
        <h1 className="font-display text-4xl font-bold text-midnight">Event not found</h1>
        <p className="mt-2 text-sm text-ink-muted">This event may have been deleted or the link may be incorrect.</p>
        <Button
          href="/admin/events"
          className="mt-6 rounded-none border-2 border-midnight bg-lime text-midnight hover:bg-lime/90"
        >
          Back to events
        </Button>
      </section>
    )
  }

  const previewEvent: EcellEvent = {
    id: activeId ?? 'event-preview',
    title: values.title || 'Untitled event',
    category: values.category,
    status: values.status,
    date: values.date,
    time: values.time ? toStoredTime(values.time) : '',
    location: values.location,
    description: values.description,
    image: values.image,
    registerLink: values.registerLink,
    gallery: values.gallery,
  }

  const saveEvent = async (formValues: EventFormValues) => {
    const savedValues = {
      ...formValues,
      time: toStoredTime(formValues.time),
      gallery: formValues.gallery.length ? formValues.gallery : undefined,
    }

    try {
      if (activeId) {
        eventsService.update(activeId, savedValues)
      } else {
        const id = eventsService.create(savedValues)
        setCreatedId(id)
      }

      reset(formValues)
      setToast({ message: 'Event saved successfully.', error: false })
    } catch (error) {
      console.error('Unable to save the event.', error)
      setToast({
        message: 'Could not save the event. Check available browser storage and try again.',
        error: true,
      })
    }
  }

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget
    const file = input.files?.[0]
    input.value = ''
    if (!file) return

    const message = fileValidationMessage(file)
    if (message) {
      setError('image', { type: 'validate', message })
      return
    }

    try {
      const image = await readAsDataUrl(file)
      setValue('image', image, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
      clearErrors('image')
    } catch (error) {
      console.error('Unable to read the selected event image.', error)
      setError('image', { type: 'validate', message: 'The selected image could not be read.' })
    }
  }

  const handleGalleryChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget
    const files = Array.from(input.files ?? [])
    input.value = ''
    if (files.length === 0) return

    const invalidFile = files.find((file) => fileValidationMessage(file))
    if (invalidFile) {
      setGalleryError(fileValidationMessage(invalidFile) ?? 'Choose a supported image.')
      return
    }

    try {
      const images = await Promise.all(files.map(readAsDataUrl))
      setValue('gallery', [...getValues('gallery'), ...images], {
        shouldDirty: true,
        shouldTouch: true,
      })
      setGalleryError('')
    } catch (error) {
      console.error('Unable to read the selected gallery images.', error)
      setGalleryError('One or more selected images could not be read.')
    }
  }

  const leaveEditor = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Leave this page?')) return
    allowNavigation.current = true
    router.push('/admin/events')
  }

  const deleteEvent = (id: string) => {
    eventsService.remove(id)
    allowNavigation.current = true
    router.push('/admin/events')
  }

  const titleField = register('title')
  const categoryField = register('category')
  const statusField = register('status')
  const dateField = register('date')
  const timeField = register('time')
  const locationField = register('location')
  const descriptionField = register('description')
  const registerLinkField = register('registerLink')
  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    statusField.onChange(event)
    if (event.target.value === 'past' && !getValues('registerLink')) {
      clearErrors('registerLink')
    } else if (getFieldState('registerLink').isTouched) {
      void trigger('registerLink')
    }
  }

  return (
    <>
      <div className="mx-auto max-w-screen-2xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold text-paper md:text-5xl">
              {activeId ? 'Edit event' : title}
            </h1>
            <p className="mt-2 text-sm text-paper/70">Add event details and see the public card update live.</p>
          </div>
          <Button
            href="/admin/events"
            onClick={(event) => {
              if (!isDirty) return
              event.preventDefault()
              leaveEditor()
            }}
            className="w-fit rounded-none border-2 border-paper bg-transparent text-paper hover:bg-paper/10"
          >
            Back to events
          </Button>
        </div>

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]">
          <form
            noValidate
            onSubmit={handleSubmit(saveEvent)}
            className="min-w-0 border-2 border-midnight bg-paper p-4 sm:p-6"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="event-title" className="mb-1 block text-sm font-semibold text-midnight">
                  Title <span aria-hidden="true">*</span>
                </label>
                <input
                  {...titleField}
                  id="event-title"
                  type="text"
                  maxLength={80}
                  autoComplete="off"
                  aria-invalid={Boolean(errors.title)}
                  aria-describedby={errors.title ? 'event-title-error' : undefined}
                  className="h-11 w-full border-2 border-midnight bg-paper px-3 text-sm text-midnight outline-none focus:border-cobalt"
                />
                <div className="mt-1 flex items-start justify-between gap-3">
                  <FieldError id="event-title-error" message={errors.title?.message} />
                  <span className="ml-auto shrink-0 text-xs text-ink-muted">{values.title.length}/80</span>
                </div>
              </div>

              <div>
                <label htmlFor="event-category" className="mb-1 block text-sm font-semibold text-midnight">
                  Category
                </label>
                <select
                  {...categoryField}
                  id="event-category"
                  className="h-11 w-full border-2 border-midnight bg-paper px-3 text-sm text-midnight outline-none focus:border-cobalt"
                >
                  {EVENT_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="event-status" className="mb-1 block text-sm font-semibold text-midnight">
                  Status
                </label>
                <select
                  {...statusField}
                  id="event-status"
                  onChange={handleStatusChange}
                  className="h-11 w-full border-2 border-midnight bg-paper px-3 text-sm text-midnight outline-none focus:border-cobalt"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                </select>
              </div>

              <div>
                <label htmlFor="event-date" className="mb-1 block text-sm font-semibold text-midnight">
                  Date
                </label>
                <input
                  {...dateField}
                  id="event-date"
                  type="date"
                  className="h-11 w-full border-2 border-midnight bg-paper px-3 text-sm text-midnight outline-none focus:border-cobalt"
                />
              </div>

              <div>
                <label htmlFor="event-time" className="mb-1 block text-sm font-semibold text-midnight">
                  Time
                </label>
                <input
                  {...timeField}
                  id="event-time"
                  type="time"
                  className="h-11 w-full border-2 border-midnight bg-paper px-3 text-sm text-midnight outline-none focus:border-cobalt"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="event-location" className="mb-1 block text-sm font-semibold text-midnight">
                  Location
                </label>
                <input
                  {...locationField}
                  id="event-location"
                  type="text"
                  autoComplete="street-address"
                  className="h-11 w-full border-2 border-midnight bg-paper px-3 text-sm text-midnight outline-none focus:border-cobalt"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="event-description" className="mb-1 block text-sm font-semibold text-midnight">
                  Description
                </label>
                <textarea
                  {...descriptionField}
                  id="event-description"
                  rows={5}
                  className="w-full border-2 border-midnight bg-paper px-3 py-2 text-sm text-midnight outline-none focus:border-cobalt"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="event-register-link" className="mb-1 block text-sm font-semibold text-midnight">
                  Registration URL {values.status === 'upcoming' ? <span aria-hidden="true">*</span> : null}
                </label>
                <input
                  {...registerLinkField}
                  id="event-register-link"
                  type="url"
                  inputMode="url"
                  placeholder="https://example.com/register"
                  required={values.status === 'upcoming'}
                  aria-invalid={Boolean(errors.registerLink)}
                  aria-describedby={errors.registerLink ? 'event-register-link-error' : undefined}
                  className="h-11 w-full border-2 border-midnight bg-paper px-3 text-sm text-midnight outline-none focus:border-cobalt"
                />
                <FieldError id="event-register-link-error" message={errors.registerLink?.message} />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="event-image" className="mb-1 block text-sm font-semibold text-midnight">
                  Event image
                </label>
                <input
                  id="event-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  aria-invalid={Boolean(errors.image)}
                  aria-describedby={errors.image ? 'event-image-help event-image-error' : 'event-image-help'}
                  className="block min-h-11 w-full border-2 border-midnight bg-paper text-sm text-midnight file:mr-3 file:h-10 file:border-0 file:border-r-2 file:border-midnight file:bg-tint file:px-3 file:text-sm file:font-semibold file:text-midnight"
                />
                <p id="event-image-help" className="mt-1 text-xs text-ink-muted">
                  JPG, PNG, or WebP. Maximum file size: 2 MB.
                </p>
                <FieldError id="event-image-error" message={errors.image?.message} />
                {values.image ? (
                  <div className="mt-3 flex items-center gap-3 border border-line p-2">
                    <Image
                      src={values.image}
                      alt="Event image preview"
                      width={64}
                      height={64}
                      unoptimized
                      className="size-16 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setValue('image', '', { shouldDirty: true, shouldTouch: true })
                        clearErrors('image')
                      }}
                      className="focus-ring text-sm font-medium text-cobalt underline underline-offset-4"
                    >
                      Remove image
                    </button>
                  </div>
                ) : null}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="event-gallery" className="mb-1 block text-sm font-semibold text-midnight">
                  Gallery images
                </label>
                <input
                  id="event-gallery"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleGalleryChange}
                  aria-describedby={galleryError ? 'event-gallery-help event-gallery-error' : 'event-gallery-help'}
                  className="block min-h-11 w-full border-2 border-midnight bg-paper text-sm text-midnight file:mr-3 file:h-10 file:border-0 file:border-r-2 file:border-midnight file:bg-tint file:px-3 file:text-sm file:font-semibold file:text-midnight"
                />
                <p id="event-gallery-help" className="mt-1 text-xs text-ink-muted">
                  Optional. JPG, PNG, or WebP images, up to 2 MB each.
                </p>
                <FieldError id="event-gallery-error" message={galleryError} />
                {values.gallery.length > 0 ? (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {values.gallery.map((image, index) => (
                      <li
                        key={`${index}-${image.slice(0, 24)}`}
                        className="flex items-center gap-2 border border-line bg-paper p-2 text-xs text-midnight"
                      >
                        <span>Image {index + 1}</span>
                        <button
                          type="button"
                          aria-label={`Remove gallery image ${index + 1}`}
                          onClick={() =>
                            setValue(
                              'gallery',
                              values.gallery.filter((_, imageIndex) => imageIndex !== index),
                              { shouldDirty: true, shouldTouch: true },
                            )
                          }
                          className="focus-ring font-semibold text-[#b42318] underline underline-offset-2"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 border-t-2 border-line pt-5">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-none border-2 border-midnight bg-lime text-midnight hover:bg-lime/90"
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
              <Button
                type="button"
                onClick={leaveEditor}
                variant="secondary"
                className="rounded-none border-2"
              >
                Cancel
              </Button>
              {activeId ? (
                <Button
                  type="button"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="rounded-none border-2 border-[#b42318] bg-[#b42318] text-paper hover:bg-[#b42318]/90"
                >
                  Delete
                </Button>
              ) : null}
            </div>
          </form>

          <aside className="min-w-0 xl:sticky xl:top-20">
            <div className="mb-3">
              <h2 className="font-display text-2xl font-bold text-paper">Live preview</h2>
              <p className="mt-1 text-sm text-paper/70">This uses the same event card shown on the events page.</p>
            </div>
            <EventCard event={previewEvent} variant="compact" />
            {values.gallery.length > 0 ? (
              <p className="mt-3 text-sm text-paper/70">
                {values.gallery.length} gallery {values.gallery.length === 1 ? 'image' : 'images'}
              </p>
            ) : null}
          </aside>
        </div>
      </div>

      {toast ? (
        <div
          role={toast.error ? 'alert' : 'status'}
          className={`fixed right-4 bottom-4 z-50 max-w-sm border-2 px-4 py-3 text-sm font-medium shadow-lg ${
            toast.error
              ? 'border-[#b42318] bg-[#b42318] text-paper'
              : 'border-midnight bg-lime text-midnight'
          }`}
        >
          {toast.message}
        </div>
      ) : null}

      <DeleteEventDialog
        event={deleteDialogOpen ? existingEvent ?? null : null}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={deleteEvent}
      />
    </>
  )
}
