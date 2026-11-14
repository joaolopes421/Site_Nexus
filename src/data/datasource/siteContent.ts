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
import type { ContactStep, Differential, Pillar, Service } from '@/domain/entities/Service'

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

/** Link de WhatsApp com mensagem inicial pré-preenchida, compartilhado por todos os CTAs. */
export const WHATSAPP_URL = `https://wa.me/${COMPANY.whatsappNumber}?text=${encodeURIComponent(
  'Olá! Gostaria de saber mais sobre as soluções da Nexus System.',
)}`

export const NAV_LINKS = [
  { label: 'Início', href: '#inicio' },
  { label: 'Pilares', href: '#pilares' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Diferenciais', href: '#diferenciais' },
  { label: 'Contato', href: '#contato' },
] as const

export const PILLARS: Pillar[] = [
  {
    id: 'personalizacao',
    title: 'Personalização',
    description: 'Cada linha de código é pensada sob medida para a sua operação, sem soluções genéricas que travam o crescimento.',
    icon: Sparkles,
    highlights: ['Finanças', 'Estoque', 'Vendas', 'Equipes', 'Relatórios', 'Integrações'],
  },
  {
    id: 'seguranca',
    title: 'Segurança',
    description: 'Arquiteturas protegidas por padrão: criptografia, controle de acesso e conformidade com a LGPD.',
    icon: ShieldCheck,
    highlights: ['Criptografia de dados', 'Controle de acesso por perfil', 'Conformidade com a LGPD'],
  },
  {
    id: 'inovacao',
    title: 'Inovação',
    description: 'Tecnologias de ponta, automação e inteligência aplicada para manter a sua empresa à frente.',
    icon: Lightbulb,
    highlights: ['Novo pedido recebido', 'Sincronização via API', 'Nota fiscal emitida automaticamente'],
  },
]

export const CONTACT_STEPS: ContactStep[] = [
  { id: 'resposta', title: 'Resposta em até 24h úteis', description: 'Um especialista analisa a sua solicitação e entra em contato.' },
  { id: 'diagnostico', title: 'Conversa de diagnóstico', description: 'Mapeamos processos, gargalos e objetivos do negócio.' },
  { id: 'proposta', title: 'Proposta sem compromisso', description: 'Você recebe um plano com escopo, prazos e próximos passos.' },
]

export const SERVICES: Service[] = [
  {
    id: 'erp-saas',
    title: 'Sistemas ERP & SaaS Personalizados',
    description:
      'Plataformas sob medida que centralizam finanças, estoque, vendas e equipes em um único ecossistema escalável.',
    icon: Blocks,
    highlights: ['Módulos sob medida', 'Multiusuário', 'Dashboards em tempo real'],
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
    description: 'Servidores, cloud computing e segurança de redes com monitoramento contínuo e suporte dedicado.',
    icon: Network,
    highlights: ['Cloud & servidores', 'Firewall e VPN', 'Monitoramento 24/7'],
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
    description: 'Projetamos uma solução escalável, segura e preparada para evoluir com a sua empresa.',
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

