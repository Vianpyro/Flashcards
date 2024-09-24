function saveApiKey(apiKey) {
    // const apiKey = document.getElementById('apiKeyInput').value;
    localStorage.setItem('openaiApiKey', apiKey);
}

// Fetch the API key and use it in the request
function askChatGPT(question) {
    const apiKey = localStorage.getItem('openaiApiKey');
    if (!apiKey) {
        alert('Please enter your OpenAI API key.');
        return;
    }

    // const question = document.getElementById('question').value;
    const apiUrl = "https://api.openai.com/v1/chat/completions";

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You write a flashcard quizz application save file in JSON with this exact format: '{'title': 'Quizz title', 'quizz': [{'question': 'A concise question', 'answer': 'A good answer'}]}' on the given subject."
                },
                { role: "user", content: question }
            ],
            max_tokens: 150
        })
    };

    console.log("Requesting ChatGPT API...");
    console.log(apiUrl, requestOptions);

    fetch(apiUrl, requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log(data.choices[0].message.content);
        })
        .catch(error => {
            console.error("Error:", error);
            console.log("Something went wrong!");
        });
}
