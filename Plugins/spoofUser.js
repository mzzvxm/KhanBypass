plppdo.on('domChanged', () => {
    if (!device.apple) {
        const avatarElement = document.querySelector('.avatar-pic');
        const nameElement = document.querySelector('.user-deets.editable h2');
        if (nameElement) nameElement.textContent = featureConfigs.customUsername || user.nickname;
        if (featureConfigs.customPfp && avatarElement) {
            Object.assign(avatarElement, { src: featureConfigs.customPfp, alt: "Imagem não encontrada" });
            avatarElement.style.borderRadius = "50%";
        }
    }
});
