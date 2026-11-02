import { EventEditor } from '@/components/admin/EventEditor'
import { ADMIN } from '@/lib/constants/admin'

export default async function EditEventPage({ params }: PageProps<'/admin/event/[id]'>) {
  const { id } = await params
  return <EventEditor title={ADMIN.editor.editTitle} eventId={id} />
}
