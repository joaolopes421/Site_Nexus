import type { ContactMessage, ContactSubmissionResult } from '@/domain/entities/Contact'
import type { ContactRepository } from '@/domain/repositories/ContactRepository'
import { hasErrors, validateContactForm } from './validateContactForm'

/**
 * Caso de uso: validar e enviar um contato.
 * Recebe o repositório por injeção de dependência, o que permite
 * trocar o provedor ou usar um mock em testes.
 */
export async function submitContactForm(
  repository: ContactRepository,
  data: ContactMessage,
): Promise<ContactSubmissionResult> {
  if (hasErrors(validateContactForm(data))) {
    return { ok: false, error: 'Verifique os campos destacados.' }
  }
  return repository.send(data)
}
