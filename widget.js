/* Revival AI Widget - Intercom-style (stable, ASCII-only) */
console.log("[WIDGET] widget.js loaded");

if (window.__REVIVAL_WIDGET_LOADED__) {
  console.warn("[WIDGET] already loaded");
} else {
  window.__REVIVAL_WIDGET_LOADED__ = true;

  (function () {
    "use strict";

    var scriptEl = document.currentScript;

    var CONFIG = {
      backend:
        (scriptEl && scriptEl.getAttribute("data-backend")) ||
        "http://localhost:3000",
      businessId:
        (scriptEl && scriptEl.getAttribute("data-business-id")) || "1",
      title: (scriptEl && scriptEl.getAttribute("data-title")) || "AI Assistant",
      primary:
        (scriptEl && scriptEl.getAttribute("data-primary")) || "#111827",
    };

    // Basic session id (helps you track conversations per visitor)
    var sessionId = (function () {
      try {
        var k = "revival_widget_session_id";
        var v = localStorage.getItem(k);
        if (!v) {
          v = "sess_" + Math.random().toString(36).slice(2) + "_" + Date.now();
          localStorage.setItem(k, v);
        }
        return v;
      } catch (e) {
        return "sess_" + Math.random().toString(36).slice(2) + "_" + Date.now();
      }
    })();

    var state = {
      open: false,
      busy: false,
      lead_id: null,
      intent: "general",
    };

    // Root
    var root = document.createElement("div");
    root.id = "revival-widget-root";
    document.body.appendChild(root);

    // Styles (namespaced)
    var style = document.createElement("style");
    style.textContent =
      "#revival-widget-root { all: initial; }" +
      "#revival-widget-root * { box-sizing: border-box; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; }" +

      ".rw-btn {" +
      " position: fixed; right: 18px; bottom: 18px; z-index: 2147483647;" +
      " width: 56px; height: 56px; border-radius: 999px;" +
      " border: 0; cursor: pointer;" +
      " background:" + CONFIG.primary + "; color: #fff;" +
      " box-shadow: 0 10px 24px rgba(0,0,0,.22);" +
      " display:flex; align-items:center; justify-content:center;" +
      " font-weight:700; user-select:none;" +
      "}" +
      ".rw-btn:active { transform: translateY(1px); }" +

      ".rw-panel {" +
      " position: fixed; right: 18px; bottom: 86px;" +
      " width: 360px; max-width: calc(100vw - 36px);" +
      " height: 520px; max-height: calc(100vh - 120px);" +
      " z-index: 2147483647;" +
      " background:#fff;" +
      " border:1px solid rgba(0,0,0,.08);" +
      " border-radius:16px;" +
      " box-shadow:0 18px 50px rgba(0,0,0,.25);" +
      " overflow:hidden;" +
      " display:none;" +
      "}" +
      ".rw-panel.open { display:flex; flex-direction:column; }" +

      ".rw-header {" +
      " height:56px; padding:0 12px;" +
      " display:flex; align-items:center; justify-content:space-between;" +
      " border-bottom:1px solid rgba(0,0,0,.08);" +
      "}" +
      ".rw-title { font-weight:800; font-size:14px; color:#111; }" +
      ".rw-sub { font-size:12px; color:rgba(0,0,0,.55); margin-top:2px; }" +
      ".rw-close {" +
      " width:34px; height:34px; border-radius:10px;" +
      " border:1px solid rgba(0,0,0,.10);" +
      " background:#fff; cursor:pointer;" +
      "}" +
      ".rw-close:hover { background:rgba(0,0,0,.04); }" +

      ".rw-messages {" +
      " flex:1; overflow-y:auto;" +
      " padding:12px;" +
      " background:#fafafa;" +
      "}" +
      ".rw-row { display:flex; margin:8px 0; }" +
      ".rw-row.user { justify-content:flex-end; }" +
      ".rw-bubble {" +
      " max-width:82%; padding:10px 12px;" +
      " border-radius:14px;" +
      " font-size:13px; line-height:1.35;" +
      " white-space:pre-wrap; word-wrap:break-word;" +
      "}" +
      ".rw-bubble.bot {" +
      " background:#fff;" +
      " border:1px solid rgba(0,0,0,.08);" +
      " color:#111;" +
      "}" +
      ".rw-bubble.user {" +
      " background:" + CONFIG.primary + ";" +
      " color:#fff;" +
      "}" +

      ".rw-footer {" +
      " border-top:1px solid rgba(0,0,0,.08);" +
      " background:#fff;" +
      " padding:10px;" +
      "}" +
      ".rw-inputrow { display:flex; gap:8px; align-items:center; }" +
      ".rw-input {" +
      " flex:1; height:40px;" +
      " border-radius:12px;" +
      " border:1px solid rgba(0,0,0,.12);" +
      " padding:0 12px;" +
      " font-size:13px;" +
      " outline:none;" +
      "}" +
      ".rw-send {" +
      " height:40px; padding:0 12px;" +
      " border-radius:12px;" +
      " border:0; cursor:pointer;" +
      " background:" + CONFIG.primary + ";" +
      " color:#fff; font-weight:800; font-size:13px;" +
      "}" +
      ".rw-send:disabled { opacity:.6; cursor:not-allowed; }" +

      ".rw-lead {" +
      " margin-top:10px; padding:10px;" +
      " border-radius:12px;" +
      " border:1px dashed rgba(0,0,0,.20);" +
      " background:#fff; display:none;" +
      "}" +
      ".rw-lead h4 { margin:0 0 8px 0; font-size:13px; }" +
      ".rw-lead .grid { display:grid; grid-template-columns:1fr; gap:8px; }" +
      ".rw-lead input {" +
      " height:36px; border-radius:10px;" +
      " border:1px solid rgba(0,0,0,.12);" +
      " padding:0 10px; font-size:13px; outline:none;" +
      "}" +
      ".rw-lead button {" +
      " height:36px; border-radius:10px;" +
      " border:0; cursor:pointer;" +
      " background:#111; color:#fff; font-weight:800; font-size:13px;" +
      "}" +
      ".rw-note { font-size:11px; color:rgba(0,0,0,.55); margin-top:6px; }";

    document.head.appendChild(style);

    // UI
    var btn = document.createElement("button");
    btn.className = "rw-btn";
    btn.type = "button";
    btn.textContent = "Chat";

    var panel = document.createElement("div");
    panel.className = "rw-panel";

    var header = document.createElement("div");
    header.className = "rw-header";

    var titleWrap = document.createElement("div");
    var title = document.createElement("div");
    title.className = "rw-title";
    title.textContent = CONFIG.title;

    var sub = document.createElement("div");
    sub.className = "rw-sub";
    sub.textContent = "Questions, pricing, booking, and more";

    titleWrap.appendChild(title);
    titleWrap.appendChild(sub);

    var closeBtn = document.createElement("button");
    closeBtn.className = "rw-close";
    closeBtn.type = "button";
    closeBtn.textContent = "X";

    header.appendChild(titleWrap);
    header.appendChild(closeBtn);

    var messages = document.createElement("div");
    messages.className = "rw-messages";

    var footer = document.createElement("div");
    footer.className = "rw-footer";

    var inputRow = document.createElement("div");
    inputRow.className = "rw-inputrow";

    var input = document.createElement("input");
    input.className = "rw-input";
    input.placeholder = "Type your question...";
    input.setAttribute("autocomplete", "off");

    var sendBtn = document.createElement("button");
    sendBtn.className = "rw-send";
    sendBtn.type = "button";
    sendBtn.textContent = "Send";

    inputRow.appendChild(input);
    inputRow.appendChild(sendBtn);

    var leadBox = document.createElement("div");
    leadBox.className = "rw-lead";
    leadBox.innerHTML =
      '<h4>Want us to follow up?</h4>' +
      '<div class="grid">' +
      '<input id="rw_name" placeholder="Name" />' +
      '<input id="rw_phone" placeholder="Phone" />' +
      '<input id="rw_email" placeholder="Email" />' +
      '<button id="rw_submit" type="button">Submit</button>' +
      '<div class="rw-note">We only ask when you are looking for pricing, booking, or contact help.</div>' +
      "</div>";

    footer.appendChild(inputRow);
    footer.appendChild(leadBox);

    panel.appendChild(header);
    panel.appendChild(messages);
    panel.appendChild(footer);

    root.appendChild(btn);
    root.appendChild(panel);

    function setOpen(v) {
      state.open = v;
      if (v) {
        panel.classList.add("open");
        btn.textContent = "Close";
        setTimeout(function () {
          input.focus();
        }, 50);
        if (messages.childElementCount === 0) {
          addMsg("bot", "Hi! How can I help you today?");
        }
      } else {
        panel.classList.remove("open");
        btn.textContent = "Chat";
      }
    }

    function setBusy(v) {
      state.busy = v;
      sendBtn.disabled = v;
      input.disabled = v;
    }

    function addMsg(role, text) {
      var row = document.createElement("div");
      row.className = "rw-row " + (role === "user" ? "user" : "bot");

      var bubble = document.createElement("div");
      bubble.className = "rw-bubble " + (role === "user" ? "user" : "bot");
      bubble.textContent = text;

      row.appendChild(bubble);
      messages.appendChild(row);
      messages.scrollTop = messages.scrollHeight;
    }

    function showLeadBox(show) {
      leadBox.style.display = show ? "block" : "none";
      if (show) messages.scrollTop = messages.scrollHeight;
    }

    async function sendMessage() {
      var text = (input.value || "").trim();
      if (!text || state.busy) return;

      input.value = "";
      addMsg("user", text);
      setBusy(true);

      try {
        var res = await fetch(CONFIG.backend.replace(/\/$/, "") + "/api/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            business_id: CONFIG.businessId,
            session_id: sessionId,
            message: text,
          }),
        });

        var data = {};
        try {
          data = await res.json();
        } catch (e) {
          data = {};
        }

        if (!res.ok) {
          addMsg("bot", "Sorry — something went wrong. Please try again.");
          setBusy(false);
          return;
        }

        var reply =
          (data && (data.reply || data.message || data.text)) ||
          "Thanks — how can I help?";
        addMsg("bot", reply);

        // Optional lead capture fields (from your backend)
        var capture = !!(data && data.capture_lead);
        var intent = (data && data.intent) || "general";
        var lead_id = (data && data.lead_id) || null;

        state.intent = intent;
        if (lead_id) state.lead_id = lead_id;

        if (capture) showLeadBox(true);
      } catch (err) {
        console.error("[WIDGET] fetch error", err);
        addMsg("bot", "Network error — please try again.");
      } finally {
        setBusy(false);
      }
    }

    async function submitLead() {
      if (!state.lead_id) {
        addMsg("bot", "Ask a pricing/booking question first so I can attach your details.");
        return;
      }

      var name = (leadBox.querySelector("#rw_name").value || "").trim();
      var phone = (leadBox.querySelector("#rw_phone").value || "").trim();
      var email = (leadBox.querySelector("#rw_email").value || "").trim();

      if (!name && !phone && !email) {
        addMsg("bot", "Please add at least a name, phone, or email.");
        return;
      }

      try {
        setBusy(true);
        var res = await fetch(
          CONFIG.backend.replace(/\/$/, "") + "/api/lead/update",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lead_id: state.lead_id,
              name: name,
              phone: phone,
              email: email,
            }),
          }
        );

        if (!res.ok) {
          addMsg("bot", "Could not save your details — please try again.");
          setBusy(false);
          return;
        }

        showLeadBox(false);
        addMsg("bot", "Got it — we will follow up soon. Anything else?");
      } catch (err) {
        console.error("[WIDGET] lead update error", err);
        addMsg("bot", "Network error while saving — please try again.");
      } finally {
        setBusy(false);
      }
    }

    // Events
    btn.addEventListener("click", function () {
      setOpen(!state.open);
    });
    closeBtn.addEventListener("click", function () {
      setOpen(false);
    });
    sendBtn.addEventListener("click", sendMessage);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") sendMessage();
    });
    leadBox.addEventListener("click", function (e) {
      var t = e.target;
      if (t && t.id === "rw_submit") submitLead();
    });

    // Safety: re-append to body (some sites do weird DOM moves)
    document.body.appendChild(root);
  })();
}
