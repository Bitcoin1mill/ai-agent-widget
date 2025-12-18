// =============================
// CONFIG (EDIT THESE 2 LINES)
// =============================
const BACKEND_URL = nodejs-production-866a.up.railway.app; // no trailing slash
const BUSINESS_ID = 1;

(function () {
  if (window.__REVIVAL_WIDGET_LOADED__) return;
  window.__REVIVAL_WIDGET_LOADED__ = true;

  // ---------- Styles (high specificity + !important to avoid site CSS conflicts)
  const styles = document.createElement("style");
  styles.innerHTML = `
  #revival-launcher {
    position: fixed !important;
    right: 20px !important;
    bottom: 20px !important;
    width: 56px !important;
    height: 56px !important;
    border-radius: 999px !important;
    border: 0 !important;
    cursor: pointer !important;
    background: #2f6bff !important;
    color: #fff !important;
    box-shadow: 0 12px 30px rgba(0,0,0,.35) !important;
    display:flex !important;
    align-items:center !important;
    justify-content:center !important;
    font-size: 16px !important;
    z-index: 2147483647 !important;
  }

  #revival-widget {
    position: fixed !important;
    right: 20px !important;
    bottom: 90px !important;
    width: 360px !important;
    height: 520px !important;
    border-radius: 18px !important;
    background: #0f0f10 !important;
    border: 1px solid #202025 !important;
    box-shadow: 0 18px 50px rgba(0,0,0,.5) !important;
    overflow: hidden !important;
    display: none !important;
    z-index: 2147483647 !important;
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial !important;
  }

  #revival-header {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    height: 64px !important;
    padding: 12px 12px 10px 12px !important;
    display:flex !important;
    align-items:center !important;
    justify-content:space-between !important;
    border-bottom: 1px solid #202025 !important;
    background: rgba(255,255,255,.02) !important;
  }

  #revival-brand { display:flex !important; align-items:center !important; gap:10px !important; color:#fff !important; }
  #revival-logo {
    width: 34px !important;
    height: 34px !important;
    border-radius: 10px !important;
    background: #141416 !important;
    border:1px solid #2b2b31 !important;
    display:flex !important;
    align-items:center !important;
    justify-content:center !important;
    font-weight: 800 !important;
    font-size: 14px !important;
    color:#fff !important;
  }
  #revival-title { line-height: 1.05 !important; }
  #revival-title .name { font-size: 14px !important; font-weight: 800 !important; }
  #revival-title .status { font-size: 12px !important; opacity: .85 !important; margin-top: 2px !important; }

  #revival-actions { display:flex !important; gap:8px !important; }
  .revival-iconbtn {
    width: 34px !important;
    height: 34px !important;
    border-radius: 10px !important;
    background:#141416 !important;
    border:1px solid #2b2b31 !important;
    color:#d7d7de !important;
    cursor:pointer !important;
    display:flex !important;
    align-items:center !important;
    justify-content:center !important;
    font-size: 14px !important;
  }

  #revival-messages {
    position: absolute !important;
    top: 64px !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 64px !important; /* leaves room for input bar */
    padding: 12px !important;
    overflow: auto !important;
  }

  .msgrow { display:flex !important; margin: 10px 0 !important; }
  .msgrow.bot { justify-content:flex-start !important; }
  .msgrow.user { justify-content:flex-end !important; }

  .bubble {
    max-width: 78% !important;
    padding: 10px 12px !important;
    border-radius: 14px !important;
    font-size: 13px !important;
    line-height: 1.25 !important;
    white-space: pre-wrap !important;
  }

  .bubble.bot {
    background: #17171a !important;
    border: 1px solid #26262c !important;
    color: #f1f1f4 !important;
    border-top-left-radius: 10px !important;
  }

  .bubble.user {
    background: #2f6bff !important;
    color: #fff !important;
    border: 1px solid rgba(255,255,255,.12) !important;
    border-top-right-radius: 10px !important;
  }

  #revival-inputbar {
    position: absolute !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    height: 64px !important;
    border-top: 1px solid #202025 !important;
    display:flex !important;
    gap:10px !important;
    align-items:center !important;
    padding: 10px !important;
    background: #0f0f10 !important;
  }

  #revival-input {
    flex:1 !important;
    background:#141416 !important;
    border: 1px solid #2b2b31 !important;
    border-radius: 14px !important;
    padding: 12px !important;
    color:#fff !important;
    font-size: 13px !important;
    outline: none !important;
  }

  #revival-send {
    width: 64px !important;
    height: 44px !important;
    border-radius: 14px !important;
    border: 0 !important;
    cursor:pointer !important;
    background:#2f6bff !important;
    color:#fff !important;
    font-size: 13px !important;
    font-weight: 800 !important;
  }

  .revival-formcard {
    margin: 10px 0 !important;
    padding: 10px !important;
    border-radius: 14px !important;
    background:#141416 !important;
    border: 1px solid #26262c !important;
    color:#fff !important;
  }
  .revival-formcard .label { font-size: 12.6px !important; opacity:.9 !important; margin-bottom: 8px !important; }
  .revival-formcard input {
    width: 100% !important;
    padding: 10px !important;
    margin: 6px 0 !important;
    border-radius: 12px !important;
    border: 1px solid #2b2b31 !important;
    background:#0f0f10 !important;
    color:#fff !important;
    font-size: 13px !important;
    outline:none !important;
  }
  .revival-formcard button {
    width: 100% !important;
    padding: 10px !important;
    margin-top: 8px !important;
    border-radius: 12px !important;
    border: 0 !important;
    background:#2f6bff !important;
    color:#fff !important;
    font-weight: 800 !important;
    cursor:pointer !important;
  }
  .revival-err { margin-top: 8px !important; font-size: 12px !important; color:#ff6b6b !important; display:none !important; }
  `;
  document.head.appendChild(styles);

  // ---------- Launcher
  const launcher = document.createElement("button");
  launcher.id = "revival-launcher";
  launcher.textContent = "Chat";
  document.body.appendChild(launcher);

  // ---------- Widget container
  const widget = document.createElement("div");
  widget.id = "revival-widget";
  widget.innerHTML = `
    <div id="revival-header">
      <div id="revival-brand">
        <div id="revival-logo">R</div>
        <div id="revival-title">
          <div class="name">Revival Med Spa</div>
          <div class="status">Assistant</div>
        </div>
      </div>
      <div id="revival-actions">
        <button class="revival-iconbtn" id="revival-close" title="Close">X</button>
      </div>
    </div>

    <div id="revival-messages"></div>

    <div id="revival-inputbar">
      <input id="revival-input" placeholder="Ask a question..." />
      <button id="revival-send">Send</button>
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
    if (localStorage.getItem("lead_submitted_" + leadId)) return;

    const card = document.createElement("div");
    card.className = "revival-formcard";
    card.innerHTML = `
      <div class="label">Want the team to reach out and confirm details?</div>
      <input id="lead_name" placeholder="Name" />
      <input id="lead_phone" placeholder="Phone" />
      <input id="lead_email" placeholder="Email (optional)" />
      <button id="lead_submit">Submit</button>
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
        err.textContent = "Please enter name and phone.";
        return;
      }

      const r = await fetch(`${BACKEND_URL}/api/lead/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: leadId, name, phone, email }),
      });

      if (!r.ok) {
        err.style.display = "block";
        err.textContent = "Could not save. Try again.";
        return;
      }

      localStorage.setItem("lead_submitted_" + leadId, "1");
      card.textContent = "Saved. The team will reach out shortly.";
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

      addMessage("bot", data.reply || "Hi there, how can I help today?");

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
