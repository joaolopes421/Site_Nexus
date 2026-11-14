import { memo } from 'react'
import { cn } from '../lib/cn'

/** Marca da Nexus System. */
export const Logo = memo(function Logo({ className, loading = 'lazy' }: { className?: string; loading?: 'eager' | 'lazy' }) {
  return (
    <a
      href="#inicio"
      className={cn('group/logo flex items-center gap-2.5 rounded-xl', className)}
      aria-label="Nexus System — voltar ao início"
    >
      <img
        src="/nexus-logo.webp"
        alt=""
        width={36}
        height={36}
        loading={loading}
        decoding="async"
        className="size-9 shrink-0 rounded-[0.65rem] object-contain ring-1 ring-white/10 transition-transform duration-300 group-hover/logo:scale-105"
      />
      <span className="font-display text-[1.05rem] leading-none font-semibold tracking-tight text-white">
        Nexus<span className="text-slate-400"> System</span>
      </span>
    </a>
  )
})
