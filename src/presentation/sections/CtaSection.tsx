import { ArrowRight, MessageCircle } from 'lucide-react'
import { WHATSAPP_URL } from '@/data/datasource/siteContent'
import { Button } from '../components/Button'

/** Faixa de conversão a meio da página: aparece logo após o visitante conhecer os serviços. */
export function CtaSection() {
  return (
    <section aria-labelledby="cta-title" className="relative py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="relative isolate overflow-hidden rounded-3xl border border-white/10 bg-nexus-surface px-6 py-14 text-center md:px-16 md:py-20">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_0%,rgb(34_211_238/0.14),transparent_70%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(40%_60%_at_100%_100%,rgb(129_140_248/0.10),transparent_70%)]" />
            <div className="bg-dots absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_100%,black,transparent)]" />
            <span className="absolute inset-x-12 top-0 h-px bg-linear-to-r from-transparent via-cyan-300/50 to-transparent" />
          </div>

          <p className="text-sm font-medium text-cyan-300">Próximo passo</p>
          <h2
            id="cta-title"
            className="mx-auto mt-4 max-w-3xl text-3xl leading-[1.1] font-semibold tracking-[-0.035em] text-white md:text-5xl"
          >
            Troque o improviso por sistemas que <span className="text-slate-400">acompanham o seu crescimento.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-pretty text-slate-400 md:text-lg">
            Conte-nos seu desafio e receba uma proposta inicial sem compromisso em até 24 horas úteis.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="#contato" size="lg">
              Pedir proposta
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
            </Button>
            <Button href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" variant="secondary" size="lg">
              <MessageCircle className="size-4 text-emerald-400" aria-hidden="true" />
              Conversar no WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
