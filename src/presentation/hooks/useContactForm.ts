import { useState, type ChangeEvent, type FocusEvent, type FormEvent } from 'react'
import { submitContactForm } from '@/application/use-cases/submitContactForm'
import { validateContactField, validateContactForm } from '@/application/use-cases/validateContactForm'
import {
  EMPTY_CONTACT_MESSAGE,
  type ContactErrors,
  type ContactField,
  type ContactMessage,
} from '@/domain/entities/Contact'
import type { ContactRepository } from '@/domain/repositories/ContactRepository'

export type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

type FieldEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
type BlurEvent = FocusEvent<HTMLInputElement | HTMLTextAreaElement>

/** Liga a UI do formulário aos casos de uso de validação e envio. */
export function useContactForm(repository: ContactRepository) {
  const [values, setValues] = useState<ContactMessage>(EMPTY_CONTACT_MESSAGE)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({})
  const [status, setStatus] = useState<FormStatus>('idle')
  const [feedback, setFeedback] = useState('')

  const handleChange = (event: FieldEvent) => {
    const field = event.target.name as ContactField
    const value = event.target.value
    setValues((prev) => ({ ...prev, [field]: value }))
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateContactField(field, value) }))
    }
  }

  const handleBlur = (event: BlurEvent) => {
    const field = event.target.name as ContactField
    setTouched((prev) => ({ ...prev, [field]: true }))
    setErrors((prev) => ({ ...prev, [field]: validateContactField(field, event.target.value) }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'submitting') return

    const validation = validateContactForm(values)
    setErrors(validation)
    setTouched({ name: true, company: true, email: true, phone: true, message: true })

    const firstInvalid = Object.keys(validation)[0]
    if (firstInvalid) {
      event.currentTarget.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }

    setStatus('submitting')
    const result = await submitContactForm(repository, values)

    if (result.ok) {
      setStatus('success')
      setFeedback('Mensagem enviada com sucesso! A nossa equipa responderá em até 24 horas úteis.')
      setValues(EMPTY_CONTACT_MESSAGE)
      setTouched({})
      setErrors({})
    } else {
      setStatus('error')
      setFeedback(result.error)
    }
  }

  return { values, errors, status, feedback, handleChange, handleBlur, handleSubmit }
}
