import type { ContactMessage, ContactSubmissionResult } from '../entities/Contact'

/**
 * Contrato para qualquer serviço de envio de contactos.
 * Trocar Formspree por EmailJS (ou uma API própria) exige apenas
 * uma nova implementação desta interface na camada `data`.
 */
export interface ContactRepository {
  send(message: ContactMessage): Promise<ContactSubmissionResult>
}
