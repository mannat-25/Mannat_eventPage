import type { Metadata } from 'next'
import { CtaSection } from '@/components/events/CtaSection'
import { EventsExplorer } from '@/components/events/EventsExplorer'
import { EventsHeader } from '@/components/events/EventsHeader'
import { MarqueeStrip } from '@/components/events/MarqueeStrip'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { EVENTS_PAGE } from '@/lib/constants/site'

export const metadata: Metadata = {
  title: EVENTS_PAGE.meta.title,
  description: EVENTS_PAGE.meta.description,
}

export default function EventsPage() {
  return (
    <>
      <Navbar />
      <main id="main">
        <EventsHeader />
        <MarqueeStrip />
        <EventsExplorer />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}
