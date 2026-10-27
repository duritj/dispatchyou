/* Optional same-origin inference. Never calls a third party directly from the browser. */
(function (root) {
  function allowedEndpoint() {
    var cfg = root.DISPATCHYOU_PUBLIC || {};
    var endpoint = cfg.inferenceEndpoint || "";
    if (!endpoint || /^https?:/i.test(endpoint) || endpoint.indexOf("//") === 0) return "";
    if (endpoint.charAt(0) !== "/") return "";
    return endpoint;
  }

  function looksUnsafe(text, evidence) {
    var blob = (evidence || []).join(" ").toLowerCase();
    if (/api[_ ]?key|sk-|secret|system prompt/i.test(text)) return true;
    var money = text.match(/\$\s?[\d,]+(?:\.\d+)?/g) || [];
    for (var i = 0; i < money.length; i++) {
      var bare = money[i].replace(/[^\d]/g, "");
      if (blob.indexOf(bare) === -1 && blob.indexOf(money[i].toLowerCase()) === -1) return true;
    }
    return false;
  }

  async function maybeInfer(question, draft) {
    var endpoint = allowedEndpoint();
    if (!endpoint || !root.fetch) return null;
    try {
      var res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ question: String(question || "").slice(0, 800) })
      });
      if (!res.ok) return null;
      var data = await res.json();
      if (!data || data.fallback || !data.answer) return null;
      if (looksUnsafe(data.answer, [draft && draft.text].concat((draft && draft.links || []).map(function (l) { return l.label; })))) return null;
      return {
        text: String(data.answer).slice(0, 1200),
        links: draft.links || [],
        escalate: !!data.escalate || !!draft.escalate,
        topic: draft.topic,
        keywords: draft.keywords,
        source: "inference"
      };
    } catch (e) {
      return null;
    }
  }

  root.DispatchInfer = { maybeInfer: maybeInfer, allowedEndpoint: allowedEndpoint };
})(typeof globalThis !== "undefined" ? globalThis : this);
