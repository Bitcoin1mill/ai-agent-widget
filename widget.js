// =======================
// AI CHAT WIDGET (FIN STYLE v2 - CLEAN FINAL)
// =======================

(function () {
  if (window.__aiWidgetLoadedFinal) return;
  window.__aiWidgetLoadedFinal = true;

  const BACKEND_URL = "https://nodejs-production-866a.up.railway.app/api/message";

  const scriptEl = document.currentScript;
  const businessId = Number(scriptEl?.getAttribute("data-business") || "1");
  const headerTitle = scriptEl?.getAttribute("data-title") || "Revival Med Spa";

  const STORAGE_KEY = `ai_widget_history_biz_${businessId}`;

  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // ---- Styles ----
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
      transition: transform 0.18s ease;
      color: white;
      user-select: none;
    }
    #ai-widget-btn:hover { transform: scale(1.05); }

    #ai-widget-window {
      position: fixed;
      bottom: 100px;
      right: 24px;
      width: 380px;
      height: 560px;
      max-height: calc(100vh - 140px);
      background: #0f0f10;
      border-radius: 20px;
      box-shadow: 0 12px 34px rgba(0,0,0,0.45);
      border: 1px solid #222;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform: translateY(28px);
      opacity: 0;
      pointer-events: none;
      transition: 0.22s ease;
      z-index: 9999999;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
    }
    #ai-widget-window.open {
      opacity: 1;
      pointer-events: all;
      transform: translateY(0);
    }

    #ai-header {
      background: rgba(255,255,255,0.02);
      border-bottom: 1px solid #222;
      padding: 14px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    #ai-header-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #161617;
      border: 1px solid #2a2a2a;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #eaeaea;
      flex-shrink: 0;
    }

    #ai-header-text {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    #ai-header-text .title {
      font-size: 14px;
      font-weight: 600;
      color: #fff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    #ai-header-text .subtitle {
      font-size: 11px; /* ~10% smaller */
      color: #a9a9aa;
      margin-top: 2px;
      display: flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
    }

    .ai-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #22c55e;
      box-shadow: 0 0 0 2px rgba(34,197,94,0.15);
    }

    #ai-body {
      flex: 1;
      overflow-y: auto;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .msg {
      max-width: 82%;
      padding: 11px 13px;
      border-radius: 16px;
      font-size: 14px;
      line-height: 1.35em;
      white-space: pre-wrap;
    }

    .msg.ai {
      background: #171718;
      color: #eaeaea;
      align-self: flex-start;
      border: 1px solid #222;
    }

    .msg.user {
      background: #3b82f6;
      color: #fff;
      align-self: flex-end;
    }

    #ai-input-area {
      border-top: 1px solid #222;
      padding: 12px;
      display: flex;
      gap: 10px;
      background: #0c0c0d;
    }

    #ai-input {
      flex: 1;
      padding: 10px 12px;
      background: #141415;
      border-radius: 14px;
      border: 1px solid #2a2a2a;
      color: #eee;
      font-size: 14px;
      outline: none;
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
      color: white;
    }
  `;
  document.head.appendChild(style);

  // ---- DOM ----
  const btn = document.createElement("div");
  btn.id = "ai-widget-btn";
  btn.innerHTML = "💬";
  document.body.appendChild(btn);

  const win = document.createElement("div");
  win.id = "ai-widget-window";
  win.innerHTML = `
    <div id="ai-header">
      <div id="ai-header-avatar">💠</div>
      <div id="ai-header-text">
        <div class="title">${escapeHtml(headerTitle)}</div>
        <div class="subtitle">
          <span class="ai-dot"></span> Online · Ready to help
        </div>
      </div>
    </div>

    <div id="ai-body"></div>

    <div id="ai-input-area">
      <input id="ai-input" placeholder="Ask a question..." />
      <div id="ai-send">➤</div>
    </div>
  `;
  document.body.appendChild(win);

  const bodyEl = () => document.querySelector("#ai-body");
  const inputEl = () => document.querySelector("#ai-input");

  function addMessage(text, sender = "ai") {
    const msg = document.createElement("div");
    msg.className = `msg ${sender}`;
    msg.textContent = text;
    bodyEl().appendChild(msg);
    msg.scrollIntoView({ behavior: "smooth", block: "end" });
    saveHistory();
  }

  function saveHistory() {
    const msgs = [...bodyEl().querySelectorAll(".msg")].map(m => ({
      sender: m.classList.contains("user") ? "user" : "ai",
      text: m.textContent
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
  }

  function loadHistory() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    JSON.parse(raw).forEach(m => addMessage(m.text, m.sender));
    return true;
  }

  function showWelcome() {
    addMessage("Hi there, how can I help today?", "ai");
  }

  async function sendMessage() {
    const text = inputEl().value.trim();
    if (!text) return;

    addMessage(text, "user");
    inputEl().value = "";

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_id: businessId, message: text }),
      });
      const data = await res.json();
      addMessage(data.reply || "I'm here to help!", "ai");
    } catch {
      addMessage("Network error. Please try again.", "ai");
    }
  }

  btn.onclick = () => win.classList.toggle("open");
  document.querySelector("#ai-send").onclick = sendMessage;
  inputEl().addEventListener("keydown", e => e.key === "Enter" && sendMessage());

  if (!loadHistory()) showWelcome();
})();
