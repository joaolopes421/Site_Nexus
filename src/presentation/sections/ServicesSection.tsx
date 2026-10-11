import { Check } from 'lucide-react'
import { SERVICES } from '@/data/datasource/siteContent'
import { Card } from '../components/Card'
import { SectionHeader } from '../components/SectionHeader'
import { cn } from '../lib/cn'

export function ServicesSection() {
  return (
    <section aria-labelledby="servicos-title" className="relative py-24 md:py-32">
      <div aria-hidden="true" className="absolute inset-x-0 top-1/3 -z-10 mx-auto h-96 max-w-4xl rounded-full bg-nexus-cyan/10 blur-[140px]" />

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader
          id="servicos-title"
          eyebrow="Soluções"
          title="Tecnologia completa para"
          highlight="a sua operação"
          description="Do código à infraestrutura: uma única equipa responsável por toda a jornada digital da sua empresa."
        />

        <ul className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ id, title, description, icon: Icon, highlights, featured }) => (
            <li key={id} className={cn(featured && 'md:col-span-2 lg:row-span-2 lg:col-span-1')}>
              <Card
                interactive
                className={cn('flex h-full flex-col', featured && 'border-nexus-cyan/30 bg-gradient-to-br from-nexus-cobalt/20 to-transparent')}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-12 place-items-center rounded-xl bg-gradient-to-br from-nexus-cyan to-nexus-cobalt text-white shadow-glow">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  {featured && (
                    <span className="rounded-full border border-nexus-cyan/40 bg-nexus-cyan/10 px-3 py-1 text-xs font-medium text-nexus-cyan">
                      Mais procurado
                    </span>
                  )}
                </div>

                <h3 className={cn('mt-6 font-semibold text-white', featured ? 'text-2xl md:text-3xl' : 'text-xl')}>{title}</h3>
                <p className="mt-3 leading-relaxed text-nexus-muted">{description}</p>

                <ul className="mt-auto flex flex-col gap-2.5 pt-6">
                  {highlights.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-white/85">
                      <Check className="size-4 shrink-0 text-nexus-cyan" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
