// =======================
// AI CHAT WIDGET (FIN STYLE v2)
// =======================

(function () {
  // Prevent double-load
  if (window.__aiWidgetLoadedV2) return;
  window.__aiWidgetLoadedV2 = true;

  // ---- CONFIG (safe defaults) ----
  const BACKEND_URL = "https://nodejs-production-866a.up.railway.app/api/message";

  // Pull config from the script tag that loaded this file
  const scriptEl = document.currentScript;
  const businessId = Number(scriptEl?.getAttribute("data-business") || "1");

  const headerTitle = scriptEl?.getAttribute("data-title") || "Revival Med Spa";
  const headerSubtitle = scriptEl?.getAttribute("data-subtitle") || "Assistant";

  // Storage key per business so each site has its own chat history
  const STORAGE_KEY = `ai_widget_history_biz_${businessId}`;

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
      font-size: 26px;
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
      padding: 14px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    #ai-header-left {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }
    #ai-header-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #1a1a1b;
      border: 1px solid #2a2a2a;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      color: #eaeaea;
      flex: 0 0 auto;
    }
    #ai-header-text {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    #ai-header-text .title {
      font-size: 14px;
      font-weight: 650;
      color: #fff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #ai-header-text .subtitle {
      font-size: 12px;
      color: #a9a9aa;
      margin-top: 1px;
      display: flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .ai-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #22c55e;
      box-shadow: 0 0 0 2px rgba(34,197,94,0.15);
      flex: 0 0 auto;
    }
    #ai-header-actions {
      display: flex;
      gap: 8px;
      flex: 0 0 auto;
    }
    .ai-icon-btn {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      background: #161617;
      border: 1px solid #262626;
      color: #e6e6e6;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      user-select: none;
      transition: 0.15s ease;
      font-size: 16px;
    }
    .ai-icon-btn:hover { background: #1c1c1d; }

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
      word-wrap: break-word;
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
    .meta {
      font-size: 11px;
      color: #8d8d8e;
      margin-top: -6px;
      align-self: flex-start;
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
    #ai-input::placeholder { color: #8b8b8c; }
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
      font-size: 18px;
      user-select: none;
      flex: 0 0 auto;
    }
    #ai-send:hover { background: #2563eb; }

    /* typing dots inside a message bubble */
    .typingDot {
      display: inline-block;
      width: 7px;
      height: 7px;
      margin: 0 2px;
      background: #7a7a7b;
      border-radius: 50%;
      animation: blink 1.4s infinite both;
    }
    .typingDot:nth-child(2) { animation-delay: 0.2s; }
    .typingDot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes blink { 0%{opacity:.2} 20%{opacity:1} 100%{opacity:.2} }

    /* mobile */
    @media (max-width: 420px) {
      #ai-widget-window {
        right: 12px;
        left: 12px;
        width: auto;
        bottom: 92px;
      }
      #ai-widget-btn { right: 16px; bottom: 16px; }
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
      <div id="ai-header-left">
        <div id="ai-header-avatar">🍍</div>
        <div id="ai-header-text">
          <div class="title">${escapeHtml(headerTitle)}</div>
          <div class="subtitle"><span class="ai-dot"></span> Online now • ${escapeHtml(headerSubtitle)}</div>
        </div>
      </div>
      <div id="ai-header-actions">
        <div class="ai-icon-btn" id="ai-clear" title="Clear">🧹</div>
        <div class="ai-icon-btn" id="ai-close" title="Close">✕</div>
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

  // ---- Helpers ----
  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function addMessage(text, sender = "ai", meta = "") {
    const msg = document.createElement("div");
    msg.className = `msg ${sender}`;
    msg.textContent = text;

    bodyEl().appendChild(msg);

    if (meta) {
      const m = document.createElement("div");
      m.className = "meta";
      m.textContent = meta;
      bodyEl().appendChild(m);
    }

    msg.scrollIntoView({ behavior: "smooth", block: "end" });
    persistHistory();
  }

  function showTyping() {
    const wrap = document.createElement("div");
    wrap.className = "msg ai";
    wrap.id = "ai-typing";
    wrap.innerHTML = `
      <span class="typingDot"></span>
      <span class="typingDot"></span>
      <span class="typingDot"></span>
    `;
    bodyEl().appendChild(wrap);
    wrap.scrollIntoView({ behavior: "smooth", block: "end" });
  }

  function hideTyping() {
    const t = document.querySelector("#ai-typing");
    if (t) t.remove();
  }

  function persistHistory() {
    // Store only message bubbles (not typing)
    const nodes = Array.from(bodyEl().querySelectorAll(".msg"));
    const history = nodes
      .filter(n => n.id !== "ai-typing")
      .map(n => ({
        sender: n.classList.contains("user") ? "user" : "ai",
        text: n.textContent
      }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }

  function loadHistory() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    try {
      const history = JSON.parse(raw);
      if (!Array.isArray(history) || history.length === 0) return false;
      history.forEach(h => addMessage(h.text, h.sender));
      return true;
    } catch {
      return false;
    }
  }

  function clearHistory() {
    localStorage.removeItem(STORAGE_KEY);
    bodyEl().innerHTML = "";
    showWelcome();
  }

  function showWelcome() {
    addMessage(
      `Hi! I’m the ${headerTitle} assistant. Ask me about services, hours, pricing, or booking.`,
      "ai"
    );
  }

  // ---- Toggle open/close ----
  btn.onclick = () => {
    win.classList.toggle("open");
    if (win.classList.contains("open")) {
      // focus input when opened
      setTimeout(() => inputEl().focus(), 150);
    }
  };

  document.querySelector("#ai-close").onclick = () => {
    win.classList.remove("open");
  };

  document.querySelector("#ai-clear").onclick = () => {
    clearHistory();
  };

  // ---- Main send ----
  async function sendMessage() {
    const text = inputEl().value.trim();
    if (!text) return;

    addMessage(text, "user");
    inputEl().value = "";

    showTyping();

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: businessId,
          message: text
        }),
      });

      const data = await res.json();
      hideTyping();

      if (!res.ok) {
        addMessage(`Error: ${data?.error || "Request failed"}`, "ai");
        return;
      }

      addMessage(data.reply || "I’m here to help!", "ai");
    } catch (e) {
      hideTyping();
      addMessage("Network error. Please try again.", "ai");
    }
  }

  document.querySelector("#ai-send").onclick = sendMessage;

  inputEl().addEventListener("keydown", (e) => {
    // Enter sends; Shift+Enter would normally add newline, but this is an input (single line).
    if (e.key === "Enter") sendMessage();
  });

  // ---- Init ----
  const hadHistory = loadHistory();
  if (!hadHistory) showWelcome();

})();
