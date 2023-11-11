const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY'; // Replace with your API Key

function gptGenerate() {
    var msg_array = [];
    var generations = 3;
    var instruction = "Write me an parable about putting a peanut butter sandwich into a VHS player as though it were a WHS tape, and the folley  of that action in King James english prose.";
    var char_sum = instruction.length;
    var extracted_datapoints = [];
    msg_array.push({ role: "user", content: instruction });
    var tokens = Math.ceil(4096 - char_sum / 4);

    // Define API payload
    const payload = {
        model: "gpt-3.5-turbo",
        messages: msg_array,
        max_tokens: tokens,
        temperature: 1.5,
        n: generations,
        stop: ["\n"],
    };

    // Make the request to OpenAI API
    const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'; 
    fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
            Authorization: "Bearer " + OPENAI_API_KEY,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })
    .then(response => response.json())
    .then(responseData => {
        const completions = responseData.choices;
        for (var i = 0; i < completions.length; i++) {
            extracted_datapoints[i] = completions[i].message.content;
            console.log(extracted_datapoints[i]);
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

async function getEmbedding() {
    var text = "Some example text to embed, floobledy doobledy";

    var emb_url = 'https://api.openai.com/v1/embeddings';
    const upload = {
        model: "text-embedding-ada-002",
        input: text,
    };

    const response = await fetch(emb_url, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + OPENAI_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(upload)
    });

    if (response.status === 200) {
        var responseData = await response.json();
        var embedding = responseData.data[0].embedding;
        console.log(embedding);
    } else {
        console.error('Error:', response.statusText);
    }
}
