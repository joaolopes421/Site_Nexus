import { ArrowRight, Menu, X } from 'lucide-react'
import { memo, useCallback, useEffect, useState } from 'react'
import { NAV_LINKS } from '@/data/datasource/siteContent'
import { useActiveSection, useScrolled } from '../hooks/useScroll'
import { useIsMobile } from '../hooks/useIsMobile'
import { cn } from '../lib/cn'
import { Button } from './Button'
import { Logo } from './Logo'

const SECTION_IDS = NAV_LINKS.map((link) => link.href.slice(1))

export const Navbar = memo(function Navbar() {
  const [open, setOpen] = useState(false)
  const isMobile = useIsMobile()
  const scrolled = useScrolled(16, isMobile)
  const active = useActiveSection(SECTION_IDS, isMobile)
  const close = useCallback(() => setOpen(false), [])
  const toggleMenu = useCallback(() => setOpen((value) => !value), [])

  // Fecha o menu compacto com Escape, devolvendo o foco ao contexto da página.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const elevated = isMobile || scrolled || open

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6">
      <nav
        aria-label="Navegação principal"
        className={cn(
          'relative mx-auto flex h-16 max-w-6xl items-center justify-between rounded-2xl border px-3 transition-[background-color,border-color,box-shadow] duration-300 md:px-4',
          elevated
            ? cn('border-white/[0.08] shadow-[0_12px_40px_-16px_rgb(0_0_0/0.7)]', isMobile ? 'bg-nexus-bg' : 'glass')
            : 'border-transparent bg-transparent',
        )}
      >
        <Logo loading="eager" className="px-1" />

        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 rounded-full border border-white/[0.06] bg-white/[0.02] p-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.href.slice(1)
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={isActive ? 'location' : undefined}
                  className={cn(
                    'block rounded-full px-3.5 py-1.5 text-sm transition-colors duration-200',
                    isActive ? 'bg-white/[0.08] text-white' : 'text-slate-400 hover:text-white',
                  )}
                >
                  {link.label}
                </a>
              </li>
            )
          })}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <Button href="#contato" size="sm">
            Pedir proposta
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
          </Button>
        </div>

        <button
          type="button"
          onClick={toggleMenu}
          className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white transition-[background-color,transform] duration-200 hover:bg-white/[0.08] active:scale-95 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        >
          {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </button>

        <div
          id="mobile-menu"
          className={cn(
            'invisible absolute inset-x-0 top-[calc(100%+0.5rem)] origin-top -translate-y-1 scale-[0.98] rounded-2xl border border-white/[0.08] bg-nexus-surface p-2 opacity-0 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.8)] transition-[transform,opacity,visibility] duration-200 lg:hidden',
            open && 'visible translate-y-0 scale-100 opacity-100',
          )}
          aria-hidden={!open}
        >
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => {
              const isActive = active === link.href.slice(1)
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={close}
                    tabIndex={open ? 0 : -1}
                    className={cn(
                      'flex items-center justify-between rounded-xl px-4 py-3 text-[0.9375rem] transition-colors',
                      isActive ? 'bg-white/[0.06] text-white' : 'text-slate-400 hover:bg-white/[0.04] hover:text-white',
                    )}
                  >
                    {link.label}
                    {isActive && <span aria-hidden="true" className="size-1.5 rounded-full bg-nexus-cyan" />}
                  </a>
                </li>
              )
            })}
          </ul>
          <div className="mt-2 border-t border-white/[0.06] p-2 pt-3">
            <Button href="#contato" onClick={close} tabIndex={open ? 0 : -1} className="w-full">
              Pedir proposta
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </nav>
    </header>
  )
})
