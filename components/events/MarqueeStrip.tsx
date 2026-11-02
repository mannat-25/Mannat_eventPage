'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Asterisk } from 'lucide-react'
import { useEvents, useEventsHydrated } from '@/lib/services/eventsService'

function Track({ titles }: { titles: string[] }) {
  return (
    <ul className="flex shrink-0 items-center">
      {titles.map((title, index) => (
        <li key={`${title}-${index}`} className="flex shrink-0 items-center">
          <span className="px-6 font-display text-2xl font-bold whitespace-nowrap italic md:text-3xl">{title}</span>
          <Asterisk aria-hidden="true" className="size-5 shrink-0 text-cobalt" />
        </li>
      ))}
    </ul>
  )
}

export function MarqueeStrip() {
  const events = useEvents()
  const hydrated = useEventsHydrated()
  const reduceMotion = useReducedMotion()
  const titles = events.map((event) => event.title)

  return (
    <div aria-hidden="true" className="overflow-hidden border-y border-tint-strong bg-tint py-5 text-midnight">
      <div className="flex h-9 overflow-hidden md:h-10">
        {hydrated && titles.length > 0 ? (
          <motion.div
            className="flex w-max items-center"
            animate={reduceMotion ? undefined : { x: ['0%', '-50%'] }}
            transition={{ duration: Math.max(titles.length * 5, 30), ease: 'linear', repeat: Infinity }}
          >
            <Track titles={titles} />
            <Track titles={titles} />
          </motion.div>
        ) : null}
      </div>
    </div>
  )
}
