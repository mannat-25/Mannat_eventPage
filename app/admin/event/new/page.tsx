import { EventEditorPlaceholder } from '@/components/admin/EventEditorPlaceholder'
import { ADMIN } from '@/lib/constants/admin'

export default function NewEventPage() {
  return <EventEditorPlaceholder title={ADMIN.editor.newTitle} />
}
