import type { Metadata } from 'next'
import { AdminShell } from '@/components/admin/AdminShell'
import { AuthGuard } from '@/components/admin/AuthGuard'
import { ADMIN } from '@/lib/constants/admin'

export const metadata: Metadata = {
  title: ADMIN.meta.title,
  description: ADMIN.meta.description,
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AdminShell>{children}</AdminShell>
    </AuthGuard>
  )
}
