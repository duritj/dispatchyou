/* Delivers inquiries through EmailJS. Success only after HTTP 200.
   Recipients live in the EmailJS template, never in this request. */
(function () {
  var ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";
  var COOLDOWN_MS = 15000;

  function cfg() {
    return window.DISPATCHYOU_PUBLIC || {};
  }

  function configured() {
    var c = cfg();
    return !!(c.emailjsPublicKey && c.emailjsServiceId && c.emailjsTemplateId);
  }

  function fail(message) {
    var err = new Error(message);
    err.code = "delivery";
    return err;
  }

  function send(fields) {
    if (!configured()) {
      return Promise.reject(fail("Email is not configured yet, so this note was not sent. Write to duriyodtj@gmail.com."));
    }
    var payload;
    try {
      payload = window.DispatchMailCore.buildPayload(fields);
    } catch (err) {
      return Promise.reject(err);
    }
    var last = 0;
    try { last = Number(sessionStorage.getItem("dy-mail-at") || 0); } catch (e) { last = 0; }
    if (last && Date.now() - last < COOLDOWN_MS) {
      return Promise.reject(fail("Please wait a few seconds before sending another note."));
    }
    return fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: cfg().emailjsServiceId,
        template_id: cfg().emailjsTemplateId,
        user_id: cfg().emailjsPublicKey,
        template_params: payload
      })
    }).then(function (res) {
      if (!res.ok) throw fail("The email service did not accept that message. Nothing was delivered. Try again, or write to duriyodtj@gmail.com.");
      try { sessionStorage.setItem("dy-mail-at", String(Date.now())); } catch (e) {}
      return true;
    }).catch(function (err) {
      if (err && err.code === "delivery") throw err;
      throw fail("The message could not be sent. Check your connection and try again, or write to duriyodtj@gmail.com.");
    });
  }

  function statusNode(form) {
    var node = form.querySelector(".mail-status");
    if (!node) {
      node = document.createElement("p");
      node.className = "mail-status";
      node.setAttribute("role", "alert");
      form.appendChild(node);
    }
    return node;
  }

  function setBusy(form, busy) {
    form.querySelectorAll("button[type=submit], .quote-send").forEach(function (btn) {
      btn.disabled = busy;
      btn.setAttribute("aria-busy", busy ? "true" : "false");
    });
  }

  function showSuccess(form) {
    var status = statusNode(form);
    status.hidden = true;
    status.textContent = "";
    if (form.id === "contactForm") {
      var popup = document.getElementById("popup");
      if (popup) {
        popup.classList.add("show");
        popup.setAttribute("aria-hidden", "false");
        var close = document.getElementById("popupClose");
        if (close) close.focus();
      }
      return;
    }
    if (form.id === "applyForm") {
      var fields = document.getElementById("applyFields");
      var success = document.getElementById("applySuccess");
      if (fields) fields.hidden = true;
      if (success) success.hidden = false;
      form.classList.add("is-sent");
      return;
    }
    form.querySelectorAll(".quote-step, .qstep").forEach(function (el) { el.hidden = true; });
    var msg = form.querySelector(".form-msg");
    if (msg) msg.hidden = false;
    form.classList.add("is-sent");
    if (msg) msg.setAttribute("tabindex", "-1");
    if (msg && msg.focus) msg.focus();
  }

  function showError(form, message) {
    var status = statusNode(form);
    status.hidden = false;
    status.textContent = message;
    form.classList.remove("is-sent");
  }

  function readForm(form) {
    var data = { page: location.pathname.replace(/^\//, "") || "home", sent_at: new Date().toISOString() };
    if (form.dataset.subject) data.subject = form.dataset.subject;
    else if (form.id === "contactForm") data.subject = "DispatchYou — contact message";
    else if (form.id === "applyForm") data.subject = "DispatchYou — job application";
    else data.subject = "DispatchYou — quote request";
    data.source = form.dataset.source || "Website form";
    new FormData(form).forEach(function (value, key) {
      if (key === "company_website" || key === "_gotcha" || key.indexOf("web_form") === 0) return;
      if (typeof value !== "string") return;
      data[key] = value;
    });
    return data;
  }

  function bind(form) {
    if (form.dataset.mailBound) return;
    if (form.id === "newsForm") return;
    form.dataset.mailBound = "1";
    var trap = document.createElement("input");
    trap.type = "text";
    trap.name = "company_website";
    trap.tabIndex = -1;
    trap.autocomplete = "off";
    trap.setAttribute("aria-hidden", "true");
    trap.style.cssText = "position:absolute!important;left:-9999px!important;width:1px;height:1px;opacity:0;";
    form.appendChild(trap);

    form.addEventListener("submit", function (e) {
      var honey = form.querySelector('input[name="company_website"]');
      if (honey && honey.value) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }
      e.preventDefault();
      e.stopImmediatePropagation();
      if (typeof form.checkValidity === "function" && !form.checkValidity()) {
        if (form.reportValidity) form.reportValidity();
        var hint = form.querySelector(".quote-hint");
        if (hint) hint.hidden = false;
        return;
      }
      if (form.dataset.sending === "1") return;
      form.dataset.sending = "1";
      setBusy(form, true);
      var status = statusNode(form);
      status.hidden = false;
      status.textContent = "Sending…";
      send(readForm(form)).then(function () {
        showSuccess(form);
      }).catch(function (err) {
        showError(form, err && err.message ? err.message : "The message was not sent.");
      }).then(function () {
        form.dataset.sending = "0";
        setBusy(form, false);
      });
    }, true);
  }

  document.querySelectorAll("form").forEach(bind);
  window.DispatchMail = { send: send, configured: configured, bind: bind };
})();
