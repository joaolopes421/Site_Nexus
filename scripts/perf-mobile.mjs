#!/usr/bin/env node
/**
 * Teste de desempenho mobile em aparelhos Samsung de entrada (laboratório, sem dependências).
 *
 * - Serve o build de produção (dist/) localmente, com gzip, como faria a Vercel.
 * - Abre Chrome ou Edge em modo headless e controla-o pelo protocolo DevTools (CDP) via WebSocket nativo do Node.
 * - Para cada perfil emula viewport, densidade de pixels, toque, lentidão de CPU e rede limitada.
 * - Mede FCP, LCP, CLS, TBT, bytes transferidos, tempo até o shell ficar interativo,
 *   FPS da moeda a girar, FPS ao arrastar a moeda com o dedo e FPS ao fazer scroll.
 *
 * Uso: npm run perf:mobile        (faz o build e corre o teste)
 *      node scripts/perf-mobile.mjs   (usa o dist/ existente)
 * Navegador: define PERF_BROWSER=/caminho/do/chrome se não for encontrado automaticamente.
 *
 * Nota: a lentidão de CPU é relativa à máquina onde o teste corre e a GPU não é emulada,
 * por isso os números são uma aproximação conservadora, não uma medição num aparelho real.
 */
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdtemp, readFile, rm, stat } from 'node:fs/promises'
import http from 'node:http'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(ROOT, 'dist')

const NETWORKS = {
  none: { label: 'sem limite', latency: 0, down: -1, up: -1 },
  '4g': { label: '4G', latency: 60, down: (9 * 1024 * 1024) / 8, up: (3 * 1024 * 1024) / 8 },
  slow4g: { label: '4G lento', latency: 150, down: (1.6 * 1024 * 1024) / 8, up: (750 * 1024) / 8 },
  '3g': { label: '3G', latency: 300, down: (700 * 1024) / 8, up: (350 * 1024) / 8 },
}

// Altura = área visível do site (ecrã menos barra de estado, barra do Chrome e navegação do Android).
const PROFILES = [
  { name: 'Referência (este PC, sem limites)', hardware: '—', width: 360, height: 672, dpr: 2, cpu: 1, network: 'none' },
  { name: 'Galaxy A15', hardware: 'Helio G99 · 4–8 GB', width: 412, height: 763, dpr: 2.625, cpu: 3, network: '4g' },
  { name: 'Galaxy A05 / A04e', hardware: 'Helio G85 / P35 · 3–4 GB', width: 360, height: 672, dpr: 2, cpu: 4, network: 'slow4g' },
  { name: 'Galaxy A03 Core', hardware: 'Unisoc SC9863A · 2 GB', width: 360, height: 672, dpr: 2, cpu: 6, network: 'slow4g' },
  { name: 'Galaxy J2 Core', hardware: 'Exynos 7570 · 1 GB', width: 360, height: 512, dpr: 1.5, cpu: 8, network: '3g' },
]

const USER_AGENT =
  'Mozilla/5.0 (Linux; Android 13; SM-A055M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
}
const COMPRESSIBLE = new Set(['.html', '.js', '.css', '.json', '.svg'])

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// ---------------------------------------------------------------- servidor estático do build

function startStaticServer() {
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? '/', 'http://localhost')
      let filePath = path.normalize(path.join(DIST, decodeURIComponent(url.pathname)))
      if (!filePath.startsWith(DIST)) {
        res.writeHead(403).end()
        return
      }
      if (url.pathname === '/' || !existsSync(filePath) || (await stat(filePath)).isDirectory()) {
        filePath = path.join(DIST, 'index.html')
      }
      const ext = path.extname(filePath).toLowerCase()
      let body = await readFile(filePath)
      const headers = { 'Content-Type': MIME[ext] ?? 'application/octet-stream', 'Cache-Control': 'no-store' }
      if (COMPRESSIBLE.has(ext) && /\bgzip\b/.test(req.headers['accept-encoding'] ?? '')) {
        body = gzipSync(body, { level: 9 })
        headers['Content-Encoding'] = 'gzip'
      }
      headers['Content-Length'] = body.length
      res.writeHead(200, headers)
      res.end(req.method === 'HEAD' ? undefined : body)
    } catch (error) {
      res.writeHead(500).end(String(error))
    }
  })
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)))
}

// ---------------------------------------------------------------- navegador + CDP

function findBrowser() {
  const candidates = [
    process.env.PERF_BROWSER,
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Google/Chrome/Application/chrome.exe'),
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/microsoft-edge',
  ].filter(Boolean)
  return candidates.find((candidate) => existsSync(candidate))
}

async function launchBrowser(executable) {
  const profileDir = await mkdtemp(path.join(os.tmpdir(), 'nexus-perf-'))
  const child = spawn(
    executable,
    [
      '--headless=new',
      '--remote-debugging-port=0',
      `--user-data-dir=${profileDir}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--disable-component-update',
      '--disable-background-networking',
      '--disable-sync',
      '--mute-audio',
      '--hide-scrollbars',
      'about:blank',
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] },
  )

  const wsUrl = await new Promise((resolve, reject) => {
    let buffer = ''
    const timer = setTimeout(() => reject(new Error('O navegador não respondeu em 20 s.')), 20_000)
    child.stderr.on('data', (chunk) => {
      buffer += chunk.toString()
      const match = buffer.match(/DevTools listening on (ws:\/\/\S+)/)
      if (match) {
        clearTimeout(timer)
        resolve(match[1])
      }
    })
    child.on('exit', (code) => reject(new Error(`O navegador terminou antes de abrir (código ${code}).`)))
  })

  const close = async () => {
    child.kill()
    await sleep(500)
    await rm(profileDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }).catch(() => {})
  }
  return { wsUrl, close }
}

class CdpConnection {
  constructor(socket) {
    this.socket = socket
    this.nextId = 0
    this.pending = new Map()
    this.listeners = new Set()
    socket.addEventListener('message', (event) => {
      const message = JSON.parse(String(event.data))
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id)
        this.pending.delete(message.id)
        if (message.error) reject(new Error(`${message.error.message} (${message.error.code})`))
        else resolve(message.result)
      } else if (message.method) {
        this.listeners.forEach((listener) => listener(message))
      }
    })
  }

  static open(url) {
    return new Promise((resolve, reject) => {
      const socket = new WebSocket(url)
      socket.addEventListener('open', () => resolve(new CdpConnection(socket)), { once: true })
      socket.addEventListener('error', () => reject(new Error('Falha ao ligar ao DevTools.')), { once: true })
    })
  }

  send(method, params = {}, sessionId) {
    const id = ++this.nextId
    this.socket.send(JSON.stringify({ id, method, params, sessionId }))
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject })
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id)
          reject(new Error(`Tempo esgotado em ${method}`))
        }
      }, 90_000)
    })
  }

  onEvent(listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  waitForEvent(method, sessionId, timeout = 60_000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        off()
        reject(new Error(`Tempo esgotado à espera de ${method}`))
      }, timeout)
      const off = this.onEvent((message) => {
        if (message.method === method && message.sessionId === sessionId) {
          clearTimeout(timer)
          off()
          resolve(message.params)
        }
      })
    })
  }

  close() {
    this.socket.close()
  }
}

// ---------------------------------------------------------------- script injetado na página

const PAGE_PROBE = `(() => {
  const perf = { fcp: 0, lcp: 0, lcpElement: '', cls: 0, longTasks: [], coinAt: 0, enhancedAt: 0 };
  window.__nxPerf = perf;
  const observe = (type, onEntries) => { try { new PerformanceObserver((list) => onEntries(list.getEntries())).observe({ type, buffered: true }); } catch {} };
  observe('paint', (entries) => entries.forEach((e) => { if (e.name === 'first-contentful-paint') perf.fcp = e.startTime; }));
  observe('largest-contentful-paint', (entries) => {
    const last = entries[entries.length - 1];
    if (!last) return;
    perf.lcp = last.startTime;
    const el = last.element;
    perf.lcpElement = el ? el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className ? '.' + el.className.split(' ')[0] : '') : (last.url || '');
  });
  observe('layout-shift', (entries) => entries.forEach((e) => { if (!e.hadRecentInput) perf.cls += e.value; }));
  observe('longtask', (entries) => entries.forEach((e) => perf.longTasks.push([e.startTime, e.duration])));
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('[data-contact-form]');
    const coin = document.querySelector('[data-nexus-coin]');
    const check = () => {
      if (!perf.coinAt && coin && coin.classList.contains('is-ready')) perf.coinAt = performance.now();
      if (!perf.enhancedAt && form && form.classList.contains('is-ready')) perf.enhancedAt = performance.now();
    };
    const observer = new MutationObserver(check);
    if (form) observer.observe(form, { attributes: true, attributeFilter: ['class'] });
    if (coin) observer.observe(coin, { attributes: true, attributeFilter: ['class'] });
    check();
  }, { once: true });
  window.__nxSample = (ms) => new Promise((resolve) => {
    const frames = []; let last = performance.now(); const end = last + ms;
    const tick = (now) => { frames.push(now - last); last = now; if (now < end) requestAnimationFrame(tick); else resolve(frames); };
    requestAnimationFrame(tick);
  });
})();`

// ---------------------------------------------------------------- métricas

const VSYNC_60 = 1000 / 60

/**
 * Em headless o requestAnimationFrame não fica preso a 60 Hz, por isso converte-se o tempo de cada frame
 * para o que um ecrã de 60 Hz mostraria: um frame que demora 20 ms ocupa 2 ciclos (cai para 30 fps nesse instante).
 */
function frameStats(samples) {
  const intervals = samples.slice(1).filter((value) => value > 0)
  if (intervals.length === 0) return { fps: 0, p95: 0, dropped: 1, jank: 1 }
  const slots = intervals.map((value) => Math.max(1, Math.ceil((value - 1) / VSYNC_60)))
  const totalSlots = slots.reduce((sum, value) => sum + value, 0)
  const sorted = [...intervals].sort((a, b) => a - b)
  return {
    fps: Math.round((intervals.length / (totalSlots * VSYNC_60)) * 1000),
    p95: Math.round(sorted[Math.floor(sorted.length * 0.95)] ?? 0),
    dropped: intervals.filter((value) => value > VSYNC_60 + 1).length / intervals.length,
    jank: intervals.filter((value) => value > 34).length / intervals.length,
  }
}

const grade = (value, good, ok, lowerIsBetter = true) => {
  if (value == null || Number.isNaN(value)) return '—'
  const isGood = lowerIsBetter ? value <= good : value >= good
  const isOk = lowerIsBetter ? value <= ok : value >= ok
  return isGood ? 'bom' : isOk ? 'aceitável' : 'lento'
}

async function runProfile(cdp, baseUrl, profile) {
  const { browserContextId } = await cdp.send('Target.createBrowserContext', { disposeOnDetach: true })
  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank', browserContextId })
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true })
  const send = (method, params) => cdp.send(method, params, sessionId)
  const evaluate = async (expression, awaitPromise = false) => {
    const { result, exceptionDetails } = await send('Runtime.evaluate', { expression, awaitPromise, returnByValue: true })
    if (exceptionDetails) throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text)
    return result.value
  }

  let bytes = 0
  let requests = 0
  const offNetwork = cdp.onEvent((message) => {
    if (message.sessionId !== sessionId) return
    if (message.method === 'Network.loadingFinished') {
      bytes += message.params.encodedDataLength
      requests += 1
    }
  })

  try {
    await Promise.all([send('Page.enable'), send('Runtime.enable'), send('Network.enable'), send('Performance.enable')])
    await send('Network.setCacheDisabled', { cacheDisabled: true })
    await send('Emulation.setDeviceMetricsOverride', {
      width: profile.width,
      height: profile.height,
      deviceScaleFactor: profile.dpr,
      mobile: true,
      screenWidth: profile.width,
      screenHeight: profile.height,
    })
    await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 })
    await send('Emulation.setUserAgentOverride', { userAgent: USER_AGENT, platform: 'Android' })
    await send('Emulation.setCPUThrottlingRate', { rate: profile.cpu })
    const network = NETWORKS[profile.network]
    await send('Network.emulateNetworkConditions', {
      offline: false,
      latency: network.latency,
      downloadThroughput: network.down,
      uploadThroughput: network.up,
    })
    await send('Page.addScriptToEvaluateOnNewDocument', { source: PAGE_PROBE })

    const loaded = cdp.waitForEvent('Page.loadEventFired', sessionId, 90_000)
    await send('Page.navigate', { url: baseUrl })
    await loaded

    // Espera o script de melhoria (moeda + menu + formulário) ficar ativo.
    const readyDeadline = Date.now() + 45_000
    while (Date.now() < readyDeadline && !(await evaluate('window.__nxPerf.enhancedAt > 0'))) await sleep(150)
    await sleep(1200)

    const page = await evaluate(`(() => {
      const p = window.__nxPerf;
      const nav = performance.getEntriesByType('navigation')[0];
      const tbt = p.longTasks.filter(([start]) => start >= p.fcp).reduce((sum, [, duration]) => sum + Math.max(0, duration - 50), 0);
      return {
        isMobileShell: !!document.querySelector('.mobile-site') && !document.querySelector('#conteudo'),
        fcp: p.fcp, lcp: p.lcp, lcpElement: p.lcpElement, cls: p.cls, tbt,
        longTasks: p.longTasks.length,
        load: nav ? nav.loadEventEnd : 0,
        coinAt: p.coinAt, enhancedAt: p.enhancedAt,
      };
    })()`)
    const bytesAtReady = bytes
    const requestsAtReady = requests

    // Moeda a girar sozinha, visível no ecrã.
    const center = await evaluate(`(() => {
      const stage = document.querySelector('[data-nexus-coin]');
      stage.scrollIntoView({ block: 'center' });
      const r = stage.getBoundingClientRect();
      return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
    })()`)
    await sleep(700)
    const spin = frameStats(await evaluate('window.__nxSample(3000)', true))

    // Arrastar a moeda com o dedo (eventos de toque reais via CDP).
    // Ângulo lido do estilo calculado (inclui a animação do compositor): rotY = atan2(m31, m11).
    const angle = () =>
      evaluate(`(() => { const m = new DOMMatrix(getComputedStyle(document.querySelector('.nx-coin')).transform); return Math.atan2(m.m31, m.m11) * 180 / Math.PI; })()`)
    const compositorSpin = await evaluate(`document.querySelector('.nx-coin').getAnimations().length > 0`)
    const angleBefore = await angle()
    await evaluate('window.__nxDrag = window.__nxSample(1800); 0')
    await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: center.x - 70, y: center.y }] })
    for (let step = 1; step <= 24; step += 1) {
      await send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: center.x - 70 + step * 6, y: center.y + (step % 2) }] })
      await sleep(16)
    }
    await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    const drag = frameStats(await evaluate('window.__nxDrag', true))
    const rotated = Math.abs(((((await angle()) - angleBefore) % 360) + 540) % 360 - 180)

    // Depois de soltar, a inércia abranda e a rotação automática deve voltar para o compositor.
    const releasedAt = Date.now()
    let handoffSeconds = null
    while (Date.now() - releasedAt < 10_000) {
      if (await evaluate(`document.querySelector('.nx-coin').getAnimations().length > 0`)) {
        handoffSeconds = (Date.now() - releasedAt) / 1000
        break
      }
      await sleep(200)
    }

    // Scroll com o dedo desde o topo: três arrastos rápidos para cima (com inércia), como um utilizador real.
    await evaluate('window.scrollTo(0, 0)')
    await sleep(400)
    await evaluate('window.__nxScroll = window.__nxSample(3000); 0')
    const swipeX = Math.round(profile.width * 0.15)
    for (let swipe = 0; swipe < 3; swipe += 1) {
      const startY = Math.round(profile.height * 0.8)
      await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: swipeX, y: startY }] })
      for (let step = 1; step <= 12; step += 1) {
        await send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: swipeX, y: startY - step * 28 }] })
        await sleep(12)
      }
      await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
      await sleep(350)
    }
    // Fallback para navegadores em que o toque emulado não faz scroll: roda do rato.
    if ((await evaluate('window.scrollY')) < 50) {
      for (let tick = 0; tick < 60; tick += 1) {
        await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: swipeX, y: Math.round(profile.height / 2), deltaX: 0, deltaY: 40 })
        await sleep(16)
      }
    }
    const scroll = frameStats(await evaluate('window.__nxScroll', true))
    const scrolled = await evaluate('Math.round(window.scrollY)')

    const { metrics } = await send('Performance.getMetrics')
    const metric = (name) => metrics.find((item) => item.name === name)?.value ?? 0

    return {
      ...profile,
      ...page,
      bytes: bytesAtReady,
      requests: requestsAtReady,
      spin,
      compositorSpin,
      drag,
      rotated,
      handoffSeconds,
      scroll,
      scrolled,
      heapMb: metric('JSHeapUsedSize') / 1024 / 1024,
      nodes: metric('Nodes'),
    }
  } finally {
    offNetwork()
    await cdp.send('Target.closeTarget', { targetId }).catch(() => {})
    await cdp.send('Target.disposeBrowserContext', { browserContextId }).catch(() => {})
  }
}

// ---------------------------------------------------------------- relatório

const ms = (value) => (value ? `${(value / 1000).toFixed(2)} s` : '—')
const pct = (value) => `${Math.round(value * 100)}%`

function printReport(results) {
  console.log('\nResultados (carregamento a frio, sem cache):\n')
  for (const r of results) {
    const network = NETWORKS[r.network].label
    console.log(`■ ${r.name}  ·  ${r.hardware}  ·  CPU ${r.cpu}x mais lenta  ·  rede ${network}  ·  ${r.width}×${r.height} @${r.dpr}x`)
    if (!r.isMobileShell) console.log('  ⚠ Não carregou o shell mobile — verifique a largura emulada.')
    console.log(`  Primeira pintura (FCP) ....... ${ms(r.fcp).padEnd(9)} ${grade(r.fcp, 1800, 3000)}`)
    console.log(`  Maior pintura (LCP) .......... ${ms(r.lcp).padEnd(9)} ${grade(r.lcp, 2500, 4000)}  [${r.lcpElement || '—'}]`)
    console.log(`  Bloqueio total (TBT) ......... ${`${Math.round(r.tbt)} ms`.padEnd(9)} ${grade(r.tbt, 200, 600)}  (${r.longTasks} tarefas longas)`)
    console.log(`  Saltos de layout (CLS) ....... ${r.cls.toFixed(3).padEnd(9)} ${grade(r.cls, 0.1, 0.25)}`)
    console.log(`  Moeda/menu/formulário ativos . ${ms(r.enhancedAt).padEnd(9)} (evento load: ${ms(r.load)})`)
    console.log(`  Transferido até ficar pronto . ${(r.bytes / 1024).toFixed(1)} KB em ${r.requests} pedidos`)
    const spinMode = r.compositorSpin ? 'compositor' : 'JavaScript'
    console.log(`  Moeda a girar (60 Hz) ........ ${`${r.spin.fps} fps`.padEnd(9)} ${grade(r.spin.fps, 55, 30, false)}  (${spinMode}; p95 ${r.spin.p95} ms; ${pct(r.spin.dropped)} frames perdidos)`)
    console.log(`  Arrastar a moeda (60 Hz) ..... ${`${r.drag.fps} fps`.padEnd(9)} ${grade(r.drag.fps, 55, 30, false)}  (girou ${Math.round(r.rotated)}°; p95 ${r.drag.p95} ms; ${pct(r.drag.dropped)} frames perdidos)`)
    console.log(`  Volta ao compositor .......... ${r.handoffSeconds == null ? 'não voltou em 10 s' : `${r.handoffSeconds.toFixed(1)} s após soltar`}`)
    console.log(`  Scroll da página (60 Hz) ..... ${`${r.scroll.fps} fps`.padEnd(9)} ${grade(r.scroll.fps, 55, 30, false)}  (desceu ${r.scrolled}px; p95 ${r.scroll.p95} ms; ${pct(r.scroll.dropped)} frames perdidos)`)
    console.log(`  Memória JS / nós DOM ......... ${r.heapMb.toFixed(1)} MB / ${r.nodes}\n`)
  }
  console.log('Critérios: FCP ≤1,8 s bom · LCP ≤2,5 s bom · TBT ≤200 ms bom · CLS ≤0,1 bom · animação ≥55 fps bom, ≥30 aceitável (ecrã 60 Hz).')
  console.log('Laboratório: CPU limitada em relação a esta máquina, GPU não emulada. Confirme num aparelho real com `npm run dev:vite`.')
}

// ---------------------------------------------------------------- main

async function main() {
  if (!existsSync(path.join(DIST, 'index.html'))) {
    console.error('dist/ não encontrado. Corra `npm run build` primeiro (ou use `npm run perf:mobile`).')
    process.exit(1)
  }
  const executable = findBrowser()
  if (!executable) {
    console.error('Chrome/Edge não encontrado. Defina PERF_BROWSER com o caminho do executável.')
    process.exit(1)
  }

  const server = await startStaticServer()
  const baseUrl = `http://127.0.0.1:${server.address().port}/`
  console.log(`Build servido em ${baseUrl}  ·  navegador: ${path.basename(executable)}`)

  const browser = await launchBrowser(executable)
  const cdp = await CdpConnection.open(browser.wsUrl)
  const results = []
  try {
    for (const profile of PROFILES) {
      process.stdout.write(`A testar ${profile.name}... `)
      const started = Date.now()
      results.push(await runProfile(cdp, baseUrl, profile))
      console.log(`ok (${((Date.now() - started) / 1000).toFixed(1)} s)`)
    }
    printReport(results)
  } finally {
    cdp.close()
    await browser.close()
    server.close()
  }
}

main().catch((error) => {
  console.error('\nFalha no teste de desempenho:', error.message)
  process.exit(1)
})
