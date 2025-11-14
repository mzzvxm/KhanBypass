// ==UserScript==
// @name        KhanBypass
// @namespace   Violentmonkey Scripts
// @match       *://pt.khanacademy.org/*
// @grant       none
// @version     1.9 (Robusto/Híbrido)
// @author      mzzvxm
// @icon        https://cdn.kastatic.org/images/favicon.ico
// @description 14/11/2025, 13:20:00
// ==/UserScript==

const loadedPlugins = []

console.clear()
const silent = () => {}
console.warn = console.error = window.debug = silent

const splashScreen = document.createElement("splashScreen")

// MZ's Event Manager (mantido original)
class EventEmitter {
  constructor() {
    this.events = {}
  }
  on(event, listener) {
    ;(Array.isArray(event) ? event : [event]).forEach((ev) => {
      ;(this.events[ev] = this.events[ev] || []).push(listener)
    })
  }
  off(event, listener) {
    ;(Array.isArray(event) ? event : [event]).forEach((ev) => {
      this.events[ev] && (this.events[ev] = this.events[ev].filter((l) => l !== listener))
    })
  }
  emit(event, ...args) {
    this.events[event]?.forEach((fn) => fn(...args))
  }
  once(event, listener) {
    const wrapper = (...args) => {
      listener(...args)
      this.off(event, wrapper)
    }
    this.on(event, wrapper)
  }
}

const eventBus = new EventEmitter()

// DOM observer personalizado (mantido original)
new MutationObserver(
  (changes) => changes.some((change) => change.type === "childList") && eventBus.emit("domChanged"),
).observe(document.body, { childList: true, subtree: true })

// Utilitários (mantidos originais)
const wait = (ms) => new Promise((res) => setTimeout(res, ms))
const tryClick = (sel) => document.querySelector(sel)?.click()

// Função para clicar em botão por texto (mantida)
const clickButtonWithText = (text) => {
  const allButtons = document.querySelectorAll("button")
  for (const button of allButtons) {
    if (button.textContent && button.textContent.trim() === text) {
      button.click()
      notify(`🚀｜Botão "${text}" clicado automaticamente!`, 1500)
      return true
    }
    const spans = button.querySelectorAll("span")
    for (const span of spans) {
      if (span.textContent && span.textContent.trim() === text) {
        button.click()
        notify(`🚀｜Botão "${text}" clicado automaticamente!`, 1500)
        return true
      }
    }
  }
  return false
}

function notify(msg, time = 5000, gravity = "bottom") {
  Toastify({
    text: msg,
    duration: time,
    gravity,
    position: "center",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(135deg, #72ff72, #00ff88)",
      color: "#000",
      fontWeight: "600",
      borderRadius: "8px",
      boxShadow: "0 4px 20px rgba(114, 255, 114, 0.3)",
    },
  }).showToast()
}

// Splash screen (mantido original)
async function showSplashScreen() {
  splashScreen.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
    display:flex;flex-direction:column;
    align-items:center;justify-content:center;z-index:99999;
    opacity:0;transition:opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    user-select:none;color:white;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size:30px;text-align:center;overflow:hidden;
  `

  splashScreen.innerHTML = `
    <div style="text-align: center; position: relative; z-index: 2; animation: slideUp 1s cubic-bezier(0.4, 0, 0.2, 1);">
      <div style="margin-bottom: 40px;">
        <div style="margin-bottom: 20px; animation: float 3s ease-in-out infinite;">
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="45" stroke="url(#gradient)" stroke-width="4" fill="none" opacity="0.3"/>
            <path d="M30 40 L50 25 L70 40 L60 60 L40 60 Z" fill="url(#gradient)" opacity="0.8"/>
            <circle cx="50" cy="45" r="8" fill="#72ff72"/>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#72ff72;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#00ff88;stop-opacity:1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div style="margin-bottom: 10px;">
          <span style="color:white;font-size:48px;font-weight:900;text-shadow:0 0 20px rgba(255,255,255,0.5);letter-spacing:4px;">KHAN</span>
          <span style="color:#72ff72;font-size:48px;font-weight:900;text-shadow:0 0 20px rgba(114,255,114,0.8);letter-spacing:4px;margin-left:10px;">DESTROYER</span>
        </div>
        <div style="font-size:14px;color:#888;font-weight:300;letter-spacing:2px;text-transform:uppercase;">v2.0 Enhanced</div>
      </div>

      <div style="margin: 40px 0;">
        <div style="width:300px;height:4px;background:rgba(255,255,255,0.1);border-radius:2px;margin:0 auto 15px;overflow:hidden;position:relative;">
          <div id="loading-progress" style="height:100%;background:linear-gradient(90deg,#72ff72,#00ff88);border-radius:2px;width:0%;transition:width 0.3s ease;box-shadow:0 0 10px rgba(114,255,114,0.6);"></div>
        </div>
        <div id="loading-text" style="font-size:16px;color:#ccc;font-weight:300;">Inicializando sistema...</div>
      </div>

      <div style="margin-top: 50px;">
        <div style="font-size:12px;color:#666;margin-bottom:5px;text-transform:uppercase;letter-spacing:1px;">Desenvolvido por</div>
        <div style="font-size:18px;color:#72ff72;font-weight:600;text-shadow:0 0 10px rgba(114,255,114,0.4);">@mzzvxm. copia não fdp ⚔️</div>
      </div>
    </div>

    <style>
      @keyframes slideUp {
        from { transform: translateY(50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
    </style>
  `

  document.body.appendChild(splashScreen)
  setTimeout(() => (splashScreen.style.opacity = "1"), 10)

  // Animação da barra de progresso
  const progressBar = document.getElementById("loading-progress")
  const loadingText = document.getElementById("loading-text")
  const steps = [
    { progress: 20, text: "Carregando dependências..." },
    { progress: 40, text: "Configurando dark mode..." },
    { progress: 60, text: "Inicializando sistema..." },
    { progress: 80, text: "Preparando interface..." },
    { progress: 100, text: "Concluído!" },
  ]

  for (const step of steps) {
    progressBar.style.width = `${step.progress}%`
    loadingText.textContent = step.text
    await wait(400)
  }
}

async function hideSplashScreen() {
  splashScreen.style.opacity = "0"
  setTimeout(() => splashScreen.remove(), 1000)
  notify("🦇｜Khan Destroyer v2.0 ativado com sucesso!", 4000)
}

async function loadScript(url, label) {
  const response = await fetch(url)
  const code = await response.text()
  loadedPlugins.push(label)
  eval(code)
}

async function loadCss(url) {
  return new Promise((resolve) => {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.type = "text/css"
    link.href = url
    link.onload = resolve
    document.head.appendChild(link)
  })
}

// Core hook principal (mantido original)
function runMainScript() {
  const originalFetch = window.fetch

  window.fetch = async function (resource, init) {
    let content
    if (resource instanceof Request) {
      content = await resource.clone().text()
    } else if (init?.body) {
      content = init.body
    }

    if (content?.includes('"operationName":"updateUserVideoProgress"')) {
      try {
        const parsed = JSON.parse(content)
        const input = parsed.variables?.input
        if (input) {
          input.secondsWatched = input.durationSeconds
          input.lastSecondWatched = input.durationSeconds
          content = JSON.stringify(parsed)
          if (resource instanceof Request) {
            resource = new Request(resource, { body: content })
          } else {
            init.body = content
          }
          notify("🔄｜Vídeo exploitado.", 1000)
        }
      } catch {}
    }

    const response = await originalFetch.apply(this, arguments)

    try {
      const clone = response.clone()
      const text = await clone.text()
      const parsed = JSON.parse(text)

      const itemDataRaw = parsed?.data?.assessmentItem?.item?.itemData
      if (itemDataRaw) {
        const itemData = JSON.parse(itemDataRaw)

        if (itemData.question.content[0] === itemData.question.content[0].toUpperCase()) {
          itemData.answerArea = {
            calculator: false,
            chi2Table: false,
            periodicTable: false,
            tTable: false,
            zTable: false,
          }

          itemData.question.content = "Desenvolvido por @mzzvxm. Segue lá no insta! 〽️ [[☃ radio 1]]"
          itemData.question.widgets = {
            "radio 1": {
              type: "radio",
              options: {
                choices: [{ content: "☄️", correct: true }],
              },
            },
          }

          parsed.data.assessmentItem.item.itemData = JSON.stringify(itemData)

          return new Response(JSON.stringify(parsed), {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
          })
        }
      }
    } catch {}

    return response
  }

  // =================================================================
  // Bot de interação automática (VERSÃO HÍBRIDA ROBUSTA)
  // =================================================================
  ;(async () => {
    window.khanwareDominates = true

    while (window.khanwareDominates) {
      clickButtonWithText("Vamos lá")
      clickButtonWithText("Mostrar resumo")
      tryClick(`button[aria-label^="("]`)
      tryClick(`[data-testid="exercise-check-answer"]`)
      tryClick(`[data-testid="exercise-next-question"]`)
      
      await wait(1200)
    }
  })()
}

// Validação de domínio e inicialização (mantida original)
if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) {
  window.location.href = "https://pt.khanacademy.org/"
} else {
  ;(async function init() {
    await showSplashScreen()

    await Promise.all([
      loadScript("https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js", "darkReaderPlugin").then(() => {
        DarkReader.setFetchMethod(window.fetch)
        DarkReader.enable()
      }),
      loadCss("https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css"),
      loadScript("https://cdn.jsdelivr.net/npm/toastify-js", "toastifyPlugin"),
    ])

    await wait(2000)
    await hideSplashScreen()

    runMainScript()
    notify("🦇｜Khan Destroyer por mzzvxm iniciado!")
    console.clear()
  })()
}
