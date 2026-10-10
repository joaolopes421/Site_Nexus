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
  id: string
  title: string
  description: string
  icon: LucideIcon
}

/** Diferencial competitivo / etapa da metodologia. */
export interface Differential {
  id: string
  step: string
  title: string
  description: string
}

