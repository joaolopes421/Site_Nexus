import { cn } from '../lib/cn'

interface SectionHeaderProps {
  id: string
  eyebrow: string
  title: string
  highlight?: string
  description?: string
  align?: 'center' | 'left'
}

/** Cabeçalho padronizado das secções. O `id` liga o título à secção via aria-labelledby. */
export function SectionHeader({ id, eyebrow, title, highlight, description, align = 'center' }: SectionHeaderProps) {
  return (
    <div className={cn('max-w-2xl', align === 'center' ? 'mx-auto text-center' : 'text-left')}>
      <p className="mb-4 text-xs font-semibold tracking-[0.25em] text-nexus-cyan uppercase">{eyebrow}</p>
      <h2 id={id} className="text-3xl leading-tight font-bold text-white md:text-5xl">
        {title} {highlight && <span className="text-gradient">{highlight}</span>}
      </h2>
      {description && <p className="mt-5 text-base leading-relaxed text-pretty text-nexus-muted md:text-lg">{description}</p>}
    </div>
  )
}
