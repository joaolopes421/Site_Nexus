import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const base = cn(
  'group relative inline-flex shrink-0 items-center justify-center gap-2 rounded-xl font-medium whitespace-nowrap select-none',
  'transition-[transform,background-color,border-color,color,box-shadow,opacity,filter] duration-300 ease-out',
  'active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nexus-cyan/70 focus-visible:ring-offset-2 focus-visible:ring-offset-nexus-bg',
  'disabled:pointer-events-none disabled:opacity-60 aria-disabled:pointer-events-none aria-disabled:opacity-60',
)

const variants: Record<Variant, string> = {
  // Único lugar onde o gradiente de marca preenche uma superfície. Texto escuro garante contraste AA em toda a rampa.
  primary:
    'mobile-no-shadow bg-linear-to-r from-cyan-300 via-nexus-cyan to-nexus-indigo font-semibold text-slate-950 shadow-cta hover:shadow-cta-hover hover:brightness-110',
  secondary:
    'border border-white/10 bg-white/[0.04] text-white hover:border-white/20 hover:bg-white/[0.08]',
  ghost: 'text-slate-400 hover:bg-white/[0.04] hover:text-white',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-[0.9375rem]',
}

interface CommonProps {
  variant?: Variant
  size?: Size
  children: ReactNode
  className?: string
}

type ButtonAsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }
type ButtonAsLink = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

/** Botão reutilizável. Renderiza `<a>` quando recebe `href`, caso contrário `<button>`. */
export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = 'primary', size = 'md', className, children, ...rest } = props
  const classes = cn(base, variants[variant], sizes[size], className)

  if (typeof rest.href === 'string') {
    return (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    )
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}
