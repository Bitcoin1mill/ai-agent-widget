(function () {
  if (window.__revivalWidgetLoaded) return;
  window.__revivalWidgetLoaded = true;

  const BACKEND_URL = "https://nodejs-production-866a.up.railway.app/api/message";
  const BUSINESS_ID = 1;

  const LOGO_URL =
    "https://raw.githubusercontent.com/Bitcoin1mill/ai-agent-widget/main/pineapple.png";

  /* ---------------- STYLES ---------------- */
  const style = document.createElement("style");
  style.innerHTML = `
  #revival-launcher {
    position: fixed;
    bottom: 22px;
    right: 22px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #111;
    border: 1px solid #222;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 999999;
  }

  #revival-chat {
    position: fixed;
    bottom: 96px;
    right: 22px;
    width: 380px;
    height: 560px;
    background: #0f0f10;
    border-radius: 20px;
    box-shadow: 0 18px 40px rgba(0,0,0,.5);
    border: 1px solid #222;
    display: none;
    flex-direction: column;
    overflow: hidden;
    z-index: 999999;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
  }

  #revival-header {
    padding: 14px;
    border-bottom: 1px solid #222;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  #revival-logo {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #2a2a2a;
  }

  #revival-title {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
  }

  #revival-status {
    font-size: 11px;
    color: #a3a3a3;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .dot {
    width: 7px;
    height: 7px;
    background: #22c55e;
    border-radius: 50%;
  }

  #revival-body {
    flex: 1;
    padding: 14px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .msg {
    max-width: 80%;
    padding: 10px 13px;
    border-radius: 16px;
    font-size: 14px;
    line-height: 1.35;
  }

  .ai {
    background: #171717;
    color: #e5e5e5;
    align-self: flex-start;
    border: 1px solid #222;
  }

  .user {
    background: #3b82f6;
    color: #fff;
    align-self: flex-end;
  }

  #revival-input {
    padding: 12px;
    border-top: 1px solid #222;
    display: flex;
    gap: 10px;
  }

  #revival-text {
    flex: 1;
    padding: 10px 12px;
    border-radius: 14px;
    border: 1px solid #2a2a2a;
    background: #141415;
    color: #eee;
    outline: none;
  }

  #revival-send {
    width: 42px;
    height: 42px;
    background: #3b82f6;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  `;
  document.head.appendChild(style);

  /* ---------------- HTML ---------------- */
  const launcher = document.createElement("div");
  launcher.id = "revival-launcher";
  launcher.innerHTML = `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M4 5h16v10a3 3 0 0 1-3 3H8l-4 3V5z"
        stroke="white" stroke-width="1.6" stroke-linejoin="round"/>
    </svg>
  `;
  document.body.appendChild(launcher);

  const chat = document.createElement("div");
  chat.id = "revival-chat";
  chat.innerHTML = `
    <div id="revival-header">
      <img id="revival-logo" src="${LOGO_URL}">
      <div>
        <div id="revival-title">Revival Med Spa</div>
        <div id="revival-status">
  <span class="dot"></span>
  Assistant
</div>
      </div>
    </div>

    <div id="revival-body"></div>

    <div id="revival-input">
      <input id="revival-text" placeholder="Ask a question..." />
      <div id="revival-send">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M4 12h14M12 6l6 6-6 6"
            stroke="white" stroke-width="1.6"
            stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
  `;
  document.body.appendChild(chat);

  const body = chat.querySelector("#revival-body");
  const input = chat.querySelector("#revival-text");

  function addMsg(text, who) {
    const d = document.createElement("div");
    d.className = `msg ${who}`;
    d.textContent = text;
    body.appendChild(d);
    body.scrollTop = body.scrollHeight;
  }

  addMsg(
    "Hi! I'm the Revival Med Spa assistant. Ask me about services, hours, pricing, or booking.",
    "ai"
  );

  async function send() {
    const text = input.value.trim();
    if (!text) return;
    addMsg(text, "user");
    input.value = "";

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_id: BUSINESS_ID, message: text }),
      });
      const data = await res.json();
      addMsg(data.reply || "I'm here to help.", "ai");
    } catch {
      addMsg("Sorry, something went wrong.", "ai");
    }
  }

  launcher.onclick = () => {
    chat.style.display = chat.style.display === "flex" ? "none" : "flex";
    input.focus();
  };

  chat.querySelector("#revival-send").onclick = send;
  input.addEventListener("keydown", e => e.key === "Enter" && send());
})();

