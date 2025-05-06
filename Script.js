let loadedPlugins = [];

console.clear();
const silent = () => {};
console.warn = console.error = window.debug = silent;

const splashScreen = document.createElement('splashScreen');

// MZ's Event Manager
class EventEmitter {
  constructor() {
    this.events = {};
  }
  on(event, listener) {
    (Array.isArray(event) ? event : [event]).forEach(ev => {
      (this.events[ev] = this.events[ev] || []).push(listener);
    });
  }
  off(event, listener) {
    (Array.isArray(event) ? event : [event]).forEach(ev => {
      this.events[ev] && (this.events[ev] = this.events[ev].filter(l => l !== listener));
    });
  }
  emit(event, ...args) {
    this.events[event]?.forEach(fn => fn(...args));
  }
  once(event, listener) {
    const wrapper = (...args) => {
      listener(...args);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }
}

const eventBus = new EventEmitter();

// DOM observer personalizado
new MutationObserver(changes =>
  changes.some(change => change.type === 'childList') && eventBus.emit('domChanged')
).observe(document.body, { childList: true, subtree: true });

// Utilitários
const wait = ms => new Promise(res => setTimeout(res, ms));
const tryClick = sel => document.querySelector(sel)?.click();

function notify(msg, time = 5000, gravity = 'bottom') {
  Toastify({
    text: msg,
    duration: time,
    gravity,
    position: "center",
    stopOnFocus: true,
    style: { background: "#000000" }
  }).showToast();
}

// Splash screen customizado
async function showSplashScreen() {
  splashScreen.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    background-color:#000;display:flex;flex-direction:column;
    align-items:center;justify-content:center;z-index:9999;
    opacity:0;transition:opacity 0.5s ease;
    user-select:none;color:white;font-family:MuseoSans,sans-serif;
    font-size:30px;text-align:center;
  `;
  splashScreen.innerHTML = `
    <span style="color:white;">KHAN</span><span style="color:#72ff72;">DESTROYER</span>
    <small style="margin-top:10px;color:gray;font-size:16px;">Criado por mzzvxm</small>
  `;
  document.body.appendChild(splashScreen);
  setTimeout(() => splashScreen.style.opacity = '1', 10);
}

async function hideSplashScreen() {
  splashScreen.style.opacity = '0';
  setTimeout(() => splashScreen.remove(), 1000);
  notify("🦇｜Se você está vendo isso, o script está ativado!", 4000);
}

async function loadScript(url, label) {
  const response = await fetch(url);
  const code = await response.text();
  loadedPlugins.push(label);
  eval(code);
}

async function loadCss(url) {
  return new Promise(resolve => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    link.onload = resolve;
    document.head.appendChild(link);
  });
}

// Core hook principal
function runMainScript() {

  const originalFetch = window.fetch;

  window.fetch = async function(resource, init) {
    let content;
    if (resource instanceof Request) {
      content = await resource.clone().text();
    } else if (init?.body) {
      content = init.body;
    }

    if (content?.includes('"operationName":"updateUserVideoProgress"')) {
      try {
        const parsed = JSON.parse(content);
        const input = parsed.variables?.input;
        if (input) {
          input.secondsWatched = input.durationSeconds;
          input.lastSecondWatched = input.durationSeconds;
          content = JSON.stringify(parsed);
          if (resource instanceof Request) {
            resource = new Request(resource, { body: content });
          } else {
            init.body = content;
          }
          notify("🔄｜Vídeo exploitado.", 1000);
        }
      } catch {}
    }

    const response = await originalFetch.apply(this, arguments);

    try {
      const clone = response.clone();
      const text = await clone.text();
      const parsed = JSON.parse(text);

      const itemDataRaw = parsed?.data?.assessmentItem?.item?.itemData;
      if (itemDataRaw) {
        const itemData = JSON.parse(itemDataRaw);

        if (itemData.question.content[0] === itemData.question.content[0].toUpperCase()) {
          itemData.answerArea = {
            calculator: false,
            chi2Table: false,
            periodicTable: false,
            tTable: false,
            zTable: false
          };

          itemData.question.content = "Desenvolvido por: ! Snow? [[☃ radio 1]]";
          itemData.question.widgets = {
            "radio 1": {
              type: "radio",
              options: {
                choices: [{ content: "🦇", correct: true }]
              }
            }
          };

          parsed.data.assessmentItem.item.itemData = JSON.stringify(itemData);

          return new Response(JSON.stringify(parsed), {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
          });
        }
      }
    } catch {}

    return response;
  };

  // Bot de interação automática
  (async () => {
    const selectors = [
      `[data-testid="choice-icon__library-choice-icon"]`,
      `[data-testid="exercise-check-answer"]`,
      `[data-testid="exercise-next-question"]`,
      `._1udzurba`,
      `._awve9b`
    ];

    window.khanwareDominates = true;

    while (window.khanwareDominates) {
      for (const sel of selectors) {
        tryClick(sel);

        const inner = document.querySelector(`${sel}> div`);
        if (inner?.innerText === "Mostrar resumo") {
          notify("🎉｜Exercício concluído!", 3000);
        }
      }
      await wait(1500);
    }
  })();
}

// Validação de domínio e inicialização
if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) {
  window.location.href = "https://pt.khanacademy.org/";
} else {
  (async function init() {
    await showSplashScreen();

    await Promise.all([
      loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin').then(() => {
        DarkReader.setFetchMethod(window.fetch);
        DarkReader.enable();
      }),
      loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css'),
      loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin')
    ]);

    await wait(2000);
    await hideSplashScreen();

    runMainScript();
    notify("🦇｜Khan Destroyer por mzzvxm iniciado!");
    console.clear();
  })();
}
