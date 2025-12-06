// =========================
// AI CHAT WIDGET (PREMIUM)
// =========================

// Load widget only once
if (!window.__aiWidgetLoaded) {
  window.__aiWidgetLoaded = true;

  // Insert styles dynamically
  const style = document.createElement("style");
  style.innerHTML = `
    #ai-chat-bubble {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      background: #4a90e2;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-size: 30px;
      cursor: pointer;
      box-shadow: 0 6px 20px rgba(0,0,0,0.2);
      transition: transform 0.2s ease;
      z-index: 999999;
    }

    #ai-chat-bubble:hover {
      transform: scale(1.05);
    }

    #ai-chat-window {
      position: fixed;
      bottom: 100px;
      right: 20px;
      width: 350px;
      height: 500px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.15);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      opacity: 0;
      transform: translateY(20px);
      pointer-events: none;
      transition: all 0.3s ease;
      z-index: 999999;
    }

    #ai-chat-window.open {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0);
    }

    #ai-chat-header {
      padding: 16px;
      background: #4a90e2;
      color: white;
      font-size: 18px;
      font-weight: bold;
    }

    #ai-chat-messages {
      flex: 1;
      padding: 12px;
      overflow-y: auto;
      font-size: 14px;
    }

    .ai-msg, .user-msg {
      margin-bottom: 10px;
      padding: 10px 14px;
      border-radius: 12px;
      max-width: 80%;
      line-height: 1.4;
    }

    .user-msg {
      background: #d1e8ff;
      margin-left: auto;
    }

    .ai-msg {
      background: #f1f1f1;
      margin-right: auto;
    }

    #ai-chat-input-area {
      padding: 10px;
      border-top: 1px solid #eee;
      display: flex;
    }

    #ai-chat-input {
      flex: 1;
      padding: 10px;
      border-radius: 10px;
      border: 1px solid #ccc;
    }

    #ai-chat-send {
      margin-left: 10px;
      padding: 10px 14px;
      background: #4a90e2;
      color: white;
      border: none;
      border-radius: 10px;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);

  // Create bubble
  const bubble = document.createElement("div");
  bubble.id = "ai-chat-bubble";
  bubble.innerHTML = "💬";
  document.body.appendChild(bubble);

  // Create chat window
  const chat = document.createElement("div");
  chat.id = "ai-chat-window";
  chat.innerHTML = `
    <div id="ai-chat-header">Chat With Us</div>
    <div id="ai-chat-messages"></div>
    <div id="ai-chat-input-area">
      <input id="ai-chat-input" placeholder="Type your message..." />
      <button id="ai-chat-send">Send</button>
    </div>
  `;
  document.body.appendChild(chat);

  // Bubble click opens/closes widget
  bubble.onclick = () => {
    chat.classList.toggle("open");
  };

  const messagesDiv = document.getElementById("ai-chat-messages");
  const input = document.getElementById("ai-chat-input");
  const sendBtn = document.getElementById("ai-chat-send");

  // Settings
  const businessId = document.currentScript.getAttribute("data-business");
  const backendURL = "https://nodejs-production-866a.up.railway.app/api/message";

  // Send message
  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    // Show user message
    const userDiv = document.createElement("div");
    userDiv.className = "user-msg";
    userDiv.textContent = text;
    messagesDiv.appendChild(userDiv);
    input.value = "";

    // Send to backend
    const res = await fetch(backendURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        business_id: Number(businessId),
        message: text
      }),
    });

    const data = await res.json();

    // Show AI reply
    const aiDiv = document.createElement("div");
    aiDiv.className = "ai-msg";
    aiDiv.textContent = data.reply;
    messagesDiv.appendChild(aiDiv);

    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  sendBtn.onclick = sendMessage;
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });
}
