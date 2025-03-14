const classSelectors = ["_19uopuu", "_ssxvf9l", "_1r8cd7xe", "_1yok8f4", "_4i5p5ae", "_s6zfc1u"];
khanwareDominates = true;

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
        await delay(featureConfigs.autoAnswerDelay * 750);
    }
})();