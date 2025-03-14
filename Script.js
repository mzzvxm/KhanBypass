/* Identificação do dispositivo */
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Mobile|Tablet|Kindle|Silk|PlayBook|BB10/i.test(navigator.userAgent);
const isAppleDevice = /iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(navigator.userAgent);

/* Plugins carregados */
let pluginsAtivos = [];

/* Elementos auxiliares */
const telaInicial = document.createElement('div');
const janelaPopup = document.createElement('div');

/* Configurações principais */
window.opcoes = {
    alterarPerguntas: true,
    modificarVideos: true,
    respostaAutomatica: true,
};
window.parametros = {
    atrasoResposta: 1.1,
};

/* Bloqueios de inspeção */
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
    if (["F12", "I", "C", "U", "J"].includes(e.key) && e.ctrlKey && e.shiftKey) {
        e.preventDefault();
    }
});

console.error = () => {};

/* Sistema de Eventos */
class ManipuladorEventos {
    constructor() {
        this.eventos = {};
    }
    ao(evento, callback) {
        (Array.isArray(evento) ? evento : [evento]).forEach(e => {
            this.eventos[e] = this.eventos[e] || [];
            this.eventos[e].push(callback);
        });
    }
    desativar(evento, callback) {
        (Array.isArray(evento) ? evento : [evento]).forEach(e => {
            if (this.eventos[e]) {
                this.eventos[e] = this.eventos[e].filter(fn => fn !== callback);
            }
        });
    }
    emitir(evento, ...args) {
        if (this.eventos[evento]) {
            this.eventos[evento].forEach(fn => fn(...args));
        }
    }
}
const gerenciadorEventos = new ManipuladorEventos();

/* Observação de mudanças no DOM */
new MutationObserver((mutacoes) => {
    mutacoes.forEach(m => {
        if (m.type === 'childList') gerenciadorEventos.emitir('alteracaoDOM');
    });
}).observe(document.body, { childList: true, subtree: true });

/* Funções auxiliares */
const esperar = (ms) => new Promise(resolver => setTimeout(resolver, ms));

async function carregarScript(url, identificador) {
    return fetch(url)
        .then(res => res.text())
        .then(script => {
            pluginsAtivos.push(identificador);
            eval(script);
        });
}

async function carregarEstilo(url) {
    return new Promise((resolve) => {
        const estilo = document.createElement('link');
        estilo.rel = 'stylesheet';
        estilo.href = url;
        estilo.onload = () => resolve();
        document.head.appendChild(estilo);
    });
}

/* Exibição da tela inicial */
async function mostrarTelaInicial() {
    telaInicial.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background-color:#000;display:flex;align-items:center;justify-content:center;z-index:9999;color:white;font-size:30px;text-align:center;";
    telaInicial.innerHTML = '<span style="color:white;">KHAN</span><span style="color:#32CD32;">BYPASS</span>';
    document.body.appendChild(telaInicial);
}

async function ocultarTelaInicial() {
    telaInicial.remove();
}

/* Carregamento dos plugins essenciais */
function iniciarFerramentas() {
    loadScript('https://raw.githubusercontent.com/DarkMod3/KhanFucker/refs/heads/Main/Plugins/questionSpoof.js', 'alterarPerguntas');
    loadScript('https://raw.githubusercontent.com/DarkMod3/KhanFucker/refs/heads/Main/Plugins/videoSpoof.js', 'modificarVideos');
    loadScript('https://raw.githubusercontent.com/DarkMod3/KhanFucker/refs/heads/Main/Plugins/spoofUser.js', 'usuarioFalso');
    loadScript('https://raw.githubusercontent.com/DarkMod3/KhanFucker/refs/heads/Main/Plugins/autoAnswer.js', 'respostaAutomatica');
}

/* Garantir que esteja no domínio correto */
if (!/^https?:\/\/(.*\.)?khanacademy\.org/.test(window.location.href)) {
    window.location.href = "https://pt.khanacademy.org/";
}

/* Inicialização */
mostrarTelaInicial();

/* Carregar extras */
carregarScript('https://cdn.jsdelivr.net/npm/darkreader', 'darkReader').then(() => {
    DarkReader.setFetchMethod(window.fetch);
    DarkReader.enable();
});

carregarEstilo('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');
carregarScript('https://cdn.jsdelivr.net/npm/toastify-js', 'notificacoes').then(async () => {
    await esperar(2000);
    ocultarTelaInicial();
    iniciarFerramentas();

    console.clear();
    console.log(`
                                           
8d8b.d8b. 888P 888P Yb  dP Yb dP 8d8b.d8b. 
8P Y8P Y8  dP   dP   YbdP   `8.  8P Y8P Y8 
8   8   8 d888 d888   YP   dP Yb 8   8   8 
                                            
    `);
});
