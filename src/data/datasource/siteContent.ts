import {
  Blocks,
  Cpu,
  Globe,
  Lightbulb,
  Network,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react'
import type { Differential, Pillar, Service } from '@/domain/entities/Service'

/**
 * Conteúdo institucional estático. Centralizado aqui para que, no futuro,
 * possa ser substituído por um CMS sem alterar a camada de apresentação.
 */

export const COMPANY = {
  name: 'Nexus System',
  slogan: 'Gestão Inteligente. Resultados Reais.',
  email: 'nexussystemadmin@gmail.com',
  phoneDisplay: '(19) 99419-3081',
  whatsappNumber: '5519994193081',
  location: 'Limeira - SP, Brasil',
} as const

export const NAV_LINKS = [
  { label: 'Início', href: '#inicio' },
  { label: 'Pilares', href: '#pilares' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Diferenciais', href: '#diferenciais' },
  { label: 'Contacto', href: '#contacto' },
] as const

export const PILLARS: Pillar[] = [
  {
    id: 'personalizacao',
    title: 'Personalização',
    description: 'Cada linha de código é desenhada à medida da sua operação, sem soluções genéricas que travam o crescimento.',
    icon: Sparkles,
  },
  {
    id: 'seguranca',
    title: 'Segurança',
    description: 'Arquiteturas protegidas por padrão: encriptação, controlo de acessos e conformidade com o RGPD.',
    icon: ShieldCheck,
  },
  {
    id: 'inovacao',
    title: 'Inovação',
    description: 'Tecnologias de ponta, automação e inteligência aplicada para manter a sua empresa à frente.',
    icon: Lightbulb,
  },
]

export const SERVICES: Service[] = [
  {
    id: 'erp-saas',
    title: 'Sistemas ERP & SaaS Personalizados',
    description:
      'Plataformas sob medida que centralizam finanças, stock, vendas e equipas num único ecossistema escalável.',
    icon: Blocks,
    highlights: ['Módulos à medida', 'Multi-utilizador', 'Dashboards em tempo real'],
    featured: true,
  },
  {
    id: 'web',
    title: 'Desenvolvimento Web & Sites',
    description: 'Interfaces modernas, rápidas e otimizadas para SEO e conversão em qualquer dispositivo.',
    icon: Globe,
    highlights: ['Alta performance', 'SEO técnico', 'UX responsiva'],
  },
  {
    id: 'automacao',
    title: 'Automação e Inovação de Processos',
    description: 'Eliminamos tarefas repetitivas e integramos sistemas para aumentar a eficiência e reduzir custos.',
    icon: Workflow,
    highlights: ['Integrações via API', 'Fluxos automáticos', 'Menos erros'],
  },
  {
    id: 'consultoria',
    title: 'Consultoria de TI',
    description: 'Arquitetura de software e estratégia tecnológica alinhadas com os objetivos do seu negócio.',
    icon: Cpu,
    highlights: ['Auditoria técnica', 'Roadmap tecnológico', 'Arquitetura cloud'],
  },
  {
    id: 'redes',
    title: 'Redes e Infraestrutura',
    description: 'Servidores, cloud computing e segurança de redes com monitorização contínua e suporte dedicado.',
    icon: Network,
    highlights: ['Cloud & servidores', 'Firewall e VPN', 'Monitorização 24/7'],
  },
]

export const DIFFERENTIALS: Differential[] = [
  {
    id: 'diagnostico',
    step: '01',
    title: 'Diagnóstico',
    description: 'Mapeamos processos, gargalos e objetivos para definir o que realmente gera valor.',
  },
  {
    id: 'arquitetura',
    step: '02',
    title: 'Arquitetura',
    description: 'Desenhamos uma solução escalável, segura e preparada para evoluir com a sua empresa.',
  },
  {
    id: 'sprints',
    step: '03',
    title: 'Sprints ágeis',
    description: 'Entregas incrementais a cada duas semanas, com visibilidade total do progresso.',
  },
  {
    id: 'evolucao',
    step: '04',
    title: 'Evolução contínua',
    description: 'Suporte, métricas e melhorias constantes focadas em resultados mensuráveis.',
  },
]

