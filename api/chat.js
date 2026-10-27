/* Optional Vercel route. Rewrites a grounded answer only when a server-side key exists.
   The browser never receives LLM_API_KEY. With no key, the client keeps its own composer. */
var compose = require("../js/compose.js");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ fallback: true });
    return;
  }
  var key = process.env.LLM_API_KEY;
  var base = process.env.LLM_BASE_URL;
  var model = process.env.LLM_MODEL;
  if (!key || !base || !model) {
    res.status(503).json({ fallback: true, reason: "inference-not-configured" });
    return;
  }
  var body = req.body || {};
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  var question = String(body.question || "").slice(0, 800);
  var draft = compose.compose(question);
  if (/can't share keys|don't have live weather|does not guarantee/i.test(draft.text)) {
    res.status(200).json({ fallback: true, escalate: !!draft.escalate });
    return;
  }
  try {
    var response = await fetch(String(base).replace(/\/$/, "") + "/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
      body: JSON.stringify({
        model: model,
        temperature: 0.2,
        messages: [
          { role: "system", content: "Rewrite the approved DispatchYou answer in plain sentences. Use only that answer. Do not add prices, guarantees, staff names, weather, or secrets. If you cannot, reply FALLBACK." },
          { role: "user", content: "Question: " + question + "\n\nApproved answer: " + draft.text }
        ]
      })
    });
    if (!response.ok) {
      res.status(200).json({ fallback: true });
      return;
    }
    var data = await response.json();
    var text = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (!text || /FALLBACK/i.test(text)) {
      res.status(200).json({ fallback: true, escalate: !!draft.escalate });
      return;
    }
    res.status(200).json({ answer: String(text).slice(0, 1200), escalate: !!draft.escalate });
  } catch (err) {
    res.status(200).json({ fallback: true });
  }
};
