import { memo } from 'react'
import { cn } from '../lib/cn'

/** Marca da Nexus System. */
export const Logo = memo(function Logo({ className, loading = 'lazy' }: { className?: string; loading?: 'eager' | 'lazy' }) {
  return (
    <a href="#inicio" className={cn('flex items-center gap-2.5', className)} aria-label="Nexus System — voltar ao início">
      <img
        src="/nexus-logo.webp"
        alt=""
        width={40}
        height={40}
        loading={loading}
        decoding="async"
        className="size-10 shrink-0 rounded-xl object-contain"
      />
      <span className="font-display text-lg leading-none font-bold tracking-tight text-white">
        Nexus<span className="text-nexus-cyan"> System</span>
      </span>
    </a>
  )
})
