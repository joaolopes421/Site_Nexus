'use client'

import { lazy, memo, Suspense, useCallback, useState } from 'react'
import { ArrowUpRight, Boxes, Search, TrendingUp, Zap } from 'lucide-react'
import { DIFFERENTIALS } from '@/data/datasource/siteContent'
import { useIsMobile } from '../hooks/useIsMobile'
import { SectionHeader } from '../components/SectionHeader'
import { cn } from '../lib/cn'

const STEP_ICONS = [Search, Boxes, Zap, TrendingUp]
const ParticleMorphCanvas = lazy(() =>
  import('../components/ParticleMorphCanvas').then((module) => ({ default: module.ParticleMorphCanvas })),
)

const MobileLightFallback = memo(function MobileLightFallback({ step, label }: { step: number; label: string }) {
  const Icon = STEP_ICONS[step] ?? Search

  return (
    <div role="img" aria-label={label} className="absolute inset-0 grid place-items-center overflow-hidden">
      <div aria-hidden="true" className="absolute size-56 rounded-full bg-[radial-gradient(circle,rgb(34_211_238/0.14)_0%,transparent_70%)]" />
      <div aria-hidden="true" className="absolute size-40 rounded-full border border-white/[0.06]" />
      <div aria-hidden="true" className="absolute size-28 rounded-full border border-cyan-400/15" />
      <div className="relative grid size-20 place-items-center rounded-2xl border border-cyan-400/30 bg-nexus-surface text-nexus-cyan">
        <Icon className="size-8" aria-hidden="true" />
      </div>
    </div>
  )
})

interface StepOptionProps {
  item: (typeof DIFFERENTIALS)[number]
  index: number
  selected: boolean
  onSelect: (index: number) => void
}

const StepOption = memo(function StepOption({ item, index, selected, onSelect }: StepOptionProps) {
  const Icon = STEP_ICONS[index]
  const handleClick = useCallback(() => onSelect(index), [index, onSelect])

  return (
    <li>
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={selected}
        className={cn(
          'group relative flex w-full items-start gap-4 overflow-hidden rounded-2xl border p-4 text-left transition-[background-color,border-color,transform] duration-300 active:scale-[0.99] md:p-5',
          selected
            ? 'border-cyan-400/30 bg-white/[0.04]'
            : 'border-white/[0.06] bg-transparent hover:border-white/[0.14] hover:bg-white/[0.025]',
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'absolute inset-y-4 left-0 w-px bg-linear-to-b from-nexus-cyan to-nexus-indigo transition-opacity duration-300',
            selected ? 'opacity-100' : 'opacity-0',
          )}
        />
        <span
          className={cn(
            'grid size-10 shrink-0 place-items-center rounded-xl border transition-colors duration-300',
            selected
              ? 'border-transparent bg-linear-to-br from-nexus-cyan to-nexus-indigo text-slate-950'
              : 'border-white/10 bg-white/[0.03] text-slate-400 group-hover:text-white',
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="font-mono text-[11px] tracking-[0.14em] text-slate-400">ETAPA {item.step}</span>
          <span className="mt-0.5 block font-display text-lg font-semibold tracking-tight text-white">{item.title}</span>
          <span
            className={cn(
              'grid transition-[grid-template-rows,opacity] duration-300',
              selected ? 'mt-1 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
            )}
          >
            <span className="overflow-hidden text-sm leading-relaxed text-slate-400">{item.description}</span>
          </span>
        </span>
        <ArrowUpRight
          className={cn(
            'mt-1 size-4 shrink-0 transition-[transform,opacity,color] duration-300',
            selected
              ? 'translate-x-0 text-nexus-cyan opacity-100'
              : '-translate-x-1 text-slate-500 opacity-0 group-hover:translate-x-0 group-hover:opacity-70',
          )}
          aria-hidden="true"
        />
      </button>
    </li>
  )
})

export function DifferentialsSection() {
  const [activeStep, setActiveStep] = useState(0)
  const isMobile = useIsMobile()
  const current = DIFFERENTIALS[activeStep] ?? DIFFERENTIALS[0]
  const selectStep = useCallback((index: number) => setActiveStep(index), [])

  return (
    <section aria-labelledby="diferenciais-title" className="relative overflow-hidden py-24 md:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 -right-40 -z-10 hidden size-[40rem] bg-[radial-gradient(circle,rgb(129_140_248/0.08),transparent_65%)] md:block"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeader
            id="diferenciais-title"
            align="left"
            eyebrow="Como trabalhamos"
            title="Da primeira ideia"
            highlight="à evolução contínua."
            description="Um processo transparente, construído em conjunto. Escolha uma etapa e veja a nossa metodologia ganhar forma."
          />

          <ol className="mt-9 flex flex-col gap-2" aria-label="Etapas da metodologia">
            {DIFFERENTIALS.map((item, index) => (
              <StepOption key={item.id} item={item} index={index} selected={activeStep === index} onSelect={selectStep} />
            ))}
          </ol>
        </div>

        <div className="relative min-w-0">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-10 -z-10 hidden bg-[radial-gradient(50%_50%_at_50%_50%,rgb(34_211_238/0.10),transparent_70%)] md:block"
          />
          <div className="mobile-no-shadow relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-nexus-surface shadow-panel">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-cyan-300/40 to-transparent"
            />
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5 md:px-6">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="size-2.5 rounded-full bg-white/10" />
                <span className="size-2.5 rounded-full bg-white/10" />
                <span className="size-2.5 rounded-full bg-white/10" />
              </div>
              <span className="font-mono text-[10px] tracking-[0.18em] text-slate-500">NEXUS / PROCESSO</span>
            </div>

            <div className="relative h-[300px] sm:h-[360px] lg:h-[410px]">
              <div className="bg-dots pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_75%)]" />
              {!isMobile ? (
                <Suspense fallback={<MobileLightFallback step={activeStep} label={`Metodologia: ${current.step}. ${current.title}`} />}>
                  <ParticleMorphCanvas step={activeStep} label={`Morfismo de partículas: ${current.step}. ${current.title}`} />
                </Suspense>
              ) : (
                <MobileLightFallback step={activeStep} label={`Metodologia: ${current.step}. ${current.title}`} />
              )}
              <div className="pointer-events-none absolute right-5 bottom-5 left-5 flex items-end justify-between md:right-6 md:bottom-6 md:left-6">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.2em] text-nexus-cyan">ETAPA {current.step}</p>
                  <p className="mt-1 font-display text-xl font-semibold tracking-tight text-white md:text-2xl">{current.title}</p>
                </div>
                <span className="mb-1 font-mono text-xs text-slate-400">
                  {String(activeStep + 1).padStart(2, '0')} / {String(DIFFERENTIALS.length).padStart(2, '0')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-3.5 md:px-6">
              <span className="text-xs text-slate-400">Selecione uma etapa para explorar</span>
              {/* Indicador animado só com transform (sem transição de largura → sem relayout). */}
              <div className="flex gap-0.5" aria-hidden="true">
                {DIFFERENTIALS.map((item, index) => (
                  <span
                    key={item.id}
                    className={cn(
                      'h-1 w-5 rounded-full transition-[transform,background-color] duration-300',
                      activeStep === index ? 'scale-x-100 bg-nexus-cyan' : 'scale-x-25 bg-white/20',
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
