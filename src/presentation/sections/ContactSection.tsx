import { CheckCircle2, Loader2, Mail, MapPin, MessageCircle, Phone, Send, XCircle } from 'lucide-react'
import { CONTACT_LIMITS } from '@/application/use-cases/validateContactForm'
import { contactRepository } from '@/data/datasource/FormspreeContactDataSource'
import { COMPANY } from '@/data/datasource/siteContent'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { FormField } from '../components/FormField'
import { SectionHeader } from '../components/SectionHeader'
import { useContactForm } from '../hooks/useContactForm'
import { cn } from '../lib/cn'

const whatsappHref = `https://wa.me/${COMPANY.whatsappNumber}?text=${encodeURIComponent(
  'Olá! Gostaria de saber mais sobre as soluções da Nexus System.',
)}`

const CONTACT_CHANNELS = [
  { icon: Mail, label: 'Email', value: COMPANY.email, href: `mailto:${COMPANY.email}` },
  { icon: Phone, label: 'Telefone', value: COMPANY.phoneDisplay, href: `tel:+${COMPANY.whatsappNumber}` },
  { icon: MapPin, label: 'Localização', value: COMPANY.location },
]

export function ContactSection() {
  const { values, errors, status, feedback, handleChange, handleBlur, handleSubmit } = useContactForm(contactRepository)
  const submitting = status === 'submitting'

  return (
    <section aria-labelledby="contacto-title" className="relative py-24 md:py-32">
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 mx-auto h-[28rem] max-w-5xl rounded-full bg-nexus-cobalt/20 blur-[140px]" />

      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-5 lg:gap-16">
        <div className="lg:col-span-2">
          <SectionHeader
            id="contacto-title"
            align="left"
            eyebrow="Contacto"
            title="Vamos construir a"
            highlight="próxima fase do seu negócio"
            description="Conte-nos o seu desafio. Um especialista responde em até 24 horas úteis com uma proposta inicial sem compromisso."
          />

          <ul className="mt-10 flex flex-col gap-4">
            {CONTACT_CHANNELS.map(({ icon: Icon, label, value, href }) => {
              const content = (
                <>
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-nexus-cyan/20 bg-nexus-cyan/10 text-nexus-cyan">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-xs text-nexus-muted">{label}</span>
                    <span className="block font-medium text-white">{value}</span>
                  </span>
                </>
              )
              return (
                <li key={label}>
                  {href ? (
                    <a href={href} className="flex items-center gap-4 rounded-xl transition-opacity hover:opacity-80">
                      {content}
                    </a>
                  ) : (
                    <div className="flex items-center gap-4">{content}</div>
                  )}
                </li>
              )
            })}
          </ul>

          <Button
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            className="mt-10 border-emerald-400/30 hover:border-emerald-400/60"
          >
            <MessageCircle className="size-5 text-emerald-400" aria-hidden="true" />
            Conversar no WhatsApp
          </Button>
        </div>

        <Card className="lg:col-span-3">
          <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5" aria-describedby="form-feedback">
            <div className="grid gap-5 md:grid-cols-2">
              <FormField
                label="Nome"
                name="name"
                autoComplete="name"
                placeholder="O seu nome"
                maxLength={CONTACT_LIMITS.nameMax}
                value={values.name}
                error={errors.name}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              <FormField
                label="Empresa"
                name="company"
                autoComplete="organization"
                placeholder="Nome da empresa"
                maxLength={CONTACT_LIMITS.companyMax}
                value={values.company}
                error={errors.company}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              <FormField
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="nome@empresa.com"
                maxLength={CONTACT_LIMITS.emailMax}
                value={values.email}
                error={errors.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              <FormField
                label="Telefone"
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="(19) 99419-3081"
                maxLength={20}
                value={values.phone}
                error={errors.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
            </div>

            <FormField
              multiline
              label="Mensagem"
              name="message"
              placeholder="Descreva brevemente o seu projeto ou desafio..."
              maxLength={CONTACT_LIMITS.messageMax}
              value={values.message}
              error={errors.message}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />

            <div className="flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-nexus-muted">Os seus dados são tratados de acordo com o RGPD.</p>
              <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
                {submitting ? (
                  <>
                    <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                    A enviar...
                  </>
                ) : (
                  <>
                    Enviar mensagem
                    <Send className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </>
                )}
              </Button>
            </div>

            <div id="form-feedback" role="status" aria-live="polite">
              {(status === 'success' || status === 'error') && (
                <p
                  className={cn(
                    'flex items-start gap-3 rounded-xl border px-4 py-3 text-sm',
                    status === 'success'
                      ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                      : 'border-red-400/30 bg-red-400/10 text-red-300',
                  )}
                >
                  {status === 'success' ? (
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  ) : (
                    <XCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  )}
                  {feedback}
                </p>
              )}
            </div>
          </form>
        </Card>
      </div>
    </section>
  )
}
