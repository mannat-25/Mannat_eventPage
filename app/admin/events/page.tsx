import type { Metadata } from 'next'
import { EventsAdmin } from '@/components/admin/EventsAdmin'
import { ADMIN } from '@/lib/constants/admin'

export const metadata: Metadata = {
  title: ADMIN.meta.title,
  description: ADMIN.meta.description,
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminEventsPage() {
  return <EventsAdmin />
}
