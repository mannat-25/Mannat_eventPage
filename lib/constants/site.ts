import type { EventCategory } from '@/lib/types/event'

export const SITE = {
  name: 'E-Cell NIT Hamirpur',
  shortName: 'E-Cell',
  institute: 'NIT Hamirpur',
  description:
    'Workshops, competitions, founder talks and meetups from the Entrepreneurship Cell of NIT Hamirpur.',
  logos: {
    ecell: '/assets/logos/ecell-logo.svg',
    nith: '/assets/logos/nith-logo.png',
  },
} as const

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Events', href: '/events' },
  { label: 'Contact', href: '/contact' },
] as const

export const NAV_CTA = { label: 'Join E-Cell', href: '/join' } as const

export const EVENTS_PAGE = {
  meta: {
    title: 'Events',
    description:
      'Upcoming and past events by E-Cell NIT Hamirpur: workshops, startup competitions, founder talks and community meetups.',
  },
  header: {
    eyebrow: 'E-Cell \u00B7 NIT Hamirpur',
    title: 'Events',
    explore: 'Explore events',
    mark: 'E.',
    tagline: 'Think \u00B7 Create \u00B7 Grow',
    description:
      'Where ideas get stress-tested. Workshops that teach the craft, competitions that raise the stakes, and rooms full of people building things in the hills of Hamirpur.',
    stats: {
      total: 'Events listed',
      upcoming: 'Coming up',
      categories: 'Formats',
    },
    nithAlt: 'NIT Hamirpur logo',
  },
  marquee: {
    label: 'Event names',
  },
  filters: {
    searchLabel: 'Search events',
    searchPlaceholder: 'Search by title, venue or topic',
    tabsLabel: 'Filter by status',
    tabs: [
      { value: 'all', label: 'All' },
      { value: 'upcoming', label: 'Upcoming' },
      { value: 'past', label: 'Past' },
    ],
    categoriesLabel: 'Filter by category',
    allCategories: 'All',
    clear: 'Clear filters',
    resultsSuffix: 'results',
  },
  upcoming: {
    index: '01',
    eyebrow: 'On the calendar',
    title: 'Upcoming Events',
    highlight: 'Upcoming',
    badge: 'Upcoming',
    featuredLabel: 'Featured',
    viewDetails: 'View Details',
    register: 'Register',
  },
  past: {
    index: '02',
    eyebrow: 'From the archive',
    title: 'Past Events',
    highlight: 'Past',
    highlights: 'Highlights',
  },
  empty: {
    title: 'Nothing matches that.',
    description: 'Try a different search term, or widen the filters to see every event.',
  },
  loadMore: {
    label: 'Load more events',
    pageSize: 6,
  },
  categories: {
    index: '03',
    eyebrow: 'Browse by format',
    title: 'Event Categories',
    highlight: 'Categories',
    countSuffix: 'events',
  },
  cta: {
    eyebrow: 'Do not just attend',
    title: 'Build the next event with us.',
    highlight: 'next event',
    description:
      'E-Cell is run by students who would rather make things happen than wait for them. Join the core team, pitch an event idea, or bring your startup to the stage.',
    primary: { label: 'Join E-Cell', href: '/join' },
    secondary: { label: 'Explore More', href: '/about' },
  },
} as const

export const CATEGORY_META: Record<EventCategory, { blurb: string; numeral: string }> = {
  Workshop: {
    numeral: 'I',
    blurb: 'Hands-on sessions on pitching, product, finance and growth.',
  },
  Competition: {
    numeral: 'II',
    blurb: 'B-plan contests, hackathons and case challenges with real stakes.',
  },
  Talk: {
    numeral: 'III',
    blurb: 'Founders, operators and investors on what actually worked.',
  },
  Meetup: {
    numeral: 'IV',
    blurb: 'Informal rooms to find co-founders, mentors and early users.',
  },
}

export const EVENT_DETAIL = {
  back: 'All events',
  notFoundTitle: 'Event not found',
  notFoundDescription: 'This event may have been removed or the link is incorrect.',
  dateLabel: 'Date',
  timeLabel: 'Time',
  locationLabel: 'Venue',
  galleryTitle: 'Gallery',
  register: 'Register now',
  closed: 'Registrations closed',
} as const

export const FOOTER = {
  tagline: 'The Entrepreneurship Cell of the National Institute of Technology, Hamirpur.',
  groups: [
    {
      title: 'Explore',
      links: [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
        { label: 'Events', href: '/events' },
        { label: 'Team', href: '/team' },
      ],
    },
    {
      title: 'Read',
      links: [
        { label: 'Blog', href: '/blog' },
        { label: 'Resources', href: '/resources' },
        { label: 'Join Us', href: '/join' },
        { label: 'Contact', href: '/contact' },
      ],
    },
  ],
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/', icon: 'instagram' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: 'linkedin' },
    { label: 'X', href: 'https://x.com/', icon: 'x' },
    { label: 'YouTube', href: 'https://www.youtube.com/', icon: 'youtube' },
  ],
  contact: {
    title: 'Contact',
    email: 'ecell@nith.ac.in',
    phone: '+91 1972 254 000',
  },
  address: {
    title: 'Find us',
    lines: ['National Institute of Technology', 'Hamirpur, Himachal Pradesh', '177005, India'],
  },
  socialTitle: 'Follow',
  copyright: 'E-Cell NIT Hamirpur. All rights reserved.',
} as const
