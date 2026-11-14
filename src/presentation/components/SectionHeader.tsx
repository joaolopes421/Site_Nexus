import { cn } from '../lib/cn'

interface SectionHeaderProps {
  id: string
  eyebrow: string
  title: string
  /** Segunda metade do título, em tom secundário (padrão bicolor). */
  highlight?: string
  description?: string
  align?: 'center' | 'left'
}

/**
 * Cabeçalho padronizado das secções. O `id` liga o título à secção via aria-labelledby.
 * Título bicolor (branco + slate) em vez de gradiente: o gradiente fica reservado ao hero e aos CTAs.
 */
export function SectionHeader({ id, eyebrow, title, highlight, description, align = 'center' }: SectionHeaderProps) {
  return (
    <div className={cn('max-w-2xl', align === 'center' ? 'mx-auto text-center' : 'text-left')}>
      <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-slate-300">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-nexus-cyan" />
        {eyebrow}
      </p>
      <h2
        id={id}
        className="mt-5 text-[2rem] leading-[1.08] font-semibold tracking-[-0.035em] text-white sm:text-4xl md:text-5xl"
      >
        {title}
        {highlight && <span className="text-slate-500"> {highlight}</span>}
      </h2>
      {description && (
        <p className="mt-5 text-base leading-relaxed text-pretty text-slate-400 md:text-lg">{description}</p>
      )}
    </div>
  )
}
