import Link from 'next/link'
import { ADMIN } from '@/lib/constants/admin'

export function EventEditorPlaceholder({ title }: { title: string }) {
  return (
    <div className="border-2 border-midnight bg-paper p-8">
      <h1 className="font-display text-4xl font-bold text-midnight">{title}</h1>
      <p className="mt-3 max-w-lg text-ink-muted">{ADMIN.editor.placeholder}</p>
      <Link
        href="/admin/events"
        className="focus-ring mt-6 inline-flex h-11 items-center border-2 border-midnight bg-lime px-4 text-sm font-medium text-midnight"
      >
        {ADMIN.editor.back}
      </Link>
    </div>
  )
}
