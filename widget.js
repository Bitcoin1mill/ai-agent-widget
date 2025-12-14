// =======================
// AI CHAT WIDGET (FIN STYLE v2 - clean icons)
// =======================

(function () {
  if (window.__aiWidgetLoadedV2Clean) return;
  window.__aiWidgetLoadedV2Clean = true;

  const BACKEND_URL = "https://nodejs-production-866a.up.railway.app/api/message";

  const scriptEl = document.currentScript;
  const businessId = Number(scriptEl?.getAttribute("data-business") || "1");
  const headerTitle = scriptEl?.getAttribute("data-title") || "Revival Med Spa";
  const headerSubtitle = scriptEl?.getAttribute("data-subtitle") || "Assistant";

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
      background: #161617;
      border: 1px solid #2a2a2a;
      display: flex;
      align-items: center;
      justify-content: center;
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
      border: 1px solid rgba(255,255,255,0.06);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: white;
      user-select: none;
      flex: 0 0 auto;
    }
    #ai-send:hover { background: #2563eb; }

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
  btn.innerHTML = `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7.5 20.5c2.2-1.1 3.2-1.4 4.5-1.4h6c2.2 0 4-1.8 4-4V8c0-2.2-1.8-4-4-4H6C3.8 4 2 5.8 2 8v7c0 2.2 1.8 4 4 4h1.2c.3 0 .5.3.3.5l-1 1.5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>
  `;
  document.body.appendChild(btn);

  const win = document.createElement("div");
  win.id = "ai-widget-window";
  win.innerHTML = `
    <div id="ai-header">
      <div id="ai-header-left">
        <div id="ai-header-avatar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2c2 2 4 3 6 3-2 2-4 3-6 3S8 7 6 5c2 0 4-1 6-3Z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M8 10c0-2 2-4 4-4s4 2 4 4c0 5-2 12-4 12s-4-7-4-12Z" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        </div>
        <div id="ai-header-text">
          <div class="title">${escapeHtml(headerTitle)}</div>
          <div class="subtitle"><span class="ai-dot"></span> Ready to Assist - ${escapeHtml(headerSubtitle)}</div>
        </div>
      </div>
      <div id="ai-header-actions">
        <div class="ai-icon-btn" id="ai-clear" title="Clear">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 6h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M8 6l1-2h6l1 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M7 6l1 16h8l1-16" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="ai-icon-btn" id="ai-close" title="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
      </div>
    </div>

    <div id="ai-body"></div>

    <div id="ai-input-area">
      <input id="ai-input" placeholder="Ask a question..." />
      <div id="ai-send" aria-label="Send">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 12h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M12 6l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
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
    "Hi there, how can I help today?",
    "ai"
  );
}

  // Toggle open/close
  btn.onclick = () => {
    win.classList.toggle("open");
    if (win.classList.contains("open")) {
      setTimeout(() => inputEl().focus(), 150);
    }
  };

  document.querySelector("#ai-close").onclick = () => {
    win.classList.remove("open");
  };

  document.querySelector("#ai-clear").onclick = () => {
    clearHistory();
  };

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

      addMessage(data.reply || "I'm here to help!", "ai");
    } catch (e) {
      hideTyping();
      addMessage("Network error. Please try again.", "ai");
    }
  }

  document.querySelector("#ai-send").onclick = sendMessage;
  inputEl().addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  const hadHistory = loadHistory();
  if (!hadHistory) showWelcome();
})();
