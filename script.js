const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatBox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY = "That's a secret!";
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;    return chatLi;
}

const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{role: "user", content: userMessage}]
        })
    }

    //get GPT's response
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content;
    }).catch((error) => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    }).finally(() => chatBox.scrollTo(0, chatBox.scrollHeight));
}

//update chat/submit text
const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value = "";
    //reset height of input box
    chatInput.style.height = `${inputInitHeight}px`;

    chatBox.appendChild(createChatLi(userMessage, "outgoing"));
    chatBox.scrollTo(0, chatBox.scrollHeight);
    

    setTimeout(() => {
        //display Thinking... while waiting for response
        const incomingChatLi = createChatLi("Thinking...", "incoming")
        chatBox.appendChild(incomingChatLi);
        chatBox.scrollTo(0, chatBox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

//Adjust input box height depending on content
chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

// If Enter key is pressed without Shift & the window
// width is greater than 800px, handle the chat 
chatInput.addEventListener("keydown", (e) => {
    console.log("Key pressed:", e.key);
    if(e.key === 'Enter' && !e.shiftKey && window.innerWidth > 800){
        e.preventDefault();
        handleChat();
    }
});

//Close buttons
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));

sendChatBtn.addEventListener("click", handleChat);
