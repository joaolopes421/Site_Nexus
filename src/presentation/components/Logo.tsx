import { cn } from '../lib/cn'

/** Marca da Nexus System. */
export function Logo({ className }: { className?: string }) {
  return (
    <a href="#inicio" className={cn('flex items-center gap-2.5', className)} aria-label="Nexus System — voltar ao início">
      <img
        src="/nexus-logo.jpeg"
        alt=""
        width={40}
        height={40}
        className="size-10 shrink-0 rounded-xl object-contain"
      />
      <span className="font-display text-lg leading-none font-bold tracking-tight text-white">
        Nexus<span className="text-nexus-cyan"> System</span>
      </span>
    </a>
  )
}
