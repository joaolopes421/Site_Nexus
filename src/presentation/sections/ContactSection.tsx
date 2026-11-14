import { ArrowUpRight, CheckCircle2, Loader2, Lock, Mail, MapPin, MessageCircle, Phone, Send, XCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { CONTACT_LIMITS } from '@/application/use-cases/validateContactForm'
import { contactRepository } from '@/data/datasource/FormspreeContactDataSource'
import { COMPANY, CONTACT_STEPS, WHATSAPP_URL } from '@/data/datasource/siteContent'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { FormField } from '../components/FormField'
import { SectionHeader } from '../components/SectionHeader'
import { useContactForm } from '../hooks/useContactForm'
import { cn } from '../lib/cn'

interface ContactChannel {
  icon: LucideIcon
  label: string
  value: string
  href?: string
  external?: boolean
  tone?: 'whatsapp'
}

const CONTACT_CHANNELS: ContactChannel[] = [
  { icon: MessageCircle, label: 'WhatsApp · resposta mais rápida', value: COMPANY.phoneDisplay, href: WHATSAPP_URL, external: true, tone: 'whatsapp' },
  { icon: Mail, label: 'E-mail', value: COMPANY.email, href: `mailto:${COMPANY.email}` },
  { icon: Phone, label: 'Telefone', value: COMPANY.phoneDisplay, href: `tel:+${COMPANY.whatsappNumber}` },
  { icon: MapPin, label: 'Localização', value: COMPANY.location },
]

function ChannelRow({ channel }: { channel: ContactChannel }) {
  const { icon: Icon, label, value, href, external, tone } = channel
  const content = (
    <>
      <span
        className={cn(
          'grid size-10 shrink-0 place-items-center rounded-xl border',
          tone === 'whatsapp'
            ? 'border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-400'
            : 'border-white/10 bg-white/[0.03] text-slate-300 transition-colors duration-300 group-hover:text-nexus-cyan',
        )}
      >
        <Icon className="size-[1.125rem]" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs text-slate-400">{label}</span>
        <span className="block truncate text-[0.9375rem] font-medium text-white">{value}</span>
      </span>
      {href && (
        <ArrowUpRight
          className="size-4 shrink-0 text-slate-600 transition-[transform,color] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
          aria-hidden="true"
        />
      )}
    </>
  )

  return (
    <li>
      {href ? (
        <a
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="group flex items-center gap-4 px-4 py-3.5 transition-colors duration-200 hover:bg-white/[0.03] focus-visible:bg-white/[0.03]"
        >
          {content}
        </a>
      ) : (
        <div className="flex items-center gap-4 px-4 py-3.5">{content}</div>
      )}
    </li>
  )
}

export function ContactSection() {
  const { values, errors, status, feedback, handleChange, handleBlur, handleSubmit } = useContactForm(contactRepository)
  const submitting = status === 'submitting'

  return (
    <section aria-labelledby="contato-title" className="relative py-24 md:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[36rem] bg-[radial-gradient(50%_60%_at_60%_100%,rgb(56_189_248/0.09),transparent_70%)]"
      />

      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeader
            id="contato-title"
            align="left"
            eyebrow="Contato"
            title="Vamos construir a próxima fase"
            highlight="do seu negócio."
            description="Conte-nos seu desafio. Um especialista responde em até 24 horas úteis com uma proposta inicial sem compromisso."
          />

          <ol aria-label="O que acontece depois do contato" className="mt-10 flex flex-col">
            {CONTACT_STEPS.map((step, index) => (
              <li key={step.id} className="relative flex gap-4 pb-6 last:pb-0">
                {index < CONTACT_STEPS.length - 1 && (
                  <span aria-hidden="true" className="absolute top-8 bottom-1 left-[0.9375rem] w-px bg-white/[0.08]" />
                )}
                <span className="grid size-[1.875rem] shrink-0 place-items-center rounded-full border border-white/10 bg-nexus-bg font-mono text-xs text-slate-400">
                  {index + 1}
                </span>
                <div className="pt-0.5">
                  <p className="text-[0.9375rem] font-medium text-white">{step.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>

          <ul className="mt-10 divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
            {CONTACT_CHANNELS.map((channel) => (
              <ChannelRow key={channel.label} channel={channel} />
            ))}
          </ul>
        </div>

        <Card className="lg:sticky lg:top-28 lg:col-span-7 lg:self-start">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/[0.06] pb-6">
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-white">Pedir proposta</h3>
              <p className="mt-1 text-sm text-slate-400">Todos os campos são obrigatórios.</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-slate-300">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-400" />
              Resposta em até 24h úteis
            </span>
          </div>

          <form noValidate onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5" aria-describedby="form-feedback" aria-busy={submitting}>
            <div className="grid gap-5 md:grid-cols-2">
              <FormField
                label="Nome"
                name="name"
                autoComplete="name"
                placeholder="Seu nome"
                maxLength={CONTACT_LIMITS.nameMax}
                value={values.name}
                error={errors.name}
                onChange={handleChange}
                onBlur={handleBlur}
                readOnly={submitting}
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
                readOnly={submitting}
                required
              />
              <FormField
                label="E-mail"
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
                readOnly={submitting}
                required
              />
              <FormField
                label="Telefone"
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="(19) 99999-9999"
                maxLength={20}
                value={values.phone}
                error={errors.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                readOnly={submitting}
                required
              />
            </div>

            <FormField
              multiline
              label="Mensagem"
              name="message"
              placeholder="Descreva brevemente seu projeto ou desafio..."
              maxLength={CONTACT_LIMITS.messageMax}
              hint={`Mínimo de ${CONTACT_LIMITS.messageMin} caracteres.`}
              value={values.message}
              error={errors.message}
              onChange={handleChange}
              onBlur={handleBlur}
              readOnly={submitting}
              required
            />

            <div className="flex flex-col-reverse items-start gap-4 border-t border-white/[0.06] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                <Lock className="size-3.5" aria-hidden="true" />
                Seus dados são tratados de acordo com a LGPD.
              </p>
              <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto sm:min-w-44">
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Enviando...
                  </>
                ) : (
                  <>
                    Enviar mensagem
                    <Send className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                  </>
                )}
              </Button>
            </div>

            <div id="form-feedback" role="status" aria-live="polite">
              {(status === 'success' || status === 'error') && (
                <p
                  className={cn(
                    'flex items-start gap-3 rounded-xl border px-4 py-3 text-sm leading-relaxed',
                    status === 'success'
                      ? 'border-emerald-400/25 bg-emerald-400/[0.07] text-emerald-200'
                      : 'border-rose-400/25 bg-rose-400/[0.07] text-rose-200',
                  )}
                >
                  {status === 'success' ? (
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden="true" />
                  ) : (
                    <XCircle className="mt-0.5 size-4 shrink-0 text-rose-400" aria-hidden="true" />
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
