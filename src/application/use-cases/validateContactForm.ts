import type { ContactErrors, ContactField, ContactMessage } from '@/domain/entities/Contact'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_PATTERN = /^\+?[\d\s()-]{9,20}$/

export const CONTACT_LIMITS = {
  nameMax: 80,
  companyMax: 100,
  emailMax: 120,
  messageMin: 10,
  messageMax: 2000,
} as const

/** Valida um único campo. Função pura, fácil de testar. */
export function validateContactField(field: ContactField, rawValue: string): string | undefined {
  const value = rawValue.trim()

  switch (field) {
    case 'name':
      if (!value) return 'Informe seu nome.'
      if (value.length < 2) return 'O nome deve ter pelo menos 2 caracteres.'
      if (value.length > CONTACT_LIMITS.nameMax) return `Máximo de ${CONTACT_LIMITS.nameMax} caracteres.`
      return undefined
    case 'company':
      if (!value) return 'Informe o nome da empresa.'
      if (value.length > CONTACT_LIMITS.companyMax) return `Máximo de ${CONTACT_LIMITS.companyMax} caracteres.`
      return undefined
    case 'email':
      if (!value) return 'Informe seu e-mail.'
      if (value.length > CONTACT_LIMITS.emailMax || !EMAIL_PATTERN.test(value)) return 'Informe um e-mail válido.'
      return undefined
    case 'phone':
      if (!value) return 'Informe um telefone para contato.'
      if (!PHONE_PATTERN.test(value)) return 'Informe um telefone válido (mín. 9 dígitos).'
      return undefined
    case 'message':
      if (!value) return 'Escreva sua mensagem.'
      if (value.length < CONTACT_LIMITS.messageMin)
        return `A mensagem deve ter pelo menos ${CONTACT_LIMITS.messageMin} caracteres.`
      if (value.length > CONTACT_LIMITS.messageMax) return `Máximo de ${CONTACT_LIMITS.messageMax} caracteres.`
      return undefined
  }
}

/** Valida o formulário completo e devolve apenas os campos com erro. */
export function validateContactForm(data: ContactMessage): ContactErrors {
  const errors: ContactErrors = {}
  for (const field of Object.keys(data) as ContactField[]) {
    const error = validateContactField(field, data[field])
    if (error) errors[field] = error
  }
  return errors
}

export function hasErrors(errors: ContactErrors): boolean {
  return Object.values(errors).some(Boolean)
}
