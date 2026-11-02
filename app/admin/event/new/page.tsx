import { EventEditor } from '@/components/admin/EventEditor'
import { ADMIN } from '@/lib/constants/admin'

export default function NewEventPage() {
  return <EventEditor title={ADMIN.editor.newTitle} />
}
