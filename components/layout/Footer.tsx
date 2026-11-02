import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Logo } from '@/components/common/Logo'
import { SocialIcon } from '@/components/common/SocialIcon'
import { FOOTER, SITE } from '@/lib/constants/site'

const linkClass =
  'rounded-sm text-sm text-paper/75 transition-colors hover:text-lime focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime motion-reduce:transition-none'

const headingClass = 'mb-4 text-xs font-semibold tracking-[0.2em] text-paper/50 uppercase'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-midnight text-paper">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-12 md:px-8">
        <div className="md:col-span-4">
          <div className="flex items-center gap-4">
            <Logo
              src={SITE.logos.ecell}
              alt={SITE.name}
              width={132}
              height={40}
              className="w-32"
              fallbackText={SITE.shortName}
              fallbackClassName="text-4xl text-paper"
            />
            <span aria-hidden="true" className="h-10 w-px bg-paper/15" />
            <div className="rounded-lg bg-paper p-1.5">
              <Logo
                src={SITE.logos.nith}
                alt={SITE.institute}
                width={40}
                height={40}
                className="size-10"
                fallbackText="NITH"
                fallbackClassName="block px-1 py-2 text-sm text-midnight"
              />
            </div>
          </div>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-paper/65">{FOOTER.tagline}</p>
        </div>

        {FOOTER.groups.map((group) => (
          <nav key={group.title} aria-label={group.title} className="md:col-span-2">
            <h2 className={headingClass}>{group.title}</h2>
            <ul className="flex flex-col gap-3">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="flex flex-col gap-8 md:col-span-4">
          <div>
            <h2 className={headingClass}>{FOOTER.contact.title}</h2>
            <ul className="flex flex-col gap-3">
              <li>
                <a href={`mailto:${FOOTER.contact.email}`} className={`${linkClass} inline-flex items-center gap-2`}>
                  <Mail aria-hidden="true" className="size-4" />
                  {FOOTER.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${FOOTER.contact.phone.replace(/\s/g, '')}`}
                  className={`${linkClass} inline-flex items-center gap-2`}
                >
                  <Phone aria-hidden="true" className="size-4" />
                  {FOOTER.contact.phone}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className={headingClass}>{FOOTER.address.title}</h2>
            <address className="flex gap-2 text-sm leading-relaxed text-paper/75 not-italic">
              <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <span>
                {FOOTER.address.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </address>
          </div>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="mx-auto flex max-w-7xl flex-col-reverse items-start justify-between gap-6 px-4 py-6 sm:flex-row sm:items-center md:px-8">
          <p className="text-xs text-paper/55">
            {'\u00A9'} {year} {FOOTER.copyright}
          </p>
          <ul aria-label={FOOTER.socialTitle} className="flex items-center gap-2">
            {FOOTER.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-paper/15 text-paper transition-[background-color,border-color] hover:border-cobalt hover:bg-cobalt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime motion-reduce:transition-none"
                >
                  <SocialIcon name={social.icon} className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
