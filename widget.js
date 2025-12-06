// =======================
// AI CHAT WIDGET (FIN STYLE)
// =======================

// Inject styles
const style = document.createElement("style");
style.innerHTML = `
  #ai-widget-btn {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 58px;
    height: 58px;
    border-radius: 50%;
    background: #111;
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    border: 1px solid #222;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 9999999;
    transition: 0.2s ease;
  }
  
  #ai-widget-btn:hover {
    transform: scale(1.05);
  }

  #ai-widget-window {
    position: fixed;
    bottom: 100px;
    right: 24px;
    width: 380px;
    height: 560px;
    background: #111;
    border-radius: 20px;
    box-shadow: 0 12px 34px rgba(0,0,0,0.45);
    border: 1px solid #222;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transform: translateY(40px);
    opacity: 0;
    pointer-events: none;
    transition: 0.25s ease;
    z-index: 9999999;
  }

  #ai-widget-window.open {
    opacity: 1;
    pointer-events: all;
    transform: translateY(0);
  }

  /* HEADER */
  #ai-header {
    background: rgba(255,255,255,0.02);
    border-bottom: 1px solid #222;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    gap: 14px;
  }

  #ai-header img {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #333;
  }

  #ai-header-text {
    display: flex;
    flex-direction: column;
  }

  #ai-header-text .title {
    font-size: 15px;
    font-weight: 600;
    color: #fff;
  }

  #ai-header-text .subtitle {
    font-size: 12px;
    color: #aaa;
    margin-top: -2px;
  }

  /* CHAT BODY */
  #ai-body {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .msg {
    max-width: 80%;
    padding: 12px 14px;
    border-radius: 16px;
    font-size: 14px;
    line-height: 1.35em;
  }

  .msg.ai {
    background: #1c1c1c;
    color: #eaeaea;
    align-self: flex-start;
    border: 1px solid #222;
  }

  .msg.user {
    background: #3b82f6;
    color: #fff;
    align-self: flex-end;
  }

  /* INPUT AREA */
  #ai-input-area {
    border-top: 1px solid #222;
    padding: 12px;
    display: flex;
    gap: 10px;
    background: #0e0e0e;
  }

  #ai-input {
    flex: 1;
    padding: 10px 14px;
    background: #1a1a1a;
    border-radius: 14px;
    border: 1px solid #333;
    color: #eee;
    font-size: 14px;
  }

  #ai-send {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: #3b82f6;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  #ai-send:hover {
    background: #2563eb;
  }

  /* TYPING DOTS */
  .typing {
    display: inline-block;
    width: 8px;
    height: 8px;
    margin: 0 2px;
    background: #777;
    border-radius: 50%;
    animation: blink 1.4s infinite both;
  }

  .typing:nth-child(2) { animation-delay: 0.2s; }
  .typing:nth-child(3) { animation-delay: 0.4s; }

  @keyframes blink {
    0% { opacity: .2; }
    20% { opacity: 1; }
    100% { opacity: .2; }
  }

`;
document.head.appendChild(style);


// =======================
// BUILD THE WIDGET
// =======================

// Button
const btn = document.createElement("div");
btn.id = "ai-widget-btn";
btn.innerHTML = "💬";
document.body.appendChild(btn);

// Window
const win = document.createElement("div");
win.id = "ai-widget-window";
win.innerHTML = `
  <div id="ai-header">
    <img src="https://ai-agent-widget.pages.dev/pineapple-logo.png" alt="Logo" />
    <div id="ai-header-text">
      <div class="title">Revival Med Spa</div>
      <div class="subtitle">Assistant</div>
    </div>
  </div>

  <div id="ai-body"></div>

  <div id="ai-input-area">
    <input id="ai-input" placeholder="Ask a question..." />
    <div id="ai-send">➤</div>
  </div>
`;
document.body.appendChild(win);


// Toggle open/close
btn.onclick = () => {
  win.classList.toggle("open");
};

// Add message to chat
function addMessage(text, sender = "ai") {
  const msg = document.createElement("div");
  msg.className = `msg ${sender}`;
  msg.textContent = text;
  document.querySelector("#ai-body").appendChild(msg);
  msg.scrollIntoView({ behavior: "smooth" });
}

// Typing indicator
function showTyping() {
  const wrap = document.createElement("div");
  wrap.className = "msg ai";
  wrap.id = "ai-typing";
  wrap.innerHTML = `
    <span class="typing"></span>
    <span class="typing"></span>
    <span class="typing"></span>
  `;
  document.querySelector("#ai-body").appendChild(wrap);
  wrap.scrollIntoView({ behavior: "smooth" });
}

function hideTyping() {
  const t = document.querySelector("#ai-typing");
  if (t) t.remove();
}


// =======================
// SEND MESSAGE TO BACKEND
// =======================

async function sendMessage() {
  const input = document.querySelector("#ai-input");
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  showTyping();

  try {
    const response = await fetch("YOUR_BACKEND_URL/api/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        business_id: 1,
        message: text
      }),
    });

    const data = await response.json();
    hideTyping();
    addMessage(data.reply, "ai");

  } catch (e) {
    hideTyping();
    addMessage("Sorry, something went wrong.", "ai");
  }
}

document.querySelector("#ai-send").onclick = sendMessage;
document.querySelector("#ai-input").onkeydown = (e) => {
  if (e.key === "Enter") sendMessage();
};
