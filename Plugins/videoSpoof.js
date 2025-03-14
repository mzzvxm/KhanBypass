const nativeFetch = window.fetch;

window.fetch = async function (input, init) {
    let reqBody;
    if (input instanceof Request) reqBody = await input.clone().text();
    else if (init?.body) reqBody = init.body;

    if (features.videoSpoof && reqBody?.includes('"operationName":"updateUserVideoProgress"')) {
        try {
            let parsedBody = JSON.parse(reqBody);
            if (parsedBody.variables?.input) {
                let videoDuration = parsedBody.variables.input.durationSeconds;
                parsedBody.variables.input.secondsWatched = videoDuration;
                parsedBody.variables.input.lastSecondWatched = videoDuration;
                reqBody = JSON.stringify(parsedBody);
                if (input instanceof Request) input = new Request(input, { body: reqBody });
                else init.body = reqBody;
            }
        } catch (error) { console.error(`⚠️ Erro no videoSpoof.js: ${error}`); }
    }
    return nativeFetch.apply(this, arguments);
};