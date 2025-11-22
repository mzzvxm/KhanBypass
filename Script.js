// ==UserScript==
// @name        KhanBypass
// @namespace   mzzvxm
// @match       *://pt.khanacademy.org/*
// @grant       none
// @version     2.6
// @author      mzzvxm
// @icon        https://cdn.kastatic.org/images/favicon.ico
// @description 2025-11-22 - Logo Spoof + Fixes
// ==/UserScript==

const loadedPlugins = []

console.clear()
const silent = () => {}
console.warn = console.error = window.debug = silent

const splashScreen = document.createElement("splashScreen")

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

new MutationObserver(
  (changes) => changes.some((change) => change.type === "childList") && eventBus.emit("domChanged"),
).observe(document.body, { childList: true, subtree: true })

function applyLogoSpoof() {
    // Injeta a fonte via jsDelivr (Verifica se já existe pra não duplicar)
    if (!document.getElementById('mzz-font-style')) {
        const fontStyle = document.createElement('style');
        fontStyle.id = 'mzz-font-style';
        fontStyle.innerHTML = `
            @font-face {
              font-family: 'BrandonTextOfficeBold';
              src: url('https://cdn.jsdelivr.net/gh/mzzvxm/KhanBypass@main/fonts/BrandonText-Bold.otf') format('opentype');
              font-weight: normal;
              font-style: normal;
              font-display: swap;
            }
        `;
        document.head.appendChild(fontStyle);
    }

    // Encontra o SVG
    const svg = document.querySelector('svg._1rt6g9t');

    // Se não achar o SVG ou se já tiver sido modificado (evita loop), retorna
    if (!svg || svg.dataset.mzzSpoofed) return;

    // Captura a cor original antes de remover
    let originalColor = '#444'; // fallback
    const originalPath = svg.querySelector('path[fill]');
    if (originalPath) originalColor = originalPath.getAttribute('fill');

    // Remove paths antigos (mas mantém o icone/folha se tiver fill definido, remove texto)
    const textPaths = svg.querySelectorAll('path:not([fill])');
    textPaths.forEach(p => p.remove());

    // Cria o novo texto
    const newText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    newText.textContent = '@MZZVXM';
    newText.setAttribute('x', '33');
    newText.setAttribute('y', '20');
    newText.setAttribute('font-family', '"BrandonTextOfficeBold", sans-serif');
    newText.setAttribute('font-weight', 'normal');
    newText.setAttribute('font-size', '20px');
    newText.setAttribute('fill', originalColor);

    svg.appendChild(newText);

    // Marca o SVG como modificado para o MutationObserver não rodar infinitamente nele
    svg.dataset.mzzSpoofed = "true";
}

// Executa o spoof da logo sempre que o DOM mudar
eventBus.on("domChanged", applyLogoSpoof);

const wait = (ms) => new Promise((res) => setTimeout(res, ms))
const tryClick = (sel) => document.querySelector(sel)?.click()

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
        <div style="font-size:14px;color:#888;font-weight:300;letter-spacing:2px;text-transform:uppercase;">v2.5 Enhanced</div>
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
  notify("🦇｜Khan Destroyer v2.5 ativado com sucesso!", 4000)
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

function runMainScript() {
  const originalFetch = window.fetch
  const correctAnswers = new Map() // Armazena respostas corretas

  const spoofPhrases = [
      "⚔️ Segue lá no Github [**@mzzvxm**](https://github.com/mzzvxm/).",
      "🌀 Chapa Máxima!",
  ];

  // Helper para frações
  const toFraction = (d) => {
      if (d === 0 || d === 1) return String(d);
      const decimals = (String(d).split('.')[1] || '').length;
      let num = Math.round(d * Math.pow(10, decimals)), den = Math.pow(10, decimals);
      const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a; };
      const div = gcd(Math.abs(num), Math.abs(den));
      return den / div === 1 ? String(num / div) : `${num / div}/${den / div}`;
  };

  window.fetch = async function (resource, init) {
    let content
    const url = resource instanceof Request ? resource.url : resource;

    if (resource instanceof Request) {
      content = await resource.clone().text()
    } else if (init?.body) {
      content = init.body
    }

    // VIDEO EXPLOIT
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

    // Aplica a resposta correta
    if (url.includes('attemptProblem') && content) {
        try {
            let bodyObj = JSON.parse(content);
            const itemId = bodyObj.variables?.input?.assessmentItemId;
            const answers = correctAnswers.get(itemId);

            if (answers?.length > 0) {
                const attemptContent = [], userInput = {};
                let attemptState = bodyObj.variables.input.attemptState ? JSON.parse(bodyObj.variables.input.attemptState) : null;

                answers.forEach(a => {
                    if (a.type === 'radio') {
                        attemptContent.push({ selectedChoiceIds: [a.choiceId] });
                        userInput[a.widgetKey] = { selectedChoiceIds: [a.choiceId] };
                    }
                    else if (a.type === 'numeric') {
                        attemptContent.push({ currentValue: a.value });
                        userInput[a.widgetKey] = { currentValue: a.value };
                        if (attemptState?.[a.widgetKey]) attemptState[a.widgetKey].currentValue = a.value;
                    }
                    else if (a.type === 'expression') {
                        attemptContent.push(a.value);
                        userInput[a.widgetKey] = a.value;
                        if (attemptState?.[a.widgetKey]) attemptState[a.widgetKey].value = a.value;
                    }
                    else if (a.type === 'grapher') {
                        const graph = { type: a.graphType, coords: a.coords, asymptote: a.asymptote || null };
                        attemptContent.push(graph);
                        userInput[a.widgetKey] = graph;
                        if (attemptState?.[a.widgetKey]) attemptState[a.widgetKey].plot = graph;
                    }
                });

                bodyObj.variables.input.attemptContent = JSON.stringify([attemptContent, []]);
                bodyObj.variables.input.userInput = JSON.stringify(userInput);
                if (attemptState) bodyObj.variables.input.attemptState = JSON.stringify(attemptState);

                content = JSON.stringify(bodyObj);
                if (resource instanceof Request) resource = new Request(resource, { body: content });
                else init.body = content;

                notify(`✨ ${answers.length} resposta(s) aplicada(s).`, 750);
            }
        } catch (e) { console.error(e); }
    }

    const response = await originalFetch.apply(this, arguments)

    // GET ASSESSMENT
    if (url.includes('getAssessmentItem')) {
      try {
        const clone = response.clone()
        const text = await clone.text()
        const parsed = JSON.parse(text)

        // Localiza o item dentro da resposta
        let item = null;
        if (parsed?.data) {
            for (const key in parsed.data) {
                if (parsed.data[key]?.item) {
                    item = parsed.data[key].item;
                    break;
                }
            }
        }

        const itemDataRaw = item?.itemData
        if (itemDataRaw) {
            let itemData = JSON.parse(itemDataRaw)
            const answers = []

            for (const [key, w] of Object.entries(itemData.question.widgets || {})) {
                if (w.type === 'radio' && w.options?.choices) {
                    const choices = w.options.choices.map((c, i) => ({ ...c, id: c.id || `radio-choice-${i}` }));
                    const correct = choices.find(c => c.correct);
                    if (correct) answers.push({ type: 'radio', choiceId: correct.id, widgetKey: key });
                }
                else if (w.type === 'numeric-input' && w.options?.answers) {
                    const correct = w.options.answers.find(a => a.status === 'correct');
                    if (correct) {
                        const val = correct.answerForms?.some(f => f === 'proper' || f === 'improper')
                            ? toFraction(correct.value) : String(correct.value);
                        answers.push({ type: 'numeric', value: val, widgetKey: key });
                    }
                }
                else if (w.type === 'expression' && w.options?.answerForms) {
                    const correct = w.options.answerForms.find(f => f.considered === 'correct' || f.form === true);
                    if (correct) answers.push({ type: 'expression', value: correct.value, widgetKey: key });
                }
                else if (w.type === 'grapher' && w.options?.correct) {
                    const c = w.options.correct;
                    if (c.type && c.coords) answers.push({
                        type: 'grapher', graphType: c.type, coords: c.coords,
                        asymptote: c.asymptote || null, widgetKey: key
                    });
                }
            }

            if (answers.length > 0) {
                correctAnswers.set(item.id, answers);
            }

            // B. Aplica o Spoof Visual
            if (itemData.question.content[0] === itemData.question.content[0].toUpperCase()) {
                const randomPhrase = spoofPhrases[Math.floor(Math.random() * spoofPhrases.length)]

                itemData.answerArea = {
                    calculator: false,
                    chi2Table: false,
                    periodicTable: false,
                    tTable: false,
                    zTable: false,
                }

                // Conteúdo da Questão
                itemData.question.content = randomPhrase + "\n\n**Tenho Outros Scripts também! depois dá uma olhada no [ScriptHub](https://scripthubb.vercel.app/)**" + `[[☃ radio 1]]` + `\n\n**〽️ Segue lá no Instagram! [@mzzvxm](https://instagram.com/mzzvxm)**` ;

                // Widgets da Questão
                itemData.question.widgets = {
                  "radio 1": {
                    type: "radio", alignment: "default", static: false, graded: true,
                    options: {
                        choices: [
                            { content: "**〽️**", correct: true, id: "correct-choice" },
                            { content: "", correct: false, id: "incorrect-choice" }
                        ],
                        randomize: false, multipleSelect: false, displayCount: null, deselectEnabled: false
                    },
                    version: { major: 1, minor: 0 }
                  },
                }

                // Salva as alterações no JSON
                const modifiedData = { ...parsed };
                if (modifiedData.data) {
                    for (const key in modifiedData.data) {
                        if (modifiedData.data[key]?.item?.itemData) {
                            modifiedData.data[key].item.itemData = JSON.stringify(itemData);
                            break;
                        }
                    }
                }

                notify("🔓 Questão exploitada.", 750);
                return new Response(JSON.stringify(modifiedData), {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers,
                })
            }
        }
      } catch (e) { console.error(e) }
    }

    return response
  }

  // Bot de interação automática
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

    await wait(500)
    await hideSplashScreen()

    runMainScript()
    applyLogoSpoof() // Tenta aplicar logo na inicialização também
    notify("🦇｜Khan Destroyer por mzzvxm iniciado!")
    console.clear()
  })()
}
