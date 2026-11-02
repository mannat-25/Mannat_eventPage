import { EventEditorPlaceholder } from '@/components/admin/EventEditorPlaceholder'
import { ADMIN } from '@/lib/constants/admin'

export default async function EditEventPage({ params }: PageProps<'/admin/event/[id]'>) {
  await params
  return <EventEditorPlaceholder title={ADMIN.editor.editTitle} />
}
