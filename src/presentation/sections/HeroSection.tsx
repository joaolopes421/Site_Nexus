import { ArrowRight, Check, ChevronRight } from 'lucide-react'
import { COMPANY } from '@/data/datasource/siteContent'
import { Button } from '../components/Button'
import { HeroPreview } from '../components/HeroPreview'
import { NexusCoin } from '../components/NexusCoin'

const REASSURANCES = ['Resposta em até 24h úteis', 'Proposta sem compromisso'] as const

export function HeroSection() {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="relative isolate overflow-hidden pt-32 md:pt-40">
      {/* Fundo: apenas gradientes e uma grelha estática — nada de imagens, blur ou animações contínuas. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0" />
        <div className="absolute inset-x-0 top-0 h-[46rem] bg-[radial-gradient(ellipse_60%_55%_at_50%_0%,rgb(56_189_248/0.16),transparent_70%)]" />
        <div className="absolute top-0 left-1/2 h-px w-[min(44rem,90%)] -translate-x-1/2 bg-linear-to-r from-transparent via-cyan-300/60 to-transparent" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <a
            href="#servicos"
            className="group inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] py-1 pr-3 pl-1 text-xs text-slate-300 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.05]"
          >
            <span className="rounded-full bg-nexus-cyan/10 px-2 py-0.5 text-[11px] font-semibold text-nexus-cyan ring-1 ring-nexus-cyan/25 ring-inset">
              ERP · SaaS · Cloud
            </span>
            Engenharia de software &amp; infraestrutura
            <ChevronRight
              className="size-3.5 text-slate-500 transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>

          <h1
            id="hero-title"
            className="mt-8 text-[2.75rem] leading-[1.02] font-semibold tracking-[-0.045em] text-white sm:text-6xl xl:text-[4.5rem]"
          >
            Gestão Inteligente.
            <br />
            <span className="text-gradient">Resultados Reais.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-pretty text-slate-400 md:text-lg md:leading-relaxed">
            A {COMPANY.name} cria sistemas ERP, plataformas SaaS e infraestruturas sob medida que transformam processos
            complexos em crescimento previsível.
          </p>

          <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button href="#contato" size="lg">
              Falar com especialista
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
            </Button>
            <Button href="#servicos" variant="secondary" size="lg">
              Ver soluções
            </Button>
          </div>

          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-slate-400 lg:justify-start">
            {REASSURANCES.map((item) => (
              <li key={item} className="inline-flex items-center gap-1.5">
                <Check className="size-3.5 text-nexus-cyan" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <NexusCoin className="lg:justify-self-end lg:pr-4" />
      </div>

      <div className="mt-16 px-5 pb-8 md:mt-20 md:px-8 md:pb-12">
        <HeroPreview />
      </div>
    </section>
  )
}
