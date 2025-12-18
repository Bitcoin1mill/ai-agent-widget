/* Revival AI Widget - Stable Base */
console.log("[WIDGET] widget.js loaded");

/* Prevent double load */
if (window.__REVIVAL_WIDGET_LOADED__) {
  console.warn("[WIDGET] already loaded");
} else {
  window.__REVIVAL_WIDGET_LOADED__ = true;

  (function () {
    "use strict";

    /* =========================
       CONFIG
    ========================= */
    var scriptEl = document.currentScript;

    var CONFIG = {
      backend:
        (scriptEl && scriptEl.getAttribute("data-backend")) ||
        "http://localhost:3000",
      businessId:
        (scriptEl && scriptEl.getAttribute("data-business-id")) || "1",
    };

    console.log("[WIDGET] config", CONFIG);

    /* =========================
       ROOT + STYLES
    ========================= */
    var root = document.createElement("div");
    root.id = "revival-widget-root";
    document.body.appendChild(root);

    var style = document.createElement("style");
    style.textContent =
      "#revival-widget-root * { box-sizing: border-box; font-family: Arial, sans-serif; }" +
      ".revival-chat-btn {" +
      " position: fixed; bottom: 20px; right: 20px; z-index: 999999;" +
      " width: 60px; height: 60px; border-radius: 30px;" +
      " background: #111; color: #fff; border: none; cursor: pointer;" +
      "}" +
      ".revival-panel {" +
      " position: fixed; bottom: 90px; right: 20px; width: 360px; height: 500px;" +
      " background: #fff; border: 1px solid #ccc; border-radius: 12px;" +
      " display: none; flex-direction: column; z-index: 999999;" +
      "}" +
      ".revival-panel.open { display: flex; }" +
      ".revival-header {" +
      " padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;" +
      "}" +
      ".revival-messages {" +
      " flex: 1; padding: 10px; overflow-y: auto; background: #f9f9f9;" +
      "}" +
      ".revival-msg { margin-bottom: 8px; font-size: 13px; }" +
      ".revival-msg.user { text-align: right; }" +
      ".revival-input {" +
      " display: flex; border-top: 1px solid #eee; padding: 10px;" +
      "}" +
      ".revival-input input {" +
      " flex: 1; padding: 8px; font-size: 13px;" +
      "}" +
      ".revival-input button {" +
      " margin-left: 6px; padding: 8px 12px; font-size: 13px;" +
      "}";

    document.head.appendChild(style);

    /* =========================
       UI ELEMENTS
    ========================= */
    var button = document.createElement("button");
    button.className = "revival-chat-btn";
    button.textContent = "Chat";

    var panel = document.createElement("div");
    panel.className = "revival-panel";

    var header = document.createElement("div");
    header.className = "revival-header";
    header.textContent = "AI Assistant";

    var messages = document.createElement("div");
    messages.className = "revival-messages";

    var inputWrap = document.createElement("div");
    inputWrap.className = "revival-input";

    var input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Type a message...";

    var sendBtn = document.createElement("button");
    sendBtn.textContent = "Send";

    inputWrap.appendChild(input);
    inputWrap.appendChild(sendBtn);

    panel.appendChild(header);
    panel.appendChild(messages);
    panel.appendChild(inputWrap);

    root.appendChild(button);
    root.appendChild(panel);

    /* =========================
       HELPERS
    ========================= */
    function addMessage(text, role) {
      var div = document.createElement("div");
      div.className = "revival-msg " + role;
      div.textContent = text;
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }

    function togglePanel() {
      if (panel.classList.contains("open")) {
        panel.classList.remove("open");
        button.textContent = "Chat";
      } else {
        panel.classList.add("open");
        button.textContent = "Close";
        if (messages.children.length === 0) {
          addMessage("Hi! How can I help you?", "bot");
        }
      }
    }

    /* =========================
       EVENTS
    ========================= */
    button.addEventListener("click", togglePanel);

    sendBtn.addEventListener("click", sendMessage);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") sendMessage();
    });

    function sendMessage() {
      var text = input.value.trim();
      if (!text) return;
      input.value = "";

      addMessage(text, "user");

      fetch(CONFIG.backend + "/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: CONFIG.businessId,
          message: text,
        }),
      })
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          var reply = data.reply || "Thanks for your message.";
          addMessage(reply, "bot");
        })
        .catch(function (err) {
          console.error("[WIDGET] fetch error", err);
          addMessage("Error talking to server.", "bot");
        });
    }
  })();
}
