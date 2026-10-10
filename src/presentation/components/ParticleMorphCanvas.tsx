'use client'

import { useEffect, useRef } from 'react'

const PARTICLE_COUNT = 300
const SOURCE_WIDTH = 480
const SOURCE_HEIGHT = 320

type Particle = {
  x: number
  y: number
  targetX: number
  targetY: number
  phase: number
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
    context.arc(185, 194, 5, 0, Math.PI * 2)
    context.arc(216, 165, 5, 0, Math.PI * 2)
    context.arc(239, 183, 5, 0, Math.PI * 2)
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

  traceSymbol(context, step)
  const { data } = context.getImageData(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT)
  const points: Array<{ x: number; y: number }> = []
  for (let y = 0; y < SOURCE_HEIGHT; y += 3) {
    for (let x = 0; x < SOURCE_WIDTH; x += 3) {
      if (data[(y * SOURCE_WIDTH + x) * 4 + 3] > 80) points.push({ x, y })
    }
  }
  return points
}

export function ParticleMorphCanvas({ step, label }: { step: number; label: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const currentStepRef = useRef(step)

  useEffect(() => {
    currentStepRef.current = step
  }, [step])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    let frame = 0
    let width = 0
    let height = 0
    let scale = 1
    let offsetX = 0
    let offsetY = 0
    let activeStep = -1
    let particles: Particle[] = []
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      width = bounds.width
      height = bounds.height
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      scale = Math.min(width / SOURCE_WIDTH, height / SOURCE_HEIGHT)
      offsetX = (width - SOURCE_WIDTH * scale) / 2
      offsetY = (height - SOURCE_HEIGHT * scale) / 2
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    resize()

    const render = (time: number) => {
      const requestedStep = currentStepRef.current
      if (requestedStep !== activeStep) {
        const points = getShapePoints(requestedStep)
        if (particles.length === 0) {
          particles = Array.from({ length: PARTICLE_COUNT }, (_, index) => ({
            x: SOURCE_WIDTH / 2 + (Math.random() - 0.5) * SOURCE_WIDTH * 0.8,
            y: SOURCE_HEIGHT / 2 + (Math.random() - 0.5) * SOURCE_HEIGHT * 0.8,
            targetX: SOURCE_WIDTH / 2,
            targetY: SOURCE_HEIGHT / 2,
            phase: index * 0.31,
          }))
        }
        particles.forEach((particle, index) => {
          const point = points[Math.floor((index * points.length) / PARTICLE_COUNT)] ?? {
            x: SOURCE_WIDTH / 2,
            y: SOURCE_HEIGHT / 2,
          }
          particle.targetX = point.x + (Math.random() - 0.5) * 2.4
          particle.targetY = point.y + (Math.random() - 0.5) * 2.4
        })
        activeStep = requestedStep
      }

      context.clearRect(0, 0, width, height)
      const glow = context.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, width * 0.52)
      glow.addColorStop(0, 'rgba(0, 82, 212, 0.13)')
      glow.addColorStop(1, 'rgba(9, 13, 22, 0)')
      context.fillStyle = glow
      context.fillRect(0, 0, width, height)

      context.save()
      context.translate(offsetX, offsetY)
      context.scale(scale, scale)
      const easing = reducedMotion ? 0.14 : 0.075
      particles.forEach((particle, index) => {
        particle.x += (particle.targetX - particle.x) * easing
        particle.y += (particle.targetY - particle.y) * easing
        const pulse = reducedMotion ? 1 : 0.76 + Math.sin(time / 720 + particle.phase) * 0.2
        const radius = (index % 7 === 0 ? 2 : 1.35) * pulse
        context.beginPath()
        context.arc(particle.x, particle.y, radius, 0, Math.PI * 2)
        context.fillStyle = index % 5 === 0 ? 'rgba(0, 210, 255, 0.98)' : 'rgba(112, 166, 255, 0.82)'
        context.shadowColor = index % 5 === 0 ? '#00d2ff' : '#0052d4'
        context.shadowBlur = reducedMotion ? 3 : 8
        context.fill()
      })
      context.restore()
      frame = window.requestAnimationFrame(render)
    }

    frame = window.requestAnimationFrame(render)
    return () => {
      window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} role="img" aria-label={label} className="h-full w-full" />
}
