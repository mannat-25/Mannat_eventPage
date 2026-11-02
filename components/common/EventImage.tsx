'use client'

import { useCallback, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface EventImageProps {
  src: string
  alt: string
  fallbackLabel: string
  sizes: string
  priority?: boolean
  className?: string
}

/** next/image with a branded fallback when the source is empty or fails to load. */
export function EventImage({ src, alt, fallbackLabel, sizes, priority, className }: EventImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const failed = !src || failedSrc === src

  const checkAlreadyFailed = useCallback(
    (img: HTMLImageElement | null) => {
      if (img?.complete && img.naturalWidth === 0) setFailedSrc(src)
    },
    [src],
  )

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="absolute inset-0 flex items-end bg-tint-strong p-4"
      >
        <span
          aria-hidden="true"
          className="font-display text-4xl leading-none font-bold text-cobalt italic md:text-5xl"
        >
          {fallbackLabel}
        </span>
      </div>
    )
  }

  return (
    <Image
      ref={checkAlreadyFailed}
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={src.startsWith('data:') || src.startsWith('blob:')}
      loading={priority ? undefined : 'lazy'}
      onError={() => setFailedSrc(src)}
      className={cn('object-cover', className)}
    />
  )
}
