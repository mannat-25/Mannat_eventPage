import Link from 'next/link'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const buttonVariants = cva(
  [
    'focus-ring inline-flex shrink-0 select-none items-center justify-center gap-2 rounded-full border font-sans font-medium whitespace-nowrap',
    'transition-[transform,box-shadow,background-color,color,border-color] duration-150 ease-out motion-reduce:transition-none',
    'active:scale-[0.98] motion-reduce:active:scale-100',
    'disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40',
    '[&_svg]:size-4 [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary: 'border-midnight bg-midnight text-paper hover:bg-midnight/85',
        secondary: 'border-cobalt bg-paper text-cobalt hover:bg-tint',
        cobalt: 'border-cobalt bg-cobalt text-paper hover:bg-cobalt/90',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-5 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

type Variants = VariantProps<typeof buttonVariants>

type ButtonAsButton = Variants &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined
  }

type ButtonAsLink = Variants &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    href: string
  }

export type ButtonProps = ButtonAsButton | ButtonAsLink

const isExternal = (href: string) => /^https?:\/\//.test(href)

export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const { href, variant, size, className, children, ...rest } = props
    const classes = cn(buttonVariants({ variant, size }), className)

    if (isExternal(href)) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
          {children}
        </a>
      )
    }

    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    )
  }

  const { variant, size, className, type = 'button', ...rest } = props
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...rest} />
}
