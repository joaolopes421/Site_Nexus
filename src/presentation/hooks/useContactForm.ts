import { useCallback, useRef, useState, type ChangeEvent, type FocusEvent, type FormEvent } from 'react'
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
  const touched = useRef<Partial<Record<ContactField, boolean>>>({})
  const [status, setStatus] = useState<FormStatus>('idle')
  const [feedback, setFeedback] = useState('')
  const valuesRef = useRef(values)
  const statusRef = useRef<FormStatus>('idle')

  const handleChange = useCallback((event: FieldEvent) => {
    const field = event.target.name as ContactField
    const value = event.target.value
    const nextValues = { ...valuesRef.current, [field]: value }
    valuesRef.current = nextValues
    setValues(nextValues)
    if (touched.current[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateContactField(field, value) }))
    }
  }, [])

  const handleBlur = useCallback((event: BlurEvent) => {
    const field = event.target.name as ContactField
    touched.current[field] = true
    setErrors((prev) => ({ ...prev, [field]: validateContactField(field, event.target.value) }))
  }, [])

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (statusRef.current === 'submitting') return

    const currentValues = valuesRef.current
    const validation = validateContactForm(currentValues)
    setErrors(validation)
    touched.current = { name: true, company: true, email: true, phone: true, message: true }

    const firstInvalid = Object.keys(validation)[0]
    if (firstInvalid) {
      event.currentTarget.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }

    statusRef.current = 'submitting'
    setStatus('submitting')
    let result: Awaited<ReturnType<typeof submitContactForm>>
    try {
      result = await submitContactForm(repository, currentValues)
    } catch {
      result = { ok: false as const, error: 'Não foi possível enviar a mensagem. Tente novamente.' }
    }

    if (result.ok) {
      statusRef.current = 'success'
      setStatus('success')
      setFeedback('Mensagem enviada com sucesso! A nossa equipa responderá em até 24 horas úteis.')
      valuesRef.current = EMPTY_CONTACT_MESSAGE
      setValues(EMPTY_CONTACT_MESSAGE)
      touched.current = {}
      setErrors({})
    } else {
      statusRef.current = 'error'
      setStatus('error')
      setFeedback(result.error)
    }
  }, [repository])

  return { values, errors, status, feedback, handleChange, handleBlur, handleSubmit }
}
