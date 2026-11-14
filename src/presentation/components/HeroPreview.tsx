import { memo } from 'react'
import { LayoutDashboard, Lock, Package, ShoppingCart, Users, Wallet, Webhook } from 'lucide-react'
import { cn } from '../lib/cn'

/*
 * Pré-visualização ilustrativa de um painel ERP, desenhada só com HTML + Tailwind.
 * Substitui a imagem de fundo do hero: zero bytes de imagem, nítida em qualquer DPI
 * e sem animações contínuas (apenas pintura estática, segura para 60 FPS).
 */

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: 'Visão geral', active: true },
  { icon: Wallet, label: 'Finanças' },
  { icon: Package, label: 'Estoque' },
  { icon: ShoppingCart, label: 'Vendas' },
  { icon: Users, label: 'Equipes' },
  { icon: Webhook, label: 'Integrações' },
] as const

const KPIS = [
  { label: 'Faturamento do mês', value: 'R$ 284,3 mil', delta: '+12,4%' },
  { label: 'Pedidos processados', value: '1.248', delta: '+8,1%' },
  { label: 'Tarefas automatizadas', value: '37', delta: '+5' },
] as const

const BARS = [38, 46, 41, 55, 49, 61, 57, 66, 60, 72, 68, 84] as const

const ACTIVITY = [
  { label: 'Nota fiscal #2041 emitida', time: 'agora', tone: 'bg-nexus-cyan' },
  { label: 'Estoque sincronizado com a loja', time: '2 min', tone: 'bg-emerald-400' },
  { label: 'Novo acesso aprovado', time: '8 min', tone: 'bg-nexus-indigo' },
  { label: 'Relatório semanal gerado', time: '1 h', tone: 'bg-slate-500' },
] as const

export const HeroPreview = memo(function HeroPreview() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-5xl select-none">
      {/* Halo estático por gradiente radial (sem filter: blur). */}
      <div className="pointer-events-none absolute -inset-x-16 -top-16 bottom-1/3 -z-10 bg-[radial-gradient(55%_60%_at_50%_0%,rgb(34_211_238/0.16),rgb(129_140_248/0.06)_45%,transparent_75%)]" />

      <div className="mobile-no-shadow rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-1.5 shadow-panel">
        <div className="relative overflow-hidden rounded-[0.95rem] border border-white/[0.06] bg-nexus-surface">
          <span className="pointer-events-none absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-cyan-300/50 to-transparent" />

          {/* Barra da janela */}
          <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
            <div className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-white/10" />
              <span className="size-2.5 rounded-full bg-white/10" />
              <span className="size-2.5 rounded-full bg-white/10" />
            </div>
            <div className="mx-auto flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-[11px] text-slate-500">
              <Lock className="size-3" />
              Painel operacional
            </div>
            <span className="w-[2.625rem]" />
          </div>

          <div className="grid lg:grid-cols-[12.5rem_1fr]">
            <aside className="hidden border-r border-white/[0.06] p-3 lg:block">
              <p className="px-2.5 pt-1 pb-2 text-[10px] font-semibold tracking-[0.16em] text-slate-600 uppercase">Módulos</p>
              <ul className="flex flex-col gap-0.5">
                {SIDEBAR_ITEMS.map(({ icon: Icon, label, ...item }) => {
                  const active = 'active' in item && item.active
                  return (
                    <li
                      key={label}
                      className={cn(
                        'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px]',
                        active ? 'bg-white/[0.06] text-white' : 'text-slate-500',
                      )}
                    >
                      <Icon className={cn('size-4', active && 'text-nexus-cyan')} />
                      {label}
                    </li>
                  )
                })}
              </ul>
            </aside>

            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="text-[11px] text-slate-500">Operação · Hoje</p>
                  <p className="mt-0.5 font-display text-base font-semibold text-white">Visão geral</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-2.5 py-1 text-[11px] text-emerald-300">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  Sincronizado
                </span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {KPIS.map((kpi) => (
                  <div key={kpi.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-left md:p-4">
                    <p className="truncate text-[11px] text-slate-500">{kpi.label}</p>
                    <p className="mt-1.5 font-display text-sm font-semibold tracking-tight text-white md:text-xl">{kpi.value}</p>
                    <p className="mt-1 text-[11px] font-medium text-emerald-400">{kpi.delta}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-[1.6fr_1fr]">
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-left">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-slate-300">Receita por mês</p>
                    <p className="text-[11px] text-slate-500">Últimos 12 meses</p>
                  </div>
                  <div className="relative mt-4 flex h-28 items-end gap-1.5 md:h-32">
                    <span className="absolute inset-x-0 top-[22%] border-t border-dashed border-white/[0.08]" />
                    {BARS.map((height, index) => (
                      <span
                        key={index}
                        style={{ height: `${height}%` }}
                        className={cn(
                          'flex-1 rounded-t-[3px]',
                          index === BARS.length - 1
                            ? 'bg-linear-to-t from-nexus-cyan/70 to-nexus-indigo'
                            : 'bg-white/[0.07]',
                        )}
                      />
                    ))}
                  </div>
                </div>

                <div className="hidden rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-left md:block">
                  <p className="text-xs font-medium text-slate-300">Atividade</p>
                  <ul className="mt-3 flex flex-col gap-3">
                    {ACTIVITY.map((entry) => (
                      <li key={entry.label} className="flex items-center gap-2.5 text-[12px]">
                        <span className={cn('size-1.5 shrink-0 rounded-full', entry.tone)} />
                        <span className="min-w-0 flex-1 truncate text-slate-300">{entry.label}</span>
                        <span className="shrink-0 text-slate-600">{entry.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dissolve a base do painel no fundo da página. */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-px h-40 bg-linear-to-t from-nexus-bg via-nexus-bg/80 to-transparent" />
    </div>
  )
})
