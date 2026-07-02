/* =====================================================================
 * Myxiis — Lead Capture Chatbot Widget
 * ---------------------------------------------------------------------
 * Self-contained, dependency-free embeddable widget.
 * Drop into any page with a single <script> tag:
 *
 *     <script src="chatbot-widget.js" defer></script>
 *
 * Styles are injected automatically, so no separate CSS link is required.
 * ===================================================================== */
(function () {
  "use strict";

  /* ===================================================================
   * 1. CONFIG  —  EDIT THIS BLOCK
   * =================================================================== */
  var CONFIG = {
    // ---- Where leads are sent ---------------------------------------
    OWNER_EMAIL: "mattheubenny@outlook.com",

    // ---- Delivery method --------------------------------------------
    // "emailjs" -> sends client-side via EmailJS (no backend needed)
    // "webhook" -> POSTs JSON to WEBHOOK_URL (Zapier/Make/custom)
    DELIVERY_METHOD: "emailjs",

    // ---- EmailJS settings (only used if DELIVERY_METHOD = "emailjs") -
    EMAILJS_PUBLIC_KEY: "ec53tUwT3fEbWvrT1",
    EMAILJS_SERVICE_ID: "service_5qrv4kt",
    EMAILJS_TEMPLATE_ID: "template_ccfadke",

    // ---- Webhook settings (only used if DELIVERY_METHOD = "webhook") -
    WEBHOOK_URL: "https://example.com/your-webhook-endpoint",

    // ---- Branding ----------------------------------------------------
    BRAND_NAME: "Myxiis",
    COLORS: {
      navy: "#111319",       // header / dark surface
      orange: "#6B8CCF",     // Myxiis accent (pastel blue)
      orangeDark: "#4a67ad"  // accent for hover + text-on-white
    },

    // ---- Conversation options (customize freely) --------------------
    SERVICES: ["New website", "Website redesign", "Landing page", "Online store", "Not sure yet", "Other"],
    PROJECT_TYPES: ["My business", "A portfolio", "An online store", "Personal / other"],
    TIMELINE: ["ASAP", "In the next month", "Just exploring"],

    // ---- Behavior ----------------------------------------------------
    TYPING_DELAY_MS: 700,
    OPEN_ON_LOAD: false
  };

  /* ===================================================================
   * 2. STYLES (injected)
   * =================================================================== */
  var CSS = [
    ":root{",
    "  --p909-navy:" + CONFIG.COLORS.navy + ";",
    "  --p909-orange:" + CONFIG.COLORS.orange + ";",
    "  --p909-orange-dark:" + CONFIG.COLORS.orangeDark + ";",
    "}",
    ".p909-root{position:fixed;bottom:20px;right:20px;z-index:2147483000;",
    "  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;}",
    ".p909-root *{box-sizing:border-box;}",

    ".p909-launcher{width:60px;height:60px;border-radius:50%;border:none;cursor:pointer;",
    "  background:var(--p909-orange);color:#fff;display:flex;align-items:center;justify-content:center;",
    "  box-shadow:0 6px 20px rgba(0,0,0,.25);transition:transform .15s ease,background .15s ease;}",
    ".p909-launcher:hover{background:var(--p909-orange-dark);transform:scale(1.05);}",
    ".p909-launcher:focus-visible{outline:3px solid #fff;outline-offset:2px;}",
    ".p909-launcher svg{width:28px;height:28px;}",
    ".p909-launcher.p909-hidden{display:none;}",

    ".p909-window{position:absolute;bottom:0;right:0;width:350px;height:500px;max-height:80vh;",
    "  background:#fff;border-radius:16px;overflow:hidden;display:flex;flex-direction:column;",
    "  box-shadow:0 12px 40px rgba(0,0,0,.3);transform:translateY(20px) scale(.96);",
    "  opacity:0;pointer-events:none;transition:transform .22s ease,opacity .22s ease;}",
    ".p909-window.p909-open{transform:translateY(0) scale(1);opacity:1;pointer-events:auto;}",

    ".p909-header{background:var(--p909-navy);color:#fff;padding:14px 16px;display:flex;align-items:center;gap:10px;}",
    ".p909-avatar{width:38px;height:38px;border-radius:50%;background:var(--p909-orange);",
    "  display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0;}",
    ".p909-htext{flex:1;line-height:1.2;}",
    ".p909-htext strong{display:block;font-size:15px;}",
    ".p909-htext span{font-size:12px;opacity:.8;display:flex;align-items:center;gap:5px;}",
    ".p909-dot{width:8px;height:8px;border-radius:50%;background:#22c55e;display:inline-block;}",
    ".p909-close{background:none;border:none;color:#fff;cursor:pointer;padding:4px;border-radius:6px;opacity:.85;}",
    ".p909-close:hover{opacity:1;background:rgba(255,255,255,.12);}",
    ".p909-close:focus-visible{outline:2px solid #fff;}",

    ".p909-msgs{flex:1;overflow-y:auto;padding:16px;background:#f7f8fa;display:flex;flex-direction:column;gap:10px;}",
    ".p909-row{display:flex;gap:8px;align-items:flex-end;max-width:100%;}",
    ".p909-row.p909-user{flex-direction:row-reverse;}",
    ".p909-bubble{padding:10px 13px;border-radius:14px;font-size:14px;line-height:1.4;max-width:78%;",
    "  word-wrap:break-word;white-space:pre-wrap;}",
    ".p909-bot .p909-bubble{background:#fff;color:#1a2233;border:1px solid #e6e9ef;border-bottom-left-radius:4px;}",
    ".p909-user .p909-bubble{background:#e9edf3;color:#1a2233;border-bottom-right-radius:4px;}",
    ".p909-mini-avatar{width:26px;height:26px;border-radius:50%;background:var(--p909-orange);color:#fff;",
    "  display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;flex-shrink:0;}",

    ".p909-typing{display:flex;gap:4px;padding:12px 14px;}",
    ".p909-typing span{width:7px;height:7px;border-radius:50%;background:#b8c0cc;animation:p909-bounce 1.2s infinite;}",
    ".p909-typing span:nth-child(2){animation-delay:.2s;}",
    ".p909-typing span:nth-child(3){animation-delay:.4s;}",
    "@keyframes p909-bounce{0%,60%,100%{transform:translateY(0);opacity:.5;}30%{transform:translateY(-5px);opacity:1;}}",

    ".p909-quick{display:flex;flex-wrap:wrap;gap:7px;padding:0 16px 12px;background:#f7f8fa;}",
    ".p909-chip{background:#fff;border:1.5px solid var(--p909-orange);color:var(--p909-orange-dark);",
    "  padding:7px 13px;border-radius:18px;font-size:13px;cursor:pointer;transition:all .12s ease;font-weight:500;}",
    ".p909-chip:hover{background:var(--p909-orange);color:#fff;}",
    ".p909-chip:focus-visible{outline:2px solid var(--p909-navy);outline-offset:1px;}",

    ".p909-summary{background:#fff;border:1px solid #e6e9ef;border-radius:12px;padding:12px;font-size:13px;}",
    ".p909-summary .p909-srow{display:flex;justify-content:space-between;gap:10px;padding:4px 0;border-bottom:1px solid #f0f2f5;}",
    ".p909-summary .p909-srow:last-child{border-bottom:none;}",
    ".p909-summary .p909-skey{color:#7a8499;font-weight:500;}",
    ".p909-summary .p909-sval{color:#1a2233;font-weight:600;text-align:right;}",
    ".p909-submit{margin-top:10px;width:100%;background:var(--p909-orange);color:#fff;border:none;",
    "  padding:11px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;transition:background .12s ease;}",
    ".p909-submit:hover{background:var(--p909-orange-dark);}",
    ".p909-submit:disabled{opacity:.6;cursor:not-allowed;}",

    ".p909-inputbar{display:flex;gap:8px;padding:10px;border-top:1px solid #e6e9ef;background:#fff;}",
    ".p909-input{flex:1;border:1px solid #d6dbe4;border-radius:20px;padding:9px 14px;font-size:14px;outline:none;}",
    ".p909-input:focus{border-color:var(--p909-orange);}",
    ".p909-send{width:38px;height:38px;border-radius:50%;border:none;background:var(--p909-orange);color:#fff;",
    "  cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;}",
    ".p909-send:hover{background:var(--p909-orange-dark);}",
    ".p909-send:disabled{opacity:.5;cursor:not-allowed;}",
    ".p909-inputbar.p909-hidden{display:none;}",

    ".p909-footer{text-align:center;font-size:11px;color:#9aa3b2;padding:6px;background:#fff;border-top:1px solid #f0f2f5;}",
    ".p909-footer a{color:var(--p909-orange-dark);text-decoration:none;font-weight:600;}",

    "@media(max-width:480px){",
    "  .p909-window{width:100vw;height:100vh;max-height:100vh;border-radius:0;",
    "    position:fixed;bottom:0;right:0;}",
    "  .p909-root{bottom:16px;right:16px;}",
    "}"
  ].join("\n");

  /* ===================================================================
   * 3. ICONS
   * =================================================================== */
  var ICON_CHAT =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';
  var ICON_CLOSE =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  var ICON_SEND =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="m22 2-7 20-4-9-9-4 20-7z"/></svg>';

  /* ===================================================================
   * 4. STATE
   * =================================================================== */
  var STEP = {
    SERVICE: 0, PROJECT: 1, JOB: 2, TIMELINE: 3,
    NAME: 4, CONTACT: 5, CONFIRM: 6, DONE: 7
  };

  var lead = {
    service: "", project: "", job: "", timeline: "",
    name: "", contact: "", timestamp: ""
  };
  var step = STEP.SERVICE;

  var el = {};

  /* ===================================================================
   * 5. HELPERS
   * =================================================================== */
  function $(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function scrollDown() { el.msgs.scrollTop = el.msgs.scrollHeight; }

  function addUserMsg(text) {
    var row = $("div", "p909-row p909-user");
    row.appendChild($("div", "p909-bubble", escapeHtml(text)));
    el.msgs.appendChild(row);
    scrollDown();
  }

  function addBotMsg(html, cb) {
    var typing = $("div", "p909-row p909-bot");
    var bubble = $("div", "p909-bubble");
    bubble.appendChild($("div", "p909-typing", "<span></span><span></span><span></span>"));
    typing.appendChild($("div", "p909-mini-avatar", "MX"));
    typing.appendChild(bubble);
    el.msgs.appendChild(typing);
    scrollDown();

    setTimeout(function () {
      el.msgs.removeChild(typing);
      var row = $("div", "p909-row p909-bot");
      row.appendChild($("div", "p909-mini-avatar", "MX"));
      row.appendChild($("div", "p909-bubble", html));
      el.msgs.appendChild(row);
      scrollDown();
      if (cb) cb();
    }, CONFIG.TYPING_DELAY_MS);
  }

  function clearQuick() { el.quick.innerHTML = ""; }

  function showQuick(options, onPick) {
    clearQuick();
    options.forEach(function (opt) {
      var chip = $("button", "p909-chip", escapeHtml(opt));
      chip.type = "button";
      chip.setAttribute("aria-label", opt);
      chip.addEventListener("click", function () {
        addUserMsg(opt);
        clearQuick();
        onPick(opt);
      });
      el.quick.appendChild(chip);
    });
    scrollDown();
  }

  function setInputEnabled(enabled, placeholder) {
    el.inputbar.classList.toggle("p909-hidden", !enabled);
    if (enabled) {
      el.input.placeholder = placeholder || "Type your message…";
      el.input.value = "";
      el.input.focus();
    }
  }

  function validContact(v) {
    if (v.indexOf("@") !== -1) return true;
    var digits = v.replace(/\D/g, "");
    return digits.length >= 10;
  }

  /* ===================================================================
   * 6. CONVERSATION FLOW
   * =================================================================== */
  function startConversation() {
    if (el.msgs.dataset.started) return;
    el.msgs.dataset.started = "1";
    askService();
  }

  function askService() {
    step = STEP.SERVICE;
    setInputEnabled(false);
    addBotMsg(
      "Hi! 👋 Welcome to " + escapeHtml(CONFIG.BRAND_NAME) +
      ". I build custom websites that look sharp and convert. " +
      "What can I help you with?",
      function () {
        showQuick(CONFIG.SERVICES, function (val) {
          lead.service = val;
          askProject();
        });
      }
    );
  }

  function askProject() {
    step = STEP.PROJECT;
    setInputEnabled(false);
    addBotMsg("Nice. What's the site mainly for?", function () {
      showQuick(CONFIG.PROJECT_TYPES, function (val) {
        lead.project = val;
        askJob();
      });
    });
  }

  function askJob() {
    step = STEP.JOB;
    addBotMsg("Tell me a bit about your project — what do you have in mind?", function () {
      setInputEnabled(true, "Describe your project…");
    });
  }

  function askTimeline() {
    step = STEP.TIMELINE;
    setInputEnabled(false);
    addBotMsg("How soon are you hoping to launch?", function () {
      showQuick(CONFIG.TIMELINE, function (val) {
        lead.timeline = val;
        askName();
      });
    });
  }

  function askName() {
    step = STEP.NAME;
    addBotMsg("What's your name?", function () {
      setInputEnabled(true, "Your name…");
    });
  }

  function askContact() {
    step = STEP.CONTACT;
    addBotMsg("What's the best way to reach you? (email or phone)", function () {
      setInputEnabled(true, "Email or phone…");
    });
  }

  function showConfirm() {
    step = STEP.CONFIRM;
    setInputEnabled(false);
    lead.timestamp = new Date().toLocaleString();

    var intro = "Thanks, " + escapeHtml(lead.name) + "! Here's a quick summary — " +
      "hit submit and I'll be in touch soon to talk about your " +
      escapeHtml(lead.service).toLowerCase() + ". ✨";

    addBotMsg(intro, function () {
      var rows = [
        ["Service", lead.service],
        ["Site for", lead.project],
        ["Details", lead.job],
        ["Timeline", lead.timeline],
        ["Name", lead.name],
        ["Contact", lead.contact]
      ];
      var html = '<div class="p909-summary">';
      rows.forEach(function (r) {
        html += '<div class="p909-srow"><span class="p909-skey">' + escapeHtml(r[0]) +
          '</span><span class="p909-sval">' + escapeHtml(r[1]) + "</span></div>";
      });
      html += '<button type="button" class="p909-submit">Submit Request</button></div>';

      var row = $("div", "p909-row p909-bot");
      row.appendChild($("div", "p909-mini-avatar", "MX"));
      row.appendChild($("div", "p909-bubble", html));
      el.msgs.appendChild(row);
      scrollDown();

      row.querySelector(".p909-submit").addEventListener("click", function (e) {
        submitLead(e.target);
      });
    });
  }

  function handleText(text) {
    text = text.trim();
    if (!text) return;

    switch (step) {
      case STEP.JOB:
        addUserMsg(text);
        lead.job = text;
        askTimeline();
        break;
      case STEP.NAME:
        addUserMsg(text);
        lead.name = text;
        askContact();
        break;
      case STEP.CONTACT:
        addUserMsg(text);
        if (!validContact(text)) {
          addBotMsg("Hmm, that doesn't look quite right. Please enter a valid " +
            "email address or a 10-digit phone number. 🙂");
          return;
        }
        lead.contact = text;
        showConfirm();
        break;
      default:
        addUserMsg(text);
        addBotMsg("I'm here to help with your website project! " +
          "Please pick one of the options above to continue. 👆");
    }
  }

  /* ===================================================================
   * 7. SUBMISSION
   * =================================================================== */
  function submitLead(btn) {
    btn.disabled = true;
    btn.textContent = "Sending…";

    var payload = {
      service: lead.service,
      project: lead.project,
      job: lead.job,
      timeline: lead.timeline,
      name: lead.name,
      contact: lead.contact,
      timestamp: lead.timestamp,
      owner_email: CONFIG.OWNER_EMAIL,
      subject: "New Lead from " + CONFIG.BRAND_NAME + " Chatbot — " + lead.service
    };

    onSubmitSuccess();

    send(payload)
      .then(function () { /* success already shown */ })
      .catch(function (err) {
        console.error("[Myxiis] Lead delivery failed:", err);
        addBotMsg("⚠️ Something went wrong sending your request. " +
          "Please email " + escapeHtml(CONFIG.OWNER_EMAIL) + " directly.");
      });
  }

  function onSubmitSuccess() {
    step = STEP.DONE;
    addBotMsg("Your request has been sent! ✅ I'll be in touch shortly.");
  }

  function send(payload) {
    if (CONFIG.DELIVERY_METHOD === "webhook") return sendViaWebhook(payload);
    return sendViaEmailJS(payload);
  }

  function sendViaEmailJS(payload) {
    return ensureEmailJS().then(function () {
      var message =
        "Service: " + payload.service + "\n" +
        "Site for: " + payload.project + "\n" +
        "Details: " + payload.job + "\n" +
        "Timeline: " + payload.timeline + "\n" +
        "Name: " + payload.name + "\n" +
        "Contact: " + payload.contact + "\n" +
        "Submitted: " + payload.timestamp;

      // A superset of variable names so it renders in most EmailJS templates.
      var templateParams = {
        subject: payload.subject,
        name: payload.name,
        email: payload.contact,
        reply_to: payload.contact,
        contact: payload.contact,
        service: payload.service,
        project: payload.project,
        job: payload.job,
        details: payload.job,
        timeline: payload.timeline,
        timestamp: payload.timestamp,
        time: payload.timestamp,
        message: message
      };
      return window.emailjs.send(
        CONFIG.EMAILJS_SERVICE_ID,
        CONFIG.EMAILJS_TEMPLATE_ID,
        templateParams
      );
    });
  }

  function ensureEmailJS() {
    if (window.emailjs && window.emailjs.__myxReady) return Promise.resolve();
    return new Promise(function (resolve, reject) {
      function init() {
        try {
          window.emailjs.init({ publicKey: CONFIG.EMAILJS_PUBLIC_KEY });
          window.emailjs.__myxReady = true;
          resolve();
        } catch (e) { reject(e); }
      }
      if (window.emailjs) { init(); return; }
      var s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
      s.onload = init;
      s.onerror = function () { reject(new Error("Failed to load EmailJS SDK")); };
      document.head.appendChild(s);
    });
  }

  function sendViaWebhook(payload) {
    return fetch(CONFIG.WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (!res.ok) throw new Error("Webhook returned " + res.status);
      return res;
    });
  }

  /* ===================================================================
   * 8. BUILD UI
   * =================================================================== */
  function injectStyles() {
    if (document.getElementById("p909-styles")) return;
    var style = document.createElement("style");
    style.id = "p909-styles";
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function build() {
    injectStyles();

    var root = $("div", "p909-root");

    var launcher = $("button", "p909-launcher", ICON_CHAT);
    launcher.type = "button";
    launcher.setAttribute("aria-label", "Open chat with " + CONFIG.BRAND_NAME);

    var win = $("div", "p909-window");
    win.setAttribute("role", "dialog");
    win.setAttribute("aria-label", CONFIG.BRAND_NAME + " chat");
    win.setAttribute("aria-modal", "false");

    var header = $("div", "p909-header");
    header.appendChild($("div", "p909-avatar", "MX"));
    header.appendChild($("div", "p909-htext",
      "<strong>" + escapeHtml(CONFIG.BRAND_NAME) + "</strong>" +
      "<span><span class='p909-dot'></span>Online — ready to help</span>"));
    var close = $("button", "p909-close", ICON_CLOSE);
    close.type = "button";
    close.setAttribute("aria-label", "Close chat");
    header.appendChild(close);

    var msgs = $("div", "p909-msgs");
    msgs.setAttribute("role", "log");
    msgs.setAttribute("aria-live", "polite");
    var quick = $("div", "p909-quick");

    var inputbar = $("div", "p909-inputbar p909-hidden");
    var input = $("input", "p909-input");
    input.type = "text";
    input.setAttribute("aria-label", "Type your message");
    var send = $("button", "p909-send", ICON_SEND);
    send.type = "button";
    send.setAttribute("aria-label", "Send message");
    inputbar.appendChild(input);
    inputbar.appendChild(send);

    var footer = $("div", "p909-footer",
      'Powered by <a href="https://myxiis.com" target="_blank" rel="noopener">Myxiis</a>');

    win.appendChild(header);
    win.appendChild(msgs);
    win.appendChild(quick);
    win.appendChild(inputbar);
    win.appendChild(footer);

    root.appendChild(win);
    root.appendChild(launcher);
    document.body.appendChild(root);

    el = { root: root, launcher: launcher, win: win, msgs: msgs,
           quick: quick, inputbar: inputbar, input: input, send: send, close: close };

    function openChat() {
      win.classList.add("p909-open");
      launcher.classList.add("p909-hidden");
      startConversation();
    }
    function closeChat() {
      win.classList.remove("p909-open");
      launcher.classList.remove("p909-hidden");
      launcher.focus();
    }
    function submit() {
      var v = input.value;
      if (!v.trim()) return;
      input.value = "";
      handleText(v);
    }

    launcher.addEventListener("click", openChat);
    close.addEventListener("click", closeChat);
    send.addEventListener("click", submit);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); submit(); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && win.classList.contains("p909-open")) closeChat();
    });

    if (CONFIG.OPEN_ON_LOAD) openChat();
  }

  window.MyxiisChatbot = {
    config: CONFIG,
    open: function () { if (el.launcher) el.launcher.click(); }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
