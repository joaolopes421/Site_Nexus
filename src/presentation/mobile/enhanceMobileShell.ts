import { submitContactForm } from '@/application/use-cases/submitContactForm'
import { validateContactField, validateContactForm } from '@/application/use-cases/validateContactForm'
import { contactRepository } from '@/data/datasource/FormspreeContactDataSource'
import type { ContactField, ContactMessage } from '@/domain/entities/Contact'
import { mountNexusCoin } from '../coin/nexusCoin'

/*
 * Melhoria progressiva do shell mobile (index.html). O conteúdo já está todo no HTML;
 * este módulo, carregado depois da primeira pintura, só liga a moeda 3D, o menu e o formulário.
 * Reutiliza os casos de uso da camada de aplicação, por isso as regras são as mesmas do desktop.
 */

const FIELDS: ContactField[] = ['name', 'company', 'email', 'phone', 'message']

function setupMenu(root: ParentNode) {
  const menu = root.querySelector<HTMLDetailsElement>('[data-mobile-menu]')
  if (!menu) return

  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => (menu.open = false)))
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false
      menu.querySelector('summary')?.focus()
    }
  })
  document.addEventListener('click', (event) => {
    if (menu.open && event.target instanceof Node && !menu.contains(event.target)) menu.open = false
  })
}

function setupContactForm(root: ParentNode) {
  const form = root.querySelector<HTMLFormElement>('[data-contact-form]')
  if (!form) return

  const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]')
  const feedback = form.querySelector<HTMLElement>('[data-feedback]')
  const touched = new Set<ContactField>()
  let submitting = false

  const fieldElement = (field: ContactField) =>
    form.elements.namedItem(field) as HTMLInputElement | HTMLTextAreaElement | null

  const readValues = (): ContactMessage => ({
    name: fieldElement('name')?.value ?? '',
    company: fieldElement('company')?.value ?? '',
    email: fieldElement('email')?.value ?? '',
    phone: fieldElement('phone')?.value ?? '',
    message: fieldElement('message')?.value ?? '',
  })

  const showError = (field: ContactField, message: string | undefined) => {
    const input = fieldElement(field)
    const error = form.querySelector<HTMLElement>(`#m-${field}-error`)
    if (!input || !error) return
    error.textContent = message ?? ''
    error.hidden = !message
    // aria-invalid="" equivale a "false" para leitores de ecrã, por isso usa-se "true" explícito.
    if (message) input.setAttribute('aria-invalid', 'true')
    else input.removeAttribute('aria-invalid')
    const hintId = input.dataset.hint
    const describedBy = message ? error.id : hintId
    if (describedBy) input.setAttribute('aria-describedby', describedBy)
    else input.removeAttribute('aria-describedby')
  }

  const isField = (name: string): name is ContactField => (FIELDS as string[]).includes(name)

  form.addEventListener('focusout', (event) => {
    const target = event.target
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) || !isField(target.name)) return
    touched.add(target.name)
    showError(target.name, validateContactField(target.name, target.value))
  })

  form.addEventListener('input', (event) => {
    const target = event.target
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) || !isField(target.name)) return
    if (touched.has(target.name)) showError(target.name, validateContactField(target.name, target.value))
  })

  const setSubmitting = (value: boolean) => {
    submitting = value
    if (value) form.setAttribute('aria-busy', 'true')
    else form.removeAttribute('aria-busy')
    form.classList.toggle('is-submitting', value)
    FIELDS.forEach((field) => {
      const input = fieldElement(field)
      if (input) input.readOnly = value
    })
    if (submitButton) submitButton.disabled = value
  }

  const showFeedback = (kind: 'success' | 'error', message: string) => {
    if (!feedback) return
    feedback.textContent = message
    feedback.dataset.kind = kind
    feedback.hidden = false
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    if (submitting) return
    if (feedback) feedback.hidden = true

    const values = readValues()
    const errors = validateContactForm(values)
    FIELDS.forEach((field) => {
      touched.add(field)
      showError(field, errors[field])
    })
    const firstInvalid = FIELDS.find((field) => errors[field])
    if (firstInvalid) {
      fieldElement(firstInvalid)?.focus()
      return
    }

    setSubmitting(true)
    let result: Awaited<ReturnType<typeof submitContactForm>>
    try {
      result = await submitContactForm(contactRepository, values)
    } catch {
      result = { ok: false, error: 'Não foi possível enviar a mensagem. Tente novamente.' }
    }
    setSubmitting(false)

    if (result.ok) {
      form.reset()
      touched.clear()
      FIELDS.forEach((field) => showError(field, undefined))
      showFeedback('success', 'Mensagem enviada com sucesso! Nossa equipe responderá em até 24 horas úteis.')
    } else {
      showFeedback('error', result.error)
    }
  })

  // Sem este script o botão fica desativado: o formulário nunca submete para um destino inválido.
  if (submitButton) submitButton.disabled = false
  form.classList.add('is-ready')
}

export function enhanceMobileShell(root: ParentNode = document) {
  const coinStage = root.querySelector<HTMLElement>('[data-nexus-coin]')
  if (coinStage) {
    try {
      mountNexusCoin(coinStage, { edgeSegments: 28 })
    } catch (error) {
      console.error('Não foi possível montar a moeda Nexus.', error)
    }
  }
  setupMenu(root)
  setupContactForm(root)
}
