import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { COMPANY, NAV_LINKS, SERVICES } from '@/data/datasource/siteContent'
import { Logo } from './Logo'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/[0.06] bg-nexus-surface/40">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-2 md:px-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-5 max-w-sm leading-relaxed text-nexus-muted">
            Engenharia de software sob medida para empresas que procuram eficiência, segurança e crescimento sustentável.
          </p>
          <p className="mt-4 font-display font-semibold text-gradient">{COMPANY.slogan}</p>
        </div>

        <nav aria-label="Links do rodapé">
          <h3 className="mb-4 text-sm font-semibold text-white">Navegação</h3>
          <ul className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-sm text-nexus-muted transition-colors hover:text-nexus-cyan">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-white">Serviços</h3>
          <ul className="flex flex-col gap-3">
            {SERVICES.map((service) => (
              <li key={service.id}>
                <a href="#servicos" className="text-sm text-nexus-muted transition-colors hover:text-nexus-cyan">
                  {service.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-white">Contacto</h3>
          <ul className="flex flex-col gap-3">
            <li>
              <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-2 text-sm text-nexus-muted transition-colors hover:text-nexus-cyan">
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                {COMPANY.email}
              </a>
            </li>
            <li>
              <a href={`tel:+${COMPANY.whatsappNumber}`} className="flex items-center gap-2 text-sm text-nexus-muted transition-colors hover:text-nexus-cyan">
                <Phone className="size-4 shrink-0" aria-hidden="true" />
                {COMPANY.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`https://wa.me/${COMPANY.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-nexus-muted transition-colors hover:text-nexus-cyan">
                <MessageCircle className="size-4 shrink-0" aria-hidden="true" />
                WhatsApp
              </a>
            </li>
            <li className="flex items-center gap-2 text-sm text-nexus-muted">
              <MapPin className="size-4 shrink-0" aria-hidden="true" />
              {COMPANY.location}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-sm text-nexus-muted md:flex-row md:px-8">
          <p>
            &copy; {year} {COMPANY.name}. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-white">
              Política de Privacidade
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Termos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
