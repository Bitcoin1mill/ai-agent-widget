// =============================
// CONFIG (EDIT THESE 2 LINES)
// =============================
const BACKEND_URL = "https://YOUR-RAILWAY-URL-HERE"; // no trailing slash
const BUSINESS_ID = 1;

// =============================
// WIDGET UI (Intercom-ish)
// =============================
(function () {
  if (window.__REVIVAL_WIDGET_LOADED__) return;
  window.__REVIVAL_WIDGET_LOADED__ = true;

  const styles = document.createElement("style");
  styles.innerHTML = `
  #revival-launcher {
    position: fixed; right: 20px; bottom: 20px; width: 56px; height: 56px;
    border-radius: 999px; border: 0; cursor: pointer;
    background: #2f6bff; color: #fff; box-shadow: 0 12px 30px rgba(0,0,0,.35);
    display:flex; align-items:center; justify-content:center;
    font-size: 22px;
    z-index: 999999;
  }

  #revival-widget {
    position: fixed; right: 20px; bottom: 90px;
    width: 360px; height: 520px; border-radius: 18px;
    background: #0f0f10; border: 1px solid #202025;
    box-shadow: 0 18px 50px rgba(0,0,0,.5);
    overflow: hidden; display: none; z-index: 999999;
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
  }

  #revival-header {
    height: 64px; padding: 12px 12px 10px 12px;
    display:flex; align-items:center; justify-content:space-between;
    border-bottom: 1px solid #202025;
    background: linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,0));
  }

  #revival-brand {
    display:flex; align-items:center; gap: 10px;
    color:#fff;
  }

  #revival-logo {
    width: 34px; height: 34px; border-radius: 10px;
    background: #141416; border:1px solid #2b2b31;
    display:flex; align-items:center; justify-content:center;
    font-weight: 700; font-size: 14px; color:#fff;
  }

  #revival-title { line-height: 1.05; }
  #revival-title .name { font-size: 14px; font-weight: 700; }
  #revival-title .status {
    font-size: 12.6px; opacity: .85; margin-top: 2px;
    display:flex; align-items:center; gap:6px;
  }
  .revival-dot { width: 8px; height: 8px; border-radius: 999px; background: #23c552; display:inline-block; }

  #revival-actions { display:flex; gap: 8px; }
  .revival-iconbtn {
    width: 34px; height: 34px; border-radius: 10px;
    background:#141416; border:1px solid #2b2b31; color:#d7d7de;
    cursor:pointer; display:flex; align-items:center; justify-content:center;
    font-size: 16px;
  }
  .revival-iconbtn:hover { filter: brightness(1.08); }

  #revival-messages {
    height: calc(520px - 64px - 64px);
    padding: 12px;
    overflow: auto;
  }

  .msgrow { display:flex; margin: 10px 0; }
  .msgrow.bot { justify-content:flex-start; }
  .msgrow.user { justify-content:flex-end; }

  .bubble {
    max-width: 78%;
    padding: 10px 12px;
    border-radius: 14px;
    font-size: 13px;
    line-height: 1.25;
    white-space: pre-wrap;
  }

  .bubble.bot {
    background: #17171a;
    border: 1px solid #26262c;
    color: #f1f1f4;
    border-top-left-radius: 10px;
  }

  .bubble.user {
    background: #2f6bff;
    color: #fff;
    border: 1px solid rgba(255,255,255,.12);
    border-top-right-radius: 10px;
  }

  #revival-inputbar {
    height: 64px;
    border-top: 1px solid #202025;
    display:flex; gap:10px; align-items:center;
    padding: 10px;
    background: #0f0f10;
  }

  #revival-input {
    flex:1;
    background:#141416;
    border: 1px solid #2b2b31;
    border-radius: 14px;
    padding: 12px;
    color:#fff;
    font-size: 13px;
    outline: none;
  }

  #revival-send {
    width: 44px; height: 44px; border-radius: 14px;
    border: 0; cursor:pointer;
    background:#2f6bff; color:#fff;
    display:flex; align-items:center; justify-content:center;
    font-size: 16px; font-weight: 700;
  }

  .revival-formcard {
    margin: 10px 0;
    padding: 10px;
    border-radius: 14px;
    background:#141416;
    border: 1px solid #26262c;
    color:#fff;
  }
  .revival-formcard .label {
    font-size: 12.6px; opacity:.9; margin-bottom: 8px;
  }
  .revival-formcard input {
    width: 100%;
    padding: 10px;
    margin: 6px 0;
    border-radius: 12px;
    border: 1px solid #2b2b31;
    background:#0f0f10;
    color:#fff;
    font-size: 13px;
    outline:none;
  }
  .revival-formcard button {
    width: 100%;
    padding: 10px;
    margin-top: 8px;
    border-radius: 12px;
    border: 0;
    background:#2f6bff;
    color:#fff;
    font-weight: 700;
    cursor:pointer;
  }
  .revival-err {
    margin-top: 8px; font-size: 12px;
    color:#ff6b6b; display:none;
  }
  `;
  document.head.appendChild(styles);

  // Launcher (chat bubble icon)
  const launcher = document.createElement("button");
  launcher.id = "revival-launcher";
  launcher.innerHTML = "💬";
  document.body.appendChild(launcher);

  const widget = document.createElement("div");
  widget.id = "revival-widget";
  widget.innerHTML = `
    <div id="revival-header">
      <div id="revival-brand">
        <div id="revival-logo">R</div>
        <div id="revival-title">
          <div class="name">Revival Med Spa</div>
          <div class="status"><span class="revival-dot"></span><span>Assistant</span></div>
        </div>
      </div>
      <div id="revival-actions">
        <button class="revival-iconbtn" id="revival-close" title="Close">✕</button>
      </div>
    </div>

    <div id="revival-messages"></div>

    <div id="revival-inputbar">
      <input id="revival-input" placeholder="Ask a question..." />
      <button id="revival-send">➤</button>
    </div>
  `;
  document.body.appendChild(widget);

  const closeBtn = widget.querySelector("#revival-close");
  const messagesEl = widget.querySelector("#revival-messages");
  const inputEl = widget.querySelector("#revival-input");
  const sendBtn = widget.querySelector("#revival-send");

  function addMessage(role, text) {
    const row = document.createElement("div");
    row.className = `msgrow ${role}`;
    const bubble = document.createElement("div");
    bubble.className = `bubble ${role}`;
    bubble.textContent = text;
    row.appendChild(bubble);
    messagesEl.appendChild(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function showLeadForm(leadId) {
    // avoid showing multiple times
    if (localStorage.getItem("lead_submitted_" + leadId)) return;

    const card = document.createElement("div");
    card.className = "revival-formcard";
    card.innerHTML = `
      <div class="label">Want the team to reach out and confirm details?</div>
      <input id="lead_name" placeholder="Name" />
      <input id="lead_phone" placeholder="Phone (best)" />
      <input id="lead_email" placeholder="Email (optional)" />
      <button id="lead_submit">Send</button>
      <div class="revival-err" id="lead_err"></div>
    `;

    messagesEl.appendChild(card);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    const err = card.querySelector("#lead_err");
    card.querySelector("#lead_submit").onclick = async () => {
      const name = card.querySelector("#lead_name").value.trim();
      const phone = card.querySelector("#lead_phone").value.trim();
      const email = card.querySelector("#lead_email").value.trim();

      if (!name || !phone) {
        err.style.display = "block";
        err.textContent = "Please enter name + phone.";
        return;
      }

      const r = await fetch(`${BACKEND_URL}/api/lead/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: leadId, name, phone, email }),
      });

      if (!r.ok) {
        err.style.display = "block";
        err.textContent = "Couldn’t save—please try again.";
        return;
      }

      localStorage.setItem("lead_submitted_" + leadId, "1");
      card.innerHTML = `✅ Got it — the team will reach out shortly.`;
      card.style.fontSize = "13px";
    };
  }

  async function sendMessage() {
    const msg = inputEl.value.trim();
    if (!msg) return;

    addMessage("user", msg);
    inputEl.value = "";

    try {
      const r = await fetch(`${BACKEND_URL}/api/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_id: BUSINESS_ID, message: msg }),
      });

      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Request failed");

      addMessage("bot", data.reply || "How can I help today?");

      // ✅ Step 7: show form only when backend flags it
      if (data.capture_lead && data.lead_id) {
        showLeadForm(data.lead_id);
      }
    } catch (e) {
      addMessage("bot", "Sorry, something went wrong.");
      console.error(e);
    }
  }

  launcher.onclick = () => {
    widget.style.display = widget.style.display === "none" ? "block" : "none";
    if (widget.style.display === "block" && messagesEl.childElementCount === 0) {
      addMessage("bot", "Hi there, how can I help today?");
    }
  };

  closeBtn.onclick = () => (widget.style.display = "none");
  sendBtn.onclick = sendMessage;
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });
})();
