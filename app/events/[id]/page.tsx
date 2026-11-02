import type { Metadata } from 'next'
import { EventDetail } from '@/components/events/EventDetail'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { MOCK_EVENTS } from '@/lib/data/events'
import { EVENT_DETAIL } from '@/lib/constants/site'

export async function generateMetadata({ params }: PageProps<'/events/[id]'>): Promise<Metadata> {
  const { id } = await params
  const event = MOCK_EVENTS.find((item) => item.id === id)
  return {
    title: event?.title ?? EVENT_DETAIL.notFoundTitle,
    description: event?.description,
  }
}

export default async function EventDetailPage({ params }: PageProps<'/events/[id]'>) {
  const { id } = await params
  return (
    <>
      <Navbar />
      <main id="main" className="mx-auto max-w-7xl px-4 pt-10 pb-24 md:px-8 md:pt-16">
        <EventDetail id={id} />
      </main>
      <Footer />
    </>
  )
}
