import type { ContactMessage, ContactSubmissionResult } from '@/domain/entities/Contact'

/** Formato esperado pelo Formspree (campos especiais começam com `_`). */
export interface FormspreePayload {
  nome: string
  empresa: string
  email: string
  telefone: string
  mensagem: string
  _subject: string
  _replyto: string
}

interface FormspreeErrorResponse {
  errors?: { field?: string; message: string }[]
}

export function toFormspreePayload(message: ContactMessage): FormspreePayload {
  return {
    nome: message.name.trim(),
    empresa: message.company.trim(),
    email: message.email.trim(),
    telefone: message.phone.trim(),
    mensagem: message.message.trim(),
    _subject: `Novo contacto via site: ${message.name.trim()} (${message.company.trim()})`,
    _replyto: message.email.trim(),
  }
}

export async function fromFormspreeResponse(response: Response): Promise<ContactSubmissionResult> {
  if (response.ok) return { ok: true }

  try {
    const body = (await response.json()) as FormspreeErrorResponse
    const firstError = body.errors?.[0]?.message
    return { ok: false, error: firstError ?? 'Não foi possível enviar a mensagem.' }
  } catch {
    return { ok: false, error: 'Não foi possível enviar a mensagem.' }
  }
}
