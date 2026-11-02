'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, RotateCcw, X } from 'lucide-react'
import { Logo } from '@/components/common/Logo'
import { ADMIN } from '@/lib/constants/admin'
import { SITE } from '@/lib/constants/site'
import { eventsService } from '@/lib/services/eventsService'
import { cn } from '@/lib/utils'

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <ul className="flex flex-col gap-1 p-4">
      {ADMIN.nav.map((item) => {
        const active = item.enabled && (pathname === item.href || pathname.startsWith(`${item.href}/`))

        if (!item.enabled) {
          return (
            <li key={item.label}>
              <span
                aria-disabled="true"
                className="flex cursor-not-allowed items-center border-2 border-transparent px-3 py-2 text-sm font-medium text-paper/35"
              >
                {item.label}
              </span>
            </li>
          )
        }

        return (
          <li key={item.label}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'focus-ring flex items-center border-2 px-3 py-2 text-sm font-medium',
                active
                  ? 'border-lime bg-cobalt text-paper'
                  : 'border-transparent text-paper hover:border-cobalt hover:bg-cobalt/40',
              )}
            >
              {item.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-midnight font-sans text-paper">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r-2 border-paper/20 bg-midnight lg:flex lg:flex-col">
        <div className="border-b-2 border-paper/20 px-4 py-5">
          <Link href="/admin/events" className="focus-ring flex w-fit items-center">
            <Logo
              src={SITE.logos.ecell}
              alt={ADMIN.brand}
              width={132}
              height={40}
              fallbackText={ADMIN.brand}
              fallbackClassName="text-xl text-lime"
              className="w-28 brightness-0 invert"
            />
          </Link>
        </div>
        <nav aria-label="Admin" className="flex-1 overflow-y-auto">
          <NavList />
        </nav>
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-midnight/70"
            onClick={() => setOpen(false)}
          />
          <aside className="relative h-full w-60 border-r-2 border-paper/20 bg-midnight">
            <div className="flex items-center justify-between border-b-2 border-paper/20 px-4 py-4">
              <p className="font-display text-lg text-lime">{ADMIN.brand}</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="focus-ring inline-flex size-9 items-center justify-center border-2 border-paper/30"
                aria-label="Close menu"
              >
                <X className="size-4" />
              </button>
            </div>
            <nav aria-label="Admin">
              <NavList onNavigate={() => setOpen(false)} />
            </nav>
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b-2 border-paper/20 bg-midnight px-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="focus-ring inline-flex size-10 items-center justify-center border-2 border-paper/30 lg:hidden"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu className="size-4" />
            </button>
            <p className="font-display text-2xl text-paper">{ADMIN.topbar.title}</p>
          </div>
          <button
            type="button"
            onClick={() => eventsService.reset()}
            className="focus-ring inline-flex h-10 items-center gap-2 border-2 border-paper bg-paper px-3 text-sm font-medium text-midnight hover:bg-lime"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
            {ADMIN.topbar.reset}
          </button>
        </header>
        <div className="p-4 md:p-8">{children}</div>
      </div>
    </div>
  )
}
