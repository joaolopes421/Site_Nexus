import { useEffect, useState } from 'react'

/** Indica se a página já foi deslocada além de `threshold` píxeis. */
export function useScrolled(threshold = 16): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const next = window.scrollY > threshold
      setScrolled((current) => (current === next ? current : next))
    }
    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame !== 0) window.cancelAnimationFrame(frame)
    }
  }, [threshold])

  return scrolled
}

/** Devolve o id da secção atualmente visível (para destacar o link ativo na navbar). */
export function useActiveSection(sectionIds: readonly string[]): string {
  const [active, setActive] = useState(sectionIds[0] ?? '')

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        const nextActive = visible[0]?.target.id
        if (nextActive) setActive((current) => (current === nextActive ? current : nextActive))
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sectionIds])

  return active
}
