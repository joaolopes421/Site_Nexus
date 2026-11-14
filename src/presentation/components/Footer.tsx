import { ArrowUp, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { COMPANY, NAV_LINKS, SERVICES, WHATSAPP_URL } from '@/data/datasource/siteContent'
import { Logo } from './Logo'

const linkClasses = 'text-sm text-slate-400 transition-colors duration-200 hover:text-white'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-white/[0.06] bg-nexus-surface/40">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px max-w-3xl bg-linear-to-r from-transparent via-cyan-300/30 to-transparent"
      />

      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-2 md:px-8 md:py-20 lg:grid-cols-12">
        <div className="md:col-span-2 lg:col-span-5">
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
            Engenharia de software sob medida para empresas que buscam eficiência, segurança e crescimento sustentável.
          </p>
          <p className="mt-6 font-display text-lg font-semibold tracking-tight text-white">{COMPANY.slogan}</p>
        </div>

        <nav aria-label="Links do rodapé" className="lg:col-span-2">
          <h3 className="text-sm font-medium text-white">Navegação</h3>
          <ul className="mt-4 flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={linkClasses}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <h3 className="text-sm font-medium text-white">Serviços</h3>
          <ul className="mt-4 flex flex-col gap-3">
            {SERVICES.map((service) => (
              <li key={service.id}>
                <a href="#servicos" className={linkClasses}>
                  {service.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-sm font-medium text-white">Contato</h3>
          <ul className="mt-4 flex flex-col gap-3">
            <li>
              <a href={`mailto:${COMPANY.email}`} className={`inline-flex items-center gap-2 ${linkClasses}`}>
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                E-mail
              </a>
            </li>
            <li>
              <a href={`tel:+${COMPANY.whatsappNumber}`} className={`inline-flex items-center gap-2 ${linkClasses}`}>
                <Phone className="size-4 shrink-0" aria-hidden="true" />
                {COMPANY.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 ${linkClasses}`}>
                <MessageCircle className="size-4 shrink-0" aria-hidden="true" />
                WhatsApp
              </a>
            </li>
            <li className="inline-flex items-center gap-2 text-sm text-slate-400">
              <MapPin className="size-4 shrink-0" aria-hidden="true" />
              {COMPANY.location}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-sm text-slate-400 md:flex-row md:px-8">
          <p>
            &copy; {year} {COMPANY.name}. Todos os direitos reservados.
          </p>
          <a href="#inicio" className="group inline-flex items-center gap-1.5 rounded-lg transition-colors duration-200 hover:text-white">
            Voltar ao topo
            <ArrowUp className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  )
}
