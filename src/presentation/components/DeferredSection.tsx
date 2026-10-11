import { memo, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'

interface DeferredSectionProps {
  id: string
  estimatedHeight: number
  children: ReactNode
}

const SectionPlaceholder = memo(function SectionPlaceholder({ height }: { height: number }) {
  return (
    <div
      aria-hidden="true"
      className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32"
      style={{ minHeight: height }}
    >
      <div className="mx-auto h-2 w-24 rounded-full bg-white/[0.035]" />
      <div className="mx-auto mt-6 h-10 w-2/3 max-w-md rounded-xl bg-white/[0.025]" />
      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="h-40 rounded-2xl border border-white/[0.035] bg-white/[0.015]" />
        <div className="hidden h-40 rounded-2xl border border-white/[0.035] bg-white/[0.015] sm:block" />
        <div className="hidden h-40 rounded-2xl border border-white/[0.035] bg-white/[0.015] lg:block" />
      </div>
    </div>
  )
})

export const DeferredSection = memo(function DeferredSection({ id, estimatedHeight, children }: DeferredSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [hasEntered, setHasEntered] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || hasEntered) return

    if (typeof IntersectionObserver === 'undefined') {
      setHasEntered(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setHasEntered(true)
          observer.disconnect()
        }
      },
      { rootMargin: '700px 0px' },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [hasEntered])

  const placeholder = <SectionPlaceholder height={estimatedHeight} />

  return (
    <div
      ref={sectionRef}
      id={id}
      className="scroll-mt-20"
      style={{
        contentVisibility: hasEntered ? 'visible' : 'auto',
        containIntrinsicSize: `auto ${estimatedHeight}px`,
        minHeight: hasEntered ? undefined : estimatedHeight,
      }}
    >
      {hasEntered ? <Suspense fallback={placeholder}>{children}</Suspense> : placeholder}
    </div>
  )
})
