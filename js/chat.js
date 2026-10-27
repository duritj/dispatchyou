/* Website assistant. Retrieval and wording are separate from this panel. */
(function () {
  var history = { topic: null, keywords: "" };
  var panel, log, input, sendBtn, suggestionsEl, loading = false, busy = false;
  var SUGGESTIONS = [
    {
      q: "What does DispatchYou do?",
      a: "DispatchYou is a US truck dispatch desk for trucking companies and owner-operators. The team looks for loads, plans routes, negotiates spot and contract rates, and handles paperwork. Dispatchers work for the carrier.",
      links: [{ href: "services.html", label: "Services" }]
    },
    {
      q: "Do you work with owner-operators?",
      a: "Yes. DispatchYou works with owner-operators and with carriers at every stage, including brand-new authority. Newer authorities can have a harder time reaching the best loads at first.",
      links: [{ href: "owner-operators.html", label: "Owner-operators" }]
    },
    {
      q: "Which trailers can you dispatch?",
      a: "The site lists dry van, reefer, flatbed, step deck, conestoga, and car hauler, plus LTL and partial loads.",
      links: [{ href: "trailer-types.html", label: "Trailer types" }]
    },
    {
      q: "How does pricing work?",
      a: "DispatchYou publishes a percentage of the load, not a flat weekly fee. The percentage depends on fleet size, time in business, and safety score. It is not a guaranteed weekly gross.",
      links: [{ href: "pricing.html", label: "Pricing" }]
    },
    {
      q: "How do I get started?",
      a: "Send the form on this site or email duriyodtj@gmail.com. A sales manager emails the dispatch-carrier agreement for you to review, complete, and sign. The agreement is not posted on the site.",
      links: [{ href: "contacts.html", label: "Contact" }]
    },
    {
      q: "How do I contact the desk?",
      a: "Email duriyodtj@gmail.com or use the contact form. Facebook and Instagram (@dispatchyou) are linked on the contact page. There is no published phone number or office address.",
      links: [{ href: "contacts.html", label: "Contact" }]
    }
  ];

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text) node.textContent = text;
    return node;
  }

  function addBubble(role, text, links) {
    var bubble = el("div", "chat-bubble chat-bubble--" + role);
    bubble.textContent = text;
    if (links && links.length) {
      var list = el("ul", "chat-links");
      links.forEach(function (item) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = item.href;
        a.textContent = item.label;
        li.appendChild(a);
        list.appendChild(li);
      });
      bubble.appendChild(list);
    }
    log.appendChild(bubble);
    log.scrollTop = log.scrollHeight;
    return bubble;
  }

  function escalationForm(question) {
    var form = el("form", "chat-form");
    form.innerHTML = '<label>Name<input name="name" autocomplete="name" required maxlength="80"></label><label>Email<input name="email" type="email" autocomplete="email" required maxlength="120"></label><label>Note, optional<textarea name="note" maxlength="800"></textarea></label><button type="submit">Send to the team</button>';
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var button = form.querySelector("button");
      button.disabled = true;
      window.DispatchMail.send({
        name: data.get("name"),
        email: data.get("email"),
        note: data.get("note"),
        question: question,
        subject: "DispatchYou — website chatbot",
        source: "Website chatbot",
        page: location.pathname.replace(/^\//, "") || "home",
        sent_at: new Date().toISOString()
      }).then(function () {
        form.remove();
        addBubble("bot", "The team has the note. This assistant only shows that after the email service accepts it.");
      }).catch(function (err) {
        button.disabled = false;
        addBubble("bot", (err && err.message) || "That note was not sent. You can try again, or use the contact page.");
      });
    });
    var bubble = el("div", "chat-bubble chat-bubble--bot");
    bubble.appendChild(el("p", "", "If you want a person to follow up, leave your name and email. The note goes to the DispatchYou team. I will not say it was sent until the email service accepts it."));
    bubble.appendChild(form);
    log.appendChild(bubble);
    log.scrollTop = log.scrollHeight;
  }

  function ask(question) {
    var draft = window.DispatchCompose.compose(question, history);
    history.topic = draft.topic;
    history.keywords = draft.keywords || history.keywords;
    var pending = addBubble("bot", "Checking the site…");
    var infer = window.DispatchInfer && window.DispatchInfer.maybeInfer
      ? window.DispatchInfer.maybeInfer(question, draft)
      : Promise.resolve(null);
    return Promise.resolve(infer).then(function (polished) {
      var answer = polished || draft;
      pending.remove();
      addBubble("bot", answer.text, answer.links);
      if (answer.escalate || /contact me|someone from your team|call me|have someone/.test(question.toLowerCase())) {
        escalationForm(question);
      }
    }).catch(function () {
      pending.remove();
      addBubble("bot", draft.text, draft.links);
    });
  }

  function renderSuggestions() {
    if (suggestionsEl && suggestionsEl.isConnected) return;
    suggestionsEl = el("div", "chat-suggestions");
    suggestionsEl.setAttribute("role", "group");
    suggestionsEl.setAttribute("aria-label", "Suggested questions");
    SUGGESTIONS.forEach(function (item) {
      var chip = el("button", "chat-chip", item.q);
      chip.type = "button";
      chip.addEventListener("click", function () { useSuggestion(item); });
      suggestionsEl.appendChild(chip);
    });
    log.appendChild(suggestionsEl);
    log.scrollTop = log.scrollHeight;
  }

  function useSuggestion(item) {
    if (busy || !suggestionsEl || !suggestionsEl.isConnected) return;
    busy = true;
    suggestionsEl.remove();
    addBubble("user", item.q);
    addBubble("bot", item.a, item.links);
    busy = false;
  }

  function openPanel() {
    panel.hidden = false;
    input.focus();
    if (!log.childElementCount) {
      addBubble("bot", "I'm the DispatchYou site assistant, not a person on the desk. Pick a question below, or type your own.");
      renderSuggestions();
    }
  }

  function boot() {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "css/chat.css";
    document.head.appendChild(link);

    panel = el("section", "chat-panel");
    panel.hidden = true;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "false");
    panel.setAttribute("aria-labelledby", "chatTitle");
    panel.innerHTML = '<div class="chat-panel__head"><div><h2 id="chatTitle">Dispatch desk</h2><p>Automated assistant. Answers come from this website.</p></div><button type="button" class="chat-panel__close" aria-label="Close chat">Close</button></div><div class="chat-log" aria-live="polite"></div><form class="chat-composer"><div class="chat-compose"><input name="q" aria-label="Message" maxlength="800" autocomplete="off" placeholder="Ask about dispatching"><button type="submit">Send</button></div><div class="chat-tools"><button type="button" class="chat-ideas">Suggestions</button><button type="button" class="chat-reset">Reset</button></div></form>';
    document.body.appendChild(panel);
    log = panel.querySelector(".chat-log");
    input = panel.querySelector("input");
    sendBtn = panel.querySelector(".chat-composer button[type=submit]");
    panel.querySelector(".chat-panel__close").addEventListener("click", function () { panel.hidden = true; });
    panel.querySelector(".chat-ideas").addEventListener("click", function () { renderSuggestions(); });
    panel.querySelector(".chat-reset").addEventListener("click", function () {
      history = { topic: null, keywords: "" };
      log.innerHTML = "";
      suggestionsEl = null;
      addBubble("bot", "I'm the DispatchYou site assistant, not a person on the desk. Pick a question below, or type your own.");
      renderSuggestions();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !panel.hidden) { panel.hidden = true; }
    });
    panel.querySelector(".chat-composer").addEventListener("submit", function (e) {
      e.preventDefault();
      var question = input.value.trim();
      if (!question) return;
      input.value = "";
      addBubble("user", question);
      sendBtn.disabled = true;
      ask(question).then(function () { sendBtn.disabled = false; input.focus(); });
    });
    openPanel();
  }

  function loadThen(done) {
    var files = ["data/knowledge.js", "js/retrieve.js", "js/compose.js", "js/infer.js"];
    var i = 0;
    function next() {
      if (i >= files.length) { done(); return; }
      var s = document.createElement("script");
      s.src = files[i++];
      s.onload = next;
      document.body.appendChild(s);
    }
    next();
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest(".chat-launcher");
    if (!btn) return;
    if (panel) { panel.hidden = !panel.hidden; if (!panel.hidden) input.focus(); return; }
    if (loading) return;
    loading = true;
    loadThen(boot);
  });
})();
