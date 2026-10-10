import { env } from '@/config/env'
import type { ContactMessage, ContactSubmissionResult } from '@/domain/entities/Contact'
import type { ContactRepository } from '@/domain/repositories/ContactRepository'
import { fromFormspreeResponse, toFormspreePayload } from '../mappers/contactMapper'

const REQUEST_TIMEOUT_MS = 10_000

/**
 * Implementação do ContactRepository usando Formspree.
 * Configure `VITE_FORMSPREE_ENDPOINT` no ficheiro `.env`.
 */
export class FormspreeContactDataSource implements ContactRepository {
  constructor(private readonly endpoint: string | undefined) {}

  async send(message: ContactMessage): Promise<ContactSubmissionResult> {
    if (!this.endpoint) {
      // Sem endpoint em desenvolvimento simulamos o envio para permitir testar a UI.
      if (env.isDev) {
        console.warn('[Nexus] VITE_FORMSPREE_ENDPOINT não definido. Envio simulado.')
        await new Promise((resolve) => setTimeout(resolve, 900))
        return { ok: true }
      }
      return { ok: false, error: 'O formulário ainda não está configurado. Contacte-nos por email ou WhatsApp.' }
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(toFormspreePayload(message)),
        signal: controller.signal,
      })
      return await fromFormspreeResponse(response)
    } catch {
      return { ok: false, error: 'Falha de ligação. Verifique a sua internet e tente novamente.' }
    } finally {
      clearTimeout(timeout)
    }
  }
}

export const contactRepository: ContactRepository = new FormspreeContactDataSource(
  env.formspreeEndpoint,
)
