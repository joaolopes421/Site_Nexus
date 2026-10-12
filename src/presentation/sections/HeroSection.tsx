import { ArrowRight, ChevronDown } from 'lucide-react'
import { COMPANY } from '@/data/datasource/siteContent'
import { Button } from '../components/Button'

export function HeroSection() {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="relative isolate overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <picture className="absolute inset-0">
          <source media="(max-width: 640px)" srcSet="/images/hero-network-mobile.webp" type="image/webp" />
          <img
            src="/images/hero-network.webp"
            alt=""
            width={800}
            height={800}
            className="h-full w-full object-cover opacity-40"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-nexus-bg/40 via-nexus-bg/70 to-nexus-bg" />
        <div className="bg-grid absolute inset-0" />
        <div className="mobile-no-blur absolute top-1/4 left-1/2 size-[28rem] -translate-x-1/2 rounded-full bg-nexus-cobalt/25 blur-[72px] md:size-[36rem] md:animate-pulse-glow md:blur-[120px]" />
      </div>

      <div className="mx-auto flex max-w-5xl flex-col items-center px-5 text-center md:px-8">
        <p className="glass mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-nexus-muted">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-nexus-cyan opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-nexus-cyan" />
          </span>
          Engenharia de Software & Infraestrutura
        </p>

        <h1 id="hero-title" className="text-4xl leading-[1.05] font-bold tracking-tight sm:text-6xl lg:text-7xl">
          Gestão Inteligente.
          <br />
          <span className="text-gradient">Resultados Reais.</span>
        </h1>

        <p className="mt-7 max-w-2xl text-base leading-relaxed text-pretty text-nexus-muted md:text-xl">
          A {COMPANY.name} cria sistemas ERP, plataformas SaaS e infraestruturas sob medida que transformam processos
          complexos em crescimento previsível.
        </p>

        <div className="mt-10 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
          <Button href="#contacto" size="lg">
            Falar com Especialista
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Button>
          <Button href="#servicos" variant="secondary" size="lg">
            Conhecer Soluções
          </Button>
        </div>

        <a
          href="#pilares"
          className="mt-16 hidden animate-float text-nexus-muted transition-colors hover:text-nexus-cyan md:block"
          aria-label="Deslizar para a próxima secção"
        >
          <ChevronDown className="size-6" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
