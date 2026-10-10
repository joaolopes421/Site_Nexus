/**
 * Mensagem de contacto enviada por um potencial cliente (lead).
 * Entidade de domínio pura: não conhece React, APIs ou formatos externos.
 */
export interface ContactMessage {
  name: string
  company: string
  email: string
  phone: string
  message: string
}

export type ContactField = keyof ContactMessage

export type ContactErrors = Partial<Record<ContactField, string>>

export type ContactSubmissionResult =
  | { ok: true }
  | { ok: false; error: string }

export const EMPTY_CONTACT_MESSAGE: ContactMessage = {
  name: '',
  company: '',
  email: '',
  phone: '',
  message: '',
}
