// Definição das variáveis
const features = {
    autoAnswer: true,
    questionSpoof: true,
    nextRecomendation: true,
    repeatQuestion: false,
};

const featureConfigs = {
    autoAnswerDelay: 2,  // Atraso em segundos
};

// Função delay para esperar entre as execuções
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Função para encontrar um elemento e clicar
function findAndClickByClass(className) {
    const element = document.querySelector(`.${className}`);
    if (element) {
        element.click();
    }
}

// Detecção de dispositivos móveis
const device = {
    mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Mobile|Tablet|Kindle|Silk|PlayBook|BB10/i.test(navigator.userAgent),
};

// Seletores das classes a serem verificadas
const classSelectors = ["_19uopuu", "_ssxvf9l", "_1r8cd7xe", "_1yok8f4", "_4i5p5ae", "_s6zfc1u"];
let khanwareDominates = true;

// Função principal assíncrona
(async () => {
    while (khanwareDominates) {
        if (features.autoAnswer && features.questionSpoof) {
            const classesToCheck = [...classSelectors];
            if (features.nextRecomendation) device.mobile ? classesToCheck.push("_ixuggsz") : classesToCheck.push("_1kkrg8oi");
            if (features.repeatQuestion) classesToCheck.push("_ypgawqo");

            for (const className of classesToCheck) {
                findAndClickByClass(className);
                const element = document.querySelector(`.${className}`);
                if (element && element.textContent === "Mostrar resumo") {
                    sendToast("🎉┃Exercício finalizado!", 3000);
                }
            }
        }
        await delay(featureConfigs.autoAnswerDelay * 750);  // Atraso para repetir o processo
    }
})();
