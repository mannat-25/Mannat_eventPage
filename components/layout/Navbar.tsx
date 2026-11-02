'use client'

import { useEffect, useId, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Logo } from '@/components/common/Logo'
import { NAV_CTA, NAV_LINKS, SITE } from '@/lib/constants/site'
import { cn } from '@/lib/utils'

const isActive = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="sticky top-0 z-50 border-b border-tint-strong bg-tint/95 backdrop-blur supports-[backdrop-filter]:bg-tint/85">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-midnight focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <nav
        aria-label="Primary"
        className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto] items-center gap-6 px-4 md:h-20 md:px-8 lg:grid-cols-[1fr_auto_1fr]"
      >
        <Link href="/" className="focus-ring flex w-fit shrink-0 items-center rounded-md">
          <Logo
            src={SITE.logos.ecell}
            alt={`${SITE.name} home`}
            width={132}
            height={40}
            priority
            className="w-28 md:w-32"
            fallbackText={SITE.shortName}
            fallbackClassName="text-2xl text-midnight md:text-3xl"
          />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href)
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'focus-ring inline-flex h-10 items-center rounded-full px-4 text-sm font-medium transition-colors motion-reduce:transition-none',
                    active ? 'bg-paper text-cobalt shadow-soft' : 'text-midnight/80 hover:text-cobalt',
                  )}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center justify-end gap-3">
          <Button href={NAV_CTA.href} size="sm" className="hidden sm:inline-flex">
            {NAV_CTA.label}
            <ArrowUpRight aria-hidden="true" />
          </Button>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="focus-ring inline-flex size-11 items-center justify-center rounded-full border border-tint-strong bg-paper text-midnight hover:text-cobalt lg:hidden"
          >
            {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
          </button>
        </div>
      </nav>

      <div id={menuId} hidden={!open} className="border-t border-tint-strong bg-tint lg:hidden">
        <ul className="mx-auto flex max-w-7xl flex-col px-4 py-4 md:px-8">
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href)
            return (
              <li key={link.href} className="border-b border-tint-strong last:border-b-0">
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'focus-ring flex rounded-md py-3 font-display text-3xl font-bold',
                    active ? 'text-cobalt italic' : 'text-midnight',
                  )}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>
        <div className="mx-auto max-w-7xl px-4 pb-6 sm:hidden">
          <Button href={NAV_CTA.href} size="lg" className="w-full" onClick={() => setOpen(false)}>
            {NAV_CTA.label}
            <ArrowUpRight aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>
  )
}
