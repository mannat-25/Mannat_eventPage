'use client'

import { useCallback, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  src: string
  alt: string
  width: number
  height: number
  fallbackText: string
  className?: string
  fallbackClassName?: string
  priority?: boolean
}

/** Renders the official logo file; falls back to a text wordmark until the asset is added. */
export function Logo({
  src,
  alt,
  width,
  height,
  fallbackText,
  className,
  fallbackClassName,
  priority,
}: LogoProps) {
  const [failed, setFailed] = useState(false)

  const checkAlreadyFailed = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth === 0) setFailed(true)
  }, [])

  if (failed) {
    return (
      <span className={cn('font-display font-bold leading-none', fallbackClassName)}>
        {fallbackText}
      </span>
    )
  }

  return (
    <Image
      ref={checkAlreadyFailed}
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      onError={() => setFailed(true)}
      className={cn('h-auto object-contain', className)}
    />
  )
}
