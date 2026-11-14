import type { HTMLAttributes } from 'react'
import { cn } from '../lib/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Ativa borda iluminada, brilho radial e elevação subtil ao passar o rato (apenas em dispositivos com hover). */
  interactive?: boolean
  /** Tira o padding interno, para cartões com visual encostado às margens. */
  flush?: boolean
}

/**
 * Superfície base do design system: camada translúcida, borda de 1px a baixa opacidade
 * e um filete de luz no topo que dá profundidade sem recorrer a sombras pesadas.
 */
export function Card({ interactive = false, flush = false, className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'relative isolate overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]',
        !flush && 'p-6 md:p-8',
        interactive &&
          'group mobile-no-shadow transition-[transform,border-color,background-color,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-white/[0.04] hover:shadow-lg hover:shadow-cyan-500/10',
        className,
      )}
      {...rest}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"
      />
      {interactive && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(28rem_circle_at_100%_0%,rgb(34_211_238/0.09),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      )}
      {children}
    </div>
  )
}
