import { ArrowRight, Check } from 'lucide-react'
import { SERVICES } from '@/data/datasource/siteContent'
import type { Service } from '@/domain/entities/Service'
import { Card } from '../components/Card'
import { SectionHeader } from '../components/SectionHeader'
import { cn } from '../lib/cn'

function FeaturedServiceCard({ service }: { service: Service }) {
  const Icon = service.icon
  return (
    <Card interactive className="h-full border-white/10 bg-linear-to-br from-white/[0.05] to-white/[0.015]">
      <div className="grid h-full gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-10">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <span className="mobile-no-shadow grid size-10 place-items-center rounded-xl bg-linear-to-br from-nexus-cyan to-nexus-indigo text-slate-950 shadow-[0_8px_24px_-8px_rgb(34_211_238/0.6)]">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <span className="rounded-full border border-cyan-400/25 bg-cyan-400/[0.08] px-2.5 py-1 text-xs font-medium text-cyan-300">
              Mais procurado
            </span>
          </div>
          <h3 className="mt-6 text-2xl font-semibold tracking-tight text-white md:text-[1.75rem]">{service.title}</h3>
          <p className="mt-3 leading-relaxed text-slate-400">{service.description}</p>
          <a
            href="#contato"
            className="mt-8 inline-flex w-fit items-center gap-1.5 rounded-lg text-sm font-medium text-cyan-300 transition-colors hover:text-white"
          >
            Pedir proposta para ERP &amp; SaaS
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
        </div>
        <ul
          aria-label="O que inclui"
          className="flex flex-col divide-y divide-white/[0.06] rounded-xl border border-white/[0.06] bg-nexus-bg/40"
        >
          {service.highlights.map((item) => (
            <li key={item} className="flex items-center gap-3 px-4 py-3.5 text-sm text-slate-200">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-cyan-400/10 text-nexus-cyan">
                <Check className="size-3" aria-hidden="true" />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}

function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon
  return (
    <Card interactive className="flex h-full flex-col">
      <span className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition-colors duration-300 group-hover:border-cyan-400/30 group-hover:text-nexus-cyan">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <h3 className="mt-6 text-lg font-semibold tracking-tight text-white">{service.title}</h3>
      <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-slate-400">{service.description}</p>
      <ul className="mt-auto flex flex-wrap gap-1.5 pt-6">
        {service.highlights.map((item) => (
          <li key={item} className="rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-xs text-slate-300">
            {item}
          </li>
        ))}
      </ul>
    </Card>
  )
}

export function ServicesSection() {
  return (
    <section aria-labelledby="servicos-title" className="relative py-24 md:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/4 -z-10 h-[32rem] bg-[radial-gradient(50%_50%_at_50%_50%,rgb(56_189_248/0.07),transparent_70%)]"
      />

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader
          id="servicos-title"
          eyebrow="Soluções"
          title="Tecnologia completa"
          highlight="para a sua operação."
          description="Do código à infraestrutura: uma única equipe responsável por toda a jornada digital da sua empresa."
        />

        <ul className="mt-14 grid gap-4 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <li key={service.id} className={cn(service.featured && 'md:col-span-2')}>
              {service.featured ? <FeaturedServiceCard service={service} /> : <ServiceCard service={service} />}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
