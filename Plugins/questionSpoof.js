const originalFetch = window.fetch;

window.fetch = async function (input, init) {
    let requestBody;
    if (input instanceof Request) requestBody = await input.clone().text();
    else if (init?.body) requestBody = init.body;

    const response = await originalFetch.apply(this, arguments);
    const clonedResponse = response.clone();

    try {
        const responseText = await clonedResponse.text();
        let responseData = JSON.parse(responseText);
        if (features.questionSpoof && responseData?.data?.assessmentItem?.item?.itemData) {
            let questionData = JSON.parse(responseData.data.assessmentItem.item.itemData);
            if (questionData.question.content[0] === questionData.question.content[0].toUpperCase()) {
                questionData.answerArea = { "calculator": false, "chi2Table": false, "periodicTable": false, "tTable": false, "zTable": false };
                questionData.question.content = " " + `[[☃ radio 1]]`;
                questionData.question.widgets = { "radio 1": { options: { choices: [ { content: "✅┃khanbypass by @mzzvxm!", correct: true } ] } } };
                responseData.data.assessmentItem.item.itemData = JSON.stringify(questionData);
                return new Response(JSON.stringify(responseData), { status: response.status, statusText: response.statusText, headers: response.headers });
            }
        }
    } catch (error) { console.error(`⚠️ Erro no questionSpoof.js: ${error}`); }
    return response;
};