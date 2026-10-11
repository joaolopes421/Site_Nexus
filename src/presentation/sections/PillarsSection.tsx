import { PILLARS } from '@/data/datasource/siteContent'
import { Card } from '../components/Card'
import { SectionHeader } from '../components/SectionHeader'

export function PillarsSection() {
  return (
    <section aria-labelledby="pilares-title" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader
          id="pilares-title"
          eyebrow="Proposta de valor"
          title="Três pilares que sustentam"
          highlight="cada projeto"
          description="Não entregamos apenas software. Entregamos uma base tecnológica sólida, pensada para durar e crescer com o seu negócio."
        />

        <ul className="mt-16 grid gap-6 md:grid-cols-3">
          {PILLARS.map(({ id, title, description, icon: Icon }) => (
            <li key={id}>
              <Card interactive className="h-full">
                <span className="mb-6 grid size-14 place-items-center rounded-2xl border border-nexus-cyan/20 bg-nexus-cyan/10 text-nexus-cyan transition-transform duration-500 group-hover:scale-110">
                  <Icon className="size-7" aria-hidden="true" />
                </span>
                <h3 className="text-xl font-semibold text-white md:text-2xl">{title}</h3>
                <p className="mt-3 leading-relaxed text-nexus-muted">{description}</p>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
