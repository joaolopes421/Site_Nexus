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

const StaticMethodVisual = memo(function StaticMethodVisual({ step, label }: { step: number; label: string }) {
  const Icon = STEP_ICONS[step] ?? Search

  return (
    <div role="img" aria-label={label} className="absolute inset-0 grid place-items-center overflow-hidden">
      <div aria-hidden="true" className="absolute size-48 rounded-full bg-[radial-gradient(circle,rgba(0,82,212,0.26)_0%,transparent_72%)]" />
      <div aria-hidden="true" className="absolute size-32 rounded-full border border-nexus-cyan/15 bg-nexus-cyan/[0.04]" />
      <div className="relative grid size-24 place-items-center rounded-full border border-nexus-cyan/25 bg-[#0a1020]/80 text-nexus-cyan shadow-[0_0_48px_-16px_rgba(0,210,255,0.7)]">
        <Icon className="size-10" aria-hidden="true" />
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
          'group flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-[transform,background-color,border-color] duration-300 md:p-5',
          selected
            ? 'border-nexus-cyan/30 bg-nexus-cyan/[0.07] shadow-[0_0_32px_-18px_rgba(0,210,255,0.55)]'
            : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.04]',
        )}
      >
        <span
          className={cn(
            'grid size-11 shrink-0 place-items-center rounded-xl border transition-colors',
            selected
              ? 'border-nexus-cyan/30 bg-nexus-cyan/10 text-nexus-cyan'
              : 'border-white/[0.08] bg-white/[0.03] text-nexus-muted group-hover:text-white',
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] text-nexus-cyan/80">
            {item.step}
            <span className="h-px w-5 bg-current opacity-40" />
          </span>
          <span className="mt-1 block font-display text-lg font-semibold text-white">{item.title}</span>
          <span
            className={cn(
              'grid transition-[grid-template-rows,opacity] duration-300',
              selected ? 'mt-1 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
            )}
          >
            <span className="overflow-hidden text-sm leading-relaxed text-nexus-muted">{item.description}</span>
          </span>
        </span>
        <ArrowUpRight
          className={cn(
            'mt-1 size-4 shrink-0 transition-[transform,opacity,color]',
            selected ? 'translate-x-0 text-nexus-cyan opacity-100' : '-translate-x-1 text-nexus-muted opacity-0 group-hover:translate-x-0 group-hover:opacity-70',
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
      <div aria-hidden="true" className="pointer-events-none absolute -right-48 top-1/4 -z-10 size-[34rem] rounded-full bg-nexus-cobalt/10 blur-[130px]" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeader
            id="diferenciais-title"
            align="left"
            eyebrow="Como trabalhamos"
            title="Da primeira ideia"
            highlight="à evolução contínua"
            description="Um processo transparente, construído em conjunto. Escolha uma etapa e veja a nossa metodologia ganhar forma."
          />

          <ol className="mt-9 flex flex-col gap-3" aria-label="Etapas da metodologia">
            {DIFFERENTIALS.map((item, index) => (
              <StepOption
                key={item.id}
                item={item}
                index={index}
                selected={activeStep === index}
                onSelect={selectStep}
              />
            ))}
          </ol>
        </div>

        <div className="relative min-w-0">
          <div aria-hidden="true" className="absolute inset-8 rounded-full bg-nexus-cobalt/20 blur-[90px]" />
          <div className="glass relative overflow-hidden rounded-[1.75rem] border-white/[0.1] bg-[#0a1020]/85 shadow-[0_30px_100px_-45px_rgba(0,82,212,0.7)]">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4 md:px-7">
              <div className="flex items-center gap-2.5" aria-hidden="true">
                <span className="size-2 rounded-full bg-nexus-cyan shadow-[0_0_10px_#00d2ff]" />
                <span className="size-2 rounded-full bg-nexus-cobalt" />
                <span className="size-2 rounded-full bg-white/20" />
              </div>
              <span className="font-mono text-[10px] tracking-[0.18em] text-nexus-muted">NEXUS / PROCESSO</span>
            </div>

            <div className="relative h-[300px] sm:h-[360px] lg:h-[410px]">
              <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] [background-size:36px_36px] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_78%)]" />
              {isMobile ? (
                <StaticMethodVisual step={activeStep} label={`Metodologia: ${current.step}. ${current.title}`} />
              ) : (
                <Suspense fallback={<StaticMethodVisual step={activeStep} label={`Metodologia: ${current.step}. ${current.title}`} />}>
                  <ParticleMorphCanvas
                    step={activeStep}
                    label={`Morfismo de partículas: ${current.step}. ${current.title}`}
                  />
                </Suspense>
              )}
              <div className="pointer-events-none absolute bottom-5 left-5 right-5 flex items-end justify-between md:bottom-7 md:left-7 md:right-7">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.2em] text-nexus-cyan">ETAPA {current.step}</p>
                  <p className="mt-1 font-display text-xl font-semibold text-white md:text-2xl">{current.title}</p>
                </div>
                <span className="mb-1 font-mono text-xs text-white/35">{String(activeStep + 1).padStart(2, '0')} / 04</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/[0.07] px-5 py-3.5 md:px-7">
              <span className="text-xs text-nexus-muted">Interaja com as etapas para explorar</span>
              <div className="flex gap-1.5" aria-hidden="true">
                {DIFFERENTIALS.map((item, index) => (
                  <span
                    key={item.id}
                    className={cn('h-1 rounded-full transition-all duration-300', activeStep === index ? 'w-6 bg-nexus-cyan' : 'w-1.5 bg-white/20')}
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
