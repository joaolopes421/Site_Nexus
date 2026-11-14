import { MoveHorizontal } from 'lucide-react'
import { memo, useLayoutEffect, useRef } from 'react'
import { mountNexusCoin } from '../coin/nexusCoin'
import { cn } from '../lib/cn'

/**
 * Moeda Nexus 3D interativa. O React só fornece o palco vazio; a moeda é montada pelo módulo
 * partilhado com o shell mobile, por isso o React nunca reconcilia os filhos do palco.
 */
export const NexusCoin = memo(function NexusCoin({ className }: { className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    try {
      return mountNexusCoin(stage, { edgeSegments: 40 })
    } catch (error) {
      console.error('Não foi possível montar a moeda Nexus.', error)
      return undefined
    }
  }, [])

  return (
    <figure className={cn('flex flex-col items-center', className)}>
      <div
        ref={stageRef}
        role="button"
        tabIndex={0}
        aria-label="Moeda Nexus interativa. Arraste para girar ou pressione Enter para virar."
        className="nx-coin-stage [--coin-size:240px] md:[--coin-size:270px] lg:[--coin-size:300px] xl:[--coin-size:320px]"
      />
      <figcaption className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-400">
        <MoveHorizontal className="size-3.5 text-nexus-cyan" aria-hidden="true" />
        Arraste para girar · clique para virar
      </figcaption>
    </figure>
  )
})
