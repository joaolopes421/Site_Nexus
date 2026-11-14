import './nexusCoin.css'

/*
 * Moeda Nexus interativa, em TypeScript sem framework: o mesmo módulo serve a app React (desktop)
 * e o shell estático do mobile. Arrastar gira com inércia, clicar/tocar vira a moeda, setas e Enter
 * funcionam por teclado. O loop de animação só corre com a moeda visível e a aba ativa.
 */

export interface NexusCoinOptions {
  /** Fatias da borda. Menos fatias = menos planos 3D (o mobile usa menos). */
  edgeSegments?: number
}

const FRONT_SRC = '/nexus-coin.webp'
const MARK_SRC = '/nexus-coin-mark.webp'
const RING_TEXT = 'GESTÃO INTELIGENTE • RESULTADOS REAIS • NEXUS SYSTEM • '

const AUTO_SPIN = 0.014 // graus por ms (~14°/s)
const DRAG_FACTOR = 0.45 // graus por píxel arrastado
const TILT_FACTOR = 0.3
const REST_TILT = -10
const MAX_TILT = 32
const MAX_FLING = 1.4 // graus por ms
const TAP_DISTANCE = 6
const TAP_TIME = 320
const KEY_STEP = 30
const SPIN_DURATION = 360 / AUTO_SPIN // ms por volta completa na rotação automática
const SPIN_KEYFRAMES = 12 // pontos por volta para o brilho e a sombra seguirem a rotação

let mountCount = 0

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

function createElement<K extends keyof HTMLElementTagNameMap>(tag: K, className: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag)
  node.className = className
  return node
}

function createImage(src: string, className: string, size: number) {
  const image = createElement('img', className)
  image.src = src
  image.alt = ''
  image.width = size
  image.height = size
  image.decoding = 'async'
  image.draggable = false
  return image
}

function createRingText(id: string) {
  const svgNs = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(svgNs, 'svg')
  svg.setAttribute('class', 'nx-coin-ring-text')
  svg.setAttribute('viewBox', '0 0 200 200')
  svg.setAttribute('aria-hidden', 'true')

  const path = document.createElementNS(svgNs, 'path')
  path.setAttribute('id', id)
  path.setAttribute('d', 'M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0')
  path.setAttribute('fill', 'none')

  const text = document.createElementNS(svgNs, 'text')
  const textPath = document.createElementNS(svgNs, 'textPath')
  textPath.setAttribute('href', `#${id}`)
  textPath.setAttribute('textLength', '512')
  textPath.setAttribute('lengthAdjust', 'spacing')
  textPath.textContent = RING_TEXT
  text.append(textPath)

  const defs = document.createElementNS(svgNs, 'defs')
  defs.append(path)
  svg.append(defs, text)
  return svg
}

function buildCoin(segments: number, id: string) {
  const scene = createElement('div', 'nx-coin-scene')
  const coin = createElement('div', 'nx-coin')

  const front = createElement('div', 'nx-coin-face nx-coin-front')
  const frontInner = createElement('div', 'nx-coin-inner')
  frontInner.append(createImage(FRONT_SRC, 'nx-coin-art', 512))
  const frontShine = createElement('span', 'nx-coin-shine')
  front.append(frontInner, frontShine)

  const back = createElement('div', 'nx-coin-face nx-coin-back')
  const backInner = createElement('div', 'nx-coin-inner nx-coin-inner-back')
  backInner.append(createRingText(`${id}-arc`), createElement('span', 'nx-coin-ring'), createImage(MARK_SRC, 'nx-coin-mark', 256))
  const backShine = createElement('span', 'nx-coin-shine')
  back.append(backInner, backShine)

  const edge = createElement('div', 'nx-coin-edge')
  edge.style.setProperty('--segments', String(segments))
  for (let index = 0; index < segments; index += 1) {
    const angle = (360 / segments) * index
    // Iluminação estática: fatias do topo mais claras, base mais escura.
    const light = 0.5 + 0.5 * Math.cos((angle * Math.PI) / 180)
    const slice = createElement('span', 'nx-coin-slice')
    slice.style.setProperty('--a', `${angle}deg`)
    slice.style.setProperty('--l', `${(26 + light * 34).toFixed(1)}%`)
    edge.append(slice)
  }

  coin.append(edge, back, front)
  scene.append(coin)
  const shadow = createElement('div', 'nx-coin-shadow')
  return { scene, coin, frontShine, backShine, shadow }
}

/** Monta a moeda dentro de `stage` e devolve a função de limpeza. */
export function mountNexusCoin(stage: HTMLElement, options: NexusCoinOptions = {}): () => void {
  mountCount += 1
  const segments = clamp(Math.round(options.edgeSegments ?? 36), 12, 64)
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  const { scene, coin, frontShine, backShine, shadow } = buildCoin(segments, `nx-coin-${mountCount}`)

  const previousChildren = Array.from(stage.childNodes)
  stage.replaceChildren(scene, shadow)
  stage.classList.add('is-ready')
  if (!stage.hasAttribute('tabindex')) stage.tabIndex = 0
  if (!stage.hasAttribute('role')) stage.setAttribute('role', 'button')
  if (!stage.hasAttribute('aria-label')) {
    stage.setAttribute('aria-label', 'Moeda Nexus interativa. Arraste para girar ou pressione Enter para virar.')
  }

  let rotY = -24
  let rotX = REST_TILT
  let velocity = reducedMotion ? 0 : AUTO_SPIN
  let mode: 'idle' | 'drag' | 'seek' = 'idle'
  let seekTarget = 0
  let holdUntil = 0

  let frame = 0
  let lastTime = 0
  let inView = false
  let pageVisible = !document.hidden

  let pointerId = -1
  let startTime = 0
  let lastX = 0
  let lastY = 0
  let lastMoveTime = 0
  let travelled = 0

  const render = () => {
    coin.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`
    const radians = (rotY * Math.PI) / 180
    const sweep = Math.sin(radians) * 70
    frontShine.style.transform = `translate3d(${(-sweep).toFixed(1)}%, 0, 0)`
    backShine.style.transform = `translate3d(${sweep.toFixed(1)}%, 0, 0)`
    shadow.style.transform = `scaleX(${(0.45 + Math.abs(Math.cos(radians)) * 0.55).toFixed(3)})`
  }

  const isSettled = () => mode === 'idle' && Math.abs(velocity) < 0.0005 && Math.abs(REST_TILT - rotX) < 0.05

  /*
   * Rotação automática no compositor (Web Animations API): enquanto ninguém interage, a moeda,
   * o brilho e a sombra são animados pela GPU e a thread principal fica livre — essencial em
   * aparelhos de entrada. O loop em JavaScript só corre durante o arrasto, a inércia e o "virar".
   */
  let spinAnimations: Animation[] = []
  let spinStartAngle = 0

  const startCompositorSpin = () => {
    if (reducedMotion || spinAnimations.length > 0 || typeof coin.animate !== 'function') return false
    const from = ((rotY % 360) + 360) % 360
    spinStartAngle = from
    rotY = from
    const coinFrames: Keyframe[] = []
    const frontFrames: Keyframe[] = []
    const backFrames: Keyframe[] = []
    const shadowFrames: Keyframe[] = []
    for (let index = 0; index <= SPIN_KEYFRAMES; index += 1) {
      const offset = index / SPIN_KEYFRAMES
      const angle = from + offset * 360
      const radians = (angle * Math.PI) / 180
      const sweep = Math.sin(radians) * 70
      coinFrames.push({ offset, transform: `rotateX(${REST_TILT}deg) rotateY(${angle.toFixed(2)}deg)` })
      frontFrames.push({ offset, transform: `translate3d(${(-sweep).toFixed(1)}%, 0, 0)` })
      backFrames.push({ offset, transform: `translate3d(${sweep.toFixed(1)}%, 0, 0)` })
      shadowFrames.push({ offset, transform: `scaleX(${(0.45 + Math.abs(Math.cos(radians)) * 0.55).toFixed(3)})` })
    }
    const timing: KeyframeAnimationOptions = { duration: SPIN_DURATION, iterations: Infinity, easing: 'linear' }
    spinAnimations = [
      coin.animate(coinFrames, timing),
      frontShine.animate(frontFrames, timing),
      backShine.animate(backFrames, timing),
      shadow.animate(shadowFrames, timing),
    ]
    if (!inView || !pageVisible) spinAnimations.forEach((animation) => animation.pause())
    return true
  }

  /** Para a animação do compositor e devolve o controlo ao JavaScript a partir do ângulo atual. */
  const stopCompositorSpin = () => {
    if (spinAnimations.length === 0) return
    const current = spinAnimations[0]?.currentTime
    const elapsed = typeof current === 'number' ? current : 0
    rotY = spinStartAngle + ((elapsed % SPIN_DURATION) / SPIN_DURATION) * 360
    rotX = REST_TILT
    velocity = AUTO_SPIN
    spinAnimations.forEach((animation) => animation.cancel())
    spinAnimations = []
    render()
  }

  const canHandOffToCompositor = (time: number) =>
    mode === 'idle' &&
    !reducedMotion &&
    time >= holdUntil &&
    // 0,0025 °/ms = 2,5 °/s de diferença: a troca para velocidade constante é imperceptível.
    Math.abs(velocity - AUTO_SPIN) < 0.0025 &&
    Math.abs(REST_TILT - rotX) < 0.15

  const step = (time: number) => {
    frame = 0
    const dt = lastTime ? Math.min(time - lastTime, 48) : 16
    lastTime = time

    if (mode === 'seek') {
      rotY += (seekTarget - rotY) * (1 - Math.exp(-dt / 110))
      if (Math.abs(seekTarget - rotY) < 0.2) {
        rotY = seekTarget
        mode = 'idle'
        velocity = 0
        holdUntil = time + 1200
      }
    } else if (mode === 'idle') {
      const target = reducedMotion || time < holdUntil ? 0 : AUTO_SPIN
      velocity += (target - velocity) * (1 - Math.exp(-dt / 700))
      rotY += velocity * dt
      // Mantém o ângulo num intervalo pequeno para não perder precisão em sessões longas.
      if (Math.abs(rotY) > 3600) rotY %= 360
    }
    if (mode !== 'drag') rotX += (REST_TILT - rotX) * (1 - Math.exp(-dt / 260))

    render()

    if ((reducedMotion && isSettled()) || (canHandOffToCompositor(time) && startCompositorSpin())) {
      lastTime = 0
      return
    }
    schedule()
  }

  function schedule() {
    if (frame === 0 && spinAnimations.length === 0 && inView && pageVisible) frame = window.requestAnimationFrame(step)
  }

  const setPlaying = (playing: boolean) => {
    if (spinAnimations.length > 0) {
      spinAnimations.forEach((animation) => (playing ? animation.play() : animation.pause()))
    } else if (playing) {
      schedule()
    } else {
      stop()
    }
  }

  const stop = () => {
    if (frame !== 0) window.cancelAnimationFrame(frame)
    frame = 0
    lastTime = 0
  }

  const seek = (target: number) => {
    seekTarget = target
    if (reducedMotion) {
      rotY = target
      mode = 'idle'
      velocity = 0
      render()
      return
    }
    mode = 'seek'
    schedule()
  }

  const flip = () => {
    stopCompositorSpin()
    const nearestFace = Math.round(rotY / 180) * 180
    seek(nearestFace + (velocity < 0 ? -180 : 180))
  }

  const onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0 || pointerId !== -1) return
    pointerId = event.pointerId
    stage.setPointerCapture(event.pointerId)
    lastX = event.clientX
    lastY = event.clientY
    startTime = lastMoveTime = event.timeStamp
    travelled = 0
    stopCompositorSpin()
    mode = 'drag'
    velocity = 0
    stage.classList.add('is-dragging')
    schedule()
  }

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerId !== pointerId) return
    const dx = event.clientX - lastX
    const dy = event.clientY - lastY
    const dt = Math.max(event.timeStamp - lastMoveTime, 1)
    travelled += Math.abs(dx) + Math.abs(dy)
    rotY += dx * DRAG_FACTOR
    rotX = clamp(rotX - dy * TILT_FACTOR, -MAX_TILT, MAX_TILT)
    velocity = velocity * 0.6 + ((dx * DRAG_FACTOR) / dt) * 0.4
    lastX = event.clientX
    lastY = event.clientY
    lastMoveTime = event.timeStamp
    schedule()
  }

  const endDrag = (event: PointerEvent, cancelled: boolean) => {
    if (event.pointerId !== pointerId) return
    pointerId = -1
    stage.classList.remove('is-dragging')
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId)

    if (!cancelled && travelled < TAP_DISTANCE && event.timeStamp - startTime < TAP_TIME) {
      mode = 'idle'
      flip()
      return
    }
    // Se o utilizador parou antes de soltar, não há arremesso.
    if (event.timeStamp - lastMoveTime > 80) velocity = 0
    velocity = reducedMotion ? 0 : clamp(velocity, -MAX_FLING, MAX_FLING)
    mode = 'idle'
    schedule()
  }

  const onPointerUp = (event: PointerEvent) => endDrag(event, false)
  const onPointerCancel = (event: PointerEvent) => endDrag(event, true)

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      flip()
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      stopCompositorSpin()
      seek((mode === 'seek' ? seekTarget : rotY) + (event.key === 'ArrowRight' ? KEY_STEP : -KEY_STEP))
    }
  }

  const onVisibilityChange = () => {
    pageVisible = !document.hidden
    setPlaying(pageVisible && inView)
  }

  const visibilityObserver =
    typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(([entry]) => {
          inView = entry?.isIntersecting ?? true
          setPlaying(inView && pageVisible)
        })
      : null
  if (visibilityObserver) visibilityObserver.observe(stage)
  else inView = true

  stage.addEventListener('pointerdown', onPointerDown)
  stage.addEventListener('pointermove', onPointerMove)
  stage.addEventListener('pointerup', onPointerUp)
  stage.addEventListener('pointercancel', onPointerCancel)
  stage.addEventListener('keydown', onKeyDown)
  document.addEventListener('visibilitychange', onVisibilityChange)

  render()
  if (!startCompositorSpin()) schedule()

  return () => {
    stop()
    spinAnimations.forEach((animation) => animation.cancel())
    spinAnimations = []
    visibilityObserver?.disconnect()
    stage.removeEventListener('pointerdown', onPointerDown)
    stage.removeEventListener('pointermove', onPointerMove)
    stage.removeEventListener('pointerup', onPointerUp)
    stage.removeEventListener('pointercancel', onPointerCancel)
    stage.removeEventListener('keydown', onKeyDown)
    document.removeEventListener('visibilitychange', onVisibilityChange)
    stage.classList.remove('is-ready', 'is-dragging')
    stage.replaceChildren(...previousChildren)
  }
}
