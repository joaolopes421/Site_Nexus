import type { LucideIcon } from 'lucide-react'

/** Serviço oferecido pela Nexus System. */
export interface Service {
  id: string
  title: string
  description: string
  icon: LucideIcon
  highlights: string[]
  featured?: boolean
}

/** Pilar da proposta de valor (Personalização, Segurança, Inovação). */
export interface Pillar {
  id: 'personalizacao' | 'seguranca' | 'inovacao'
  title: string
  description: string
  icon: LucideIcon
  /** Itens concretos que materializam o pilar (módulos, garantias, capacidades). */
  highlights: string[]
}

/** Diferencial competitivo / etapa da metodologia. */
export interface Differential {
  id: string
  step: string
  title: string
  description: string
}

/** Passo do que acontece depois de uma solicitação de contato. */
export interface ContactStep {
  id: string
  title: string
  description: string
}
