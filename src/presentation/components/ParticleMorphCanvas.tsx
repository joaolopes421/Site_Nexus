'use client'

import { useEffect, useRef } from 'react'

const MAX_PARTICLE_COUNT = 260
const SOURCE_WIDTH = 480
const SOURCE_HEIGHT = 320
const MOBILE_BREAKPOINT = 768
const MOBILE_PARTICLE_RATIO = 0.4

/** Decide o perfil de densidade e resolução a partir do viewport e do canvas. */
export function getParticleRenderSettings(canvasWidth: number, viewportWidth: number, devicePixelRatio: number) {
  const isMobile = viewportWidth < MOBILE_BREAKPOINT
  const desktopParticleCount = Math.min(MAX_PARTICLE_COUNT, Math.max(140, Math.round(canvasWidth * 0.48)))

  return {
    isMobile,
    particleCount: isMobile ? Math.max(1, Math.round(desktopParticleCount * MOBILE_PARTICLE_RATIO)) : desktopParticleCount,
    pixelRatio: Math.min(devicePixelRatio || 1, isMobile ? 1 : 1.5),
  }
}

type Particle = {
  x: number
  y: number
  targetX: number
  targetY: number
}

function traceSymbol(context: CanvasRenderingContext2D, step: number) {
  context.clearRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT)
  context.strokeStyle = '#ffffff'
  context.lineWidth = 3
  context.lineCap = 'round'
  context.lineJoin = 'round'

  if (step === 0) {
    // Diagnóstico: lente, cabo, alvo e pontos de observação.
    context.beginPath()
    context.arc(205, 132, 62, 0, Math.PI * 2)
    context.moveTo(250, 178)
    context.lineTo(308, 236)
    context.moveTo(177, 132)
    context.lineTo(195, 132)
    context.lineTo(205, 113)
    context.lineTo(216, 148)
    context.lineTo(229, 132)
    context.lineTo(240, 132)
    context.stroke()
    context.beginPath()
    context.arc(205, 132, 83, Math.PI * 1.12, Math.PI * 1.86)
    context.stroke()
  } else if (step === 1) {
    // Arquitetura: estrutura isométrica com módulos internos.
    context.beginPath()
    context.moveTo(240, 48)
    context.lineTo(330, 96)
    context.lineTo(330, 198)
    context.lineTo(240, 250)
    context.lineTo(150, 198)
    context.lineTo(150, 96)
    context.closePath()
    context.moveTo(150, 96)
    context.lineTo(240, 147)
    context.lineTo(330, 96)
    context.moveTo(240, 147)
    context.lineTo(240, 250)
    context.moveTo(194, 122)
    context.lineTo(194, 185)
    context.moveTo(218, 136)
    context.lineTo(218, 199)
    context.moveTo(262, 136)
    context.lineTo(262, 199)
    context.moveTo(286, 122)
    context.lineTo(286, 185)
    context.stroke()
  } else if (step === 2) {
    // Sprints: três avanços rápidos e um marcador de entrega.
    for (let row = 0; row < 3; row += 1) {
      const y = 87 + row * 72
      context.beginPath()
      context.moveTo(116, y)
      context.lineTo(171, y)
      context.lineTo(202, y + 18)
      context.lineTo(171, y + 36)
      context.lineTo(116, y + 36)
      context.moveTo(218, y + 18)
      context.lineTo(302, y + 18)
      context.moveTo(283, y + 3)
      context.lineTo(302, y + 18)
      context.lineTo(283, y + 33)
      context.stroke()
    }
  } else {
    // Evolução: ciclo aberto, seta ascendente e novos nós.
    context.beginPath()
    context.arc(226, 157, 88, Math.PI * 0.18, Math.PI * 1.38)
    context.moveTo(159, 97)
    context.lineTo(160, 68)
    context.lineTo(187, 76)
    context.moveTo(292, 219)
    context.lineTo(292, 246)
    context.lineTo(265, 238)
    context.moveTo(185, 194)
    context.lineTo(216, 165)
    context.lineTo(239, 183)
    context.lineTo(278, 132)
    context.moveTo(260, 132)
    context.lineTo(278, 132)
    context.lineTo(278, 150)
    context.stroke()
    context.beginPath()
    context.moveTo(190, 194)
    context.arc(185, 194, 5, 0, Math.PI * 2)
    context.moveTo(221, 165)
    context.arc(216, 165, 5, 0, Math.PI * 2)
    context.moveTo(244, 183)
    context.arc(239, 183, 5, 0, Math.PI * 2)
    context.moveTo(283, 132)
    context.arc(278, 132, 5, 0, Math.PI * 2)
    context.fillStyle = '#ffffff'
    context.fill()
  }
}

function getShapePoints(step: number): Array<{ x: number; y: number }> {
  const source = document.createElement('canvas')
  source.width = SOURCE_WIDTH
  source.height = SOURCE_HEIGHT
  const context = source.getContext('2d', { willReadFrequently: true })
  if (!context) return []

  try {
    traceSymbol(context, step)
    const { data } = context.getImageData(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT)
    const points: Array<{ x: number; y: number }> = []
    for (let y = 0; y < SOURCE_HEIGHT; y += 3) {
      for (let x = 0; x < SOURCE_WIDTH; x += 3) {
        if (data[(y * SOURCE_WIDTH + x) * 4 + 3] > 80) points.push({ x, y })
      }
    }
    return points
  } catch (error) {
    console.error('Não foi possível gerar a forma de partículas.', error)
    return []
  }
}

export function ParticleMorphCanvas({ step, label }: { step: number; label: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const currentStepRef = useRef(step)
  const scheduleRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    currentStepRef.current = step
    scheduleRef.current?.()
  }, [step])

  useEffect(() => {
    const canvas = canvasRef.current
    let context: CanvasRenderingContext2D | null = null
    try {
      context = canvas?.getContext('2d') ?? null
    } catch (error) {
      console.error('O canvas de partículas não está disponível neste navegador.', error)
    }
    if (!canvas || !context) return

    let frame = 0
    let width = 0
    let height = 0
    let scale = 1
    let offsetX = 0
    let offsetY = 0
    let pixelRatio = 0
    let activeStep = -1
    let particleCount = 0
    let isVisible = false
    let particles: Particle[] = []
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    let schedule = () => {}

    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      const nextWidth = bounds.width
      const nextHeight = bounds.height
      if (!nextWidth || !nextHeight) return

      const settings = getParticleRenderSettings(nextWidth, window.innerWidth, window.devicePixelRatio || 1)
      const nextParticleCount = settings.particleCount
      if (nextWidth === width && nextHeight === height && settings.pixelRatio === pixelRatio && nextParticleCount === particleCount) {
        return
      }

      width = nextWidth
      height = nextHeight
      pixelRatio = settings.pixelRatio
      if (nextParticleCount !== particleCount) {
        particleCount = nextParticleCount
        particles = []
        activeStep = -1
      }
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      scale = Math.min(width / SOURCE_WIDTH, height / SOURCE_HEIGHT)
      offsetX = (width - SOURCE_WIDTH * scale) / 2
      offsetY = (height - SOURCE_HEIGHT * scale) / 2
      schedule()
    }

    const render = () => {
      frame = 0
      if (!isVisible) return

      const requestedStep = currentStepRef.current
      if (requestedStep !== activeStep) {
        const points = getShapePoints(requestedStep)
        if (points.length === 0 || points.some((point) => !Number.isFinite(point.x) || !Number.isFinite(point.y))) {
          return
        }

        if (particles.length === 0) {
          particles = Array.from({ length: particleCount }, () => ({
            x: reducedMotion ? SOURCE_WIDTH / 2 : SOURCE_WIDTH / 2 + (Math.random() - 0.5) * SOURCE_WIDTH * 0.8,
            y: reducedMotion ? SOURCE_HEIGHT / 2 : SOURCE_HEIGHT / 2 + (Math.random() - 0.5) * SOURCE_HEIGHT * 0.8,
            targetX: SOURCE_WIDTH / 2,
            targetY: SOURCE_HEIGHT / 2,
          }))
        }
        particles.forEach((particle, index) => {
          const point = points[Math.floor((index * points.length) / particleCount)]
          if (!point) return
          particle.targetX = point.x + (reducedMotion ? 0 : (Math.random() - 0.5) * 2.4)
          particle.targetY = point.y + (reducedMotion ? 0 : (Math.random() - 0.5) * 2.4)
          if (reducedMotion) {
            particle.x = particle.targetX
            particle.y = particle.targetY
          }
        })
        activeStep = requestedStep
      }

      context.clearRect(0, 0, width, height)
      context.save()
      context.translate(offsetX, offsetY)
      context.scale(scale, scale)
      const easing = 0.11
      let stillMoving = false
      particles.forEach((particle, index) => {
        const dx = particle.targetX - particle.x
        const dy = particle.targetY - particle.y
        if (Math.abs(dx) > 0.45 || Math.abs(dy) > 0.45) stillMoving = true
        particle.x += dx * easing
        particle.y += dy * easing
        context.beginPath()
        context.arc(particle.x, particle.y, index % 6 === 0 ? 2 : 1.35, 0, Math.PI * 2)
        context.fillStyle = index % 6 === 0 ? 'rgba(0, 210, 255, 0.98)' : 'rgba(112, 166, 255, 0.82)'
        context.fill()
      })
      context.restore()

      if (stillMoving) frame = window.requestAnimationFrame(render)
    }

    schedule = () => {
      if (isVisible && frame === 0) frame = window.requestAnimationFrame(render)
    }
    scheduleRef.current = schedule

    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null
    resizeObserver?.observe(canvas)
    window.addEventListener('resize', resize, { passive: true })

    const visibilityObserver =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            ([entry]) => {
              isVisible = entry?.isIntersecting ?? true
              if (isVisible) {
                schedule()
              } else if (frame !== 0) {
                window.cancelAnimationFrame(frame)
                frame = 0
              }
            },
            { rootMargin: '120px 0px' },
          )
        : null
    if (visibilityObserver) {
      visibilityObserver.observe(canvas)
    } else {
      isVisible = true
    }
    resize()
    schedule()

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame)
      scheduleRef.current = null
      resizeObserver?.disconnect()
      visibilityObserver?.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} role="img" aria-label={label} className="h-full w-full" />
}
