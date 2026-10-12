import type { HTMLAttributes } from 'react'
import { cn } from '../lib/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Ativa elevação, brilho e borda ciano ao passar o rato. */
  interactive?: boolean
}

/** Cartão com efeito glassmorphism. */
export function Card({ interactive = false, className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'glass mobile-no-shadow relative overflow-hidden rounded-2xl p-6 md:p-8',
        interactive &&
          'group transition-[transform,background-color,border-color,opacity,box-shadow] duration-500 hover:-translate-y-1.5 hover:border-nexus-cyan/40 hover:bg-white/[0.05] hover:shadow-glow',
        className,
      )}
      {...rest}
    >
      {interactive && (
        <div
          aria-hidden="true"
          className="mobile-no-blur pointer-events-none absolute -top-24 -right-24 size-48 rounded-full bg-nexus-cyan/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        />
      )}
      <div className="relative">{children}</div>
    </div>
  )
}
