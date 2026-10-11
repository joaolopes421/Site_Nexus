import { ArrowRight, Menu, X } from 'lucide-react'
import { memo, useCallback, useState } from 'react'
import { NAV_LINKS } from '@/data/datasource/siteContent'
import { useActiveSection, useScrolled } from '../hooks/useScroll'
import { cn } from '../lib/cn'
import { Button } from './Button'
import { Logo } from './Logo'

const SECTION_IDS = NAV_LINKS.map((link) => link.href.slice(1))

export const Navbar = memo(function Navbar() {
  const [open, setOpen] = useState(false)
  const scrolled = useScrolled()
  const active = useActiveSection(SECTION_IDS)
  const close = useCallback(() => setOpen(false), [])
  const toggleMenu = useCallback(() => setOpen((value) => !value), [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300',
        scrolled || open ? 'glass border-x-0 border-t-0 bg-nexus-bg/70' : 'border-b border-transparent',
      )}
    >
      <nav aria-label="Navegação principal" className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 md:px-8">
        <Logo loading="eager" />

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.href.slice(1)
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm transition-colors',
                    isActive ? 'bg-white/[0.06] text-white' : 'text-nexus-muted hover:text-white',
                  )}
                >
                  {link.label}
                </a>
              </li>
            )
          })}
        </ul>

        <div className="hidden lg:block">
          <Button href="#contacto" size="sm">
            Falar com Especialista
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Button>
        </div>

        <button
          type="button"
          onClick={toggleMenu}
          className="grid size-10 place-items-center rounded-xl text-white glass lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        >
          {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={cn(
          'absolute inset-x-0 top-full border-b border-white/[0.06] bg-nexus-bg/95 opacity-0 invisible -translate-y-2 transition-[transform,opacity,visibility] duration-200 lg:hidden',
          open && 'visible translate-y-0 opacity-100',
        )}
        style={open ? { willChange: 'transform, opacity' } : undefined}
        aria-hidden={!open}
      >
        <div className="min-h-0">
          <ul className="flex flex-col gap-1 px-5 pb-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={close}
                  tabIndex={open ? 0 : -1}
                  className="block rounded-xl px-4 py-3 text-nexus-muted transition-colors hover:bg-white/[0.04] hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="mt-3">
              <Button href="#contacto" onClick={close} tabIndex={open ? 0 : -1} className="w-full">
                Falar com Especialista
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
})
