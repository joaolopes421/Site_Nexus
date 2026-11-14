import { Check, ShieldCheck, Zap } from 'lucide-react'
import type { ComponentType } from 'react'
import { PILLARS } from '@/data/datasource/siteContent'
import type { Pillar } from '@/domain/entities/Service'
import { Card } from '../components/Card'
import { SectionHeader } from '../components/SectionHeader'
import { cn } from '../lib/cn'

/* Visuais estáticos (HTML + Tailwind) que tornam cada pilar concreto, sem imagens nem animação contínua. */

function ModulesVisual({ pillar }: { pillar: Pillar }) {
  return (
    <ul aria-label="Exemplo de módulos configurados sob medida" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {pillar.highlights.map((module) => (
        <li
          key={module}
          className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-slate-200 transition-colors duration-300 group-hover:border-cyan-400/25"
        >
          {module}
          <Check className="size-3.5 shrink-0 text-nexus-cyan" aria-label="ativo" />
        </li>
      ))}
    </ul>
  )
}

function SecurityVisual({ pillar }: { pillar: Pillar }) {
  return (
    <div>
      <div aria-hidden="true" className="relative mx-auto grid size-40 place-items-center">
        <span className="absolute inset-0 rounded-full border border-white/[0.05]" />
        <span className="absolute inset-5 rounded-full border border-white/[0.07]" />
        <span className="absolute inset-10 rounded-full border border-cyan-400/20 bg-[radial-gradient(circle,rgb(34_211_238/0.12),transparent_70%)]" />
        <span className="relative grid size-14 place-items-center rounded-2xl border border-cyan-400/30 bg-nexus-surface text-nexus-cyan transition-transform duration-300 group-hover:scale-105">
          <ShieldCheck className="size-6" />
        </span>
      </div>
      <ul className="mt-6 flex flex-col divide-y divide-white/[0.06] rounded-xl border border-white/[0.06] bg-white/[0.02]">
        {pillar.highlights.map((item) => (
          <li key={item} className="flex items-center justify-between gap-3 px-4 py-3 text-sm text-slate-300">
            {item}
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-300">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-400" />
              Ativo
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function FlowVisual({ pillar }: { pillar: Pillar }) {
  const lastIndex = pillar.highlights.length - 1
  return (
    <ol aria-label="Exemplo de fluxo automatizado" className="flex flex-col gap-2">
      {pillar.highlights.map((step, index) => (
        <li
          key={step}
          className={cn(
            'relative flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm',
            'after:absolute after:top-full after:left-[1.45rem] after:h-2 after:w-px after:bg-white/15 last:after:hidden',
            index === lastIndex ? 'border-cyan-400/30 bg-cyan-400/[0.06] text-white' : 'border-white/10 bg-white/[0.03] text-slate-300',
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              'grid size-6 shrink-0 place-items-center rounded-md border font-mono text-[10px]',
              index === lastIndex ? 'border-cyan-400/30 text-nexus-cyan' : 'border-white/10 text-slate-500',
            )}
          >
            {index + 1}
          </span>
          <span className="min-w-0 flex-1">{step}</span>
          {index === lastIndex && (
            <span className="inline-flex shrink-0 items-center gap-1 text-xs text-nexus-cyan">
              <Zap className="size-3" aria-hidden="true" />
              Automático
            </span>
          )}
        </li>
      ))}
    </ol>
  )
}

const PILLAR_LAYOUT: Record<Pillar['id'], { visual: ComponentType<{ pillar: Pillar }>; className: string; wide: boolean }> = {
  personalizacao: { visual: ModulesVisual, className: 'md:col-span-2', wide: true },
  seguranca: { visual: SecurityVisual, className: 'lg:col-start-3 lg:row-span-2 lg:row-start-1', wide: false },
  inovacao: { visual: FlowVisual, className: 'lg:col-span-2', wide: true },
}

export function PillarsSection() {
  return (
    <section aria-labelledby="pilares-title" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader
          id="pilares-title"
          eyebrow="Proposta de valor"
          title="Três pilares que sustentam"
          highlight="cada projeto."
          description="Não entregamos apenas software. Entregamos uma base tecnológica sólida, pensada para durar e crescer com o seu negócio."
        />

        <ul className="mt-14 grid gap-4 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((pillar) => {
            const { visual: Visual, className, wide } = PILLAR_LAYOUT[pillar.id]
            const Icon = pillar.icon
            return (
              <li key={pillar.id} className={className}>
                <Card interactive className="flex h-full flex-col">
                  <div className={cn('flex h-full flex-col gap-8', wide && 'lg:grid lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-10')}>
                    <div>
                      <span className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition-colors duration-300 group-hover:border-cyan-400/30 group-hover:text-nexus-cyan">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <h3 className="mt-5 text-xl font-semibold tracking-tight text-white md:text-2xl">{pillar.title}</h3>
                      <p className="mt-2.5 leading-relaxed text-slate-400">{pillar.description}</p>
                    </div>
                    <div className={cn(!wide && 'mt-auto')}>
                      <Visual pillar={pillar} />
                    </div>
                  </div>
                </Card>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
