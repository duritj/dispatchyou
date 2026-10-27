/* Deterministic retrieval. No network. Safe to run in the browser or in node. */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.DispatchRetrieve = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  var STOP = { a: 1, an: 1, the: 1, do: 1, does: 1, did: 1, you: 1, your: 1, i: 1, we: 1, is: 1, are: 1, to: 1, of: 1, for: 1, my: 1, me: 1, can: 1, how: 1, what: 1, with: 1, and: 1, or: 1, on: 1, in: 1, it: 1, this: 1, that: 1, please: 1, about: 1, from: 1, be: 1, will: 1, would: 1, our: 1, us: 1 };

  function knowledge() {
    if (typeof module === "object" && module.exports) {
      try { return require("../data/knowledge.js"); } catch (e) { /* browser bundle */ }
    }
    return (typeof DISPATCHYOU_KNOWLEDGE !== "undefined" ? DISPATCHYOU_KNOWLEDGE : []);
  }

  function normalize(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/owner[\s-]?ops?\b/g, "owner operator")
      .replace(/\$/g, " ")
      .replace(/[^a-z0-9+]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tokens(text) {
    return normalize(text).split(" ").filter(function (w) { return w && !STOP[w]; });
  }

  function scoreChunk(chunk, query, queryTokens) {
    var score = 0;
    var seen = {};
    queryTokens.forEach(function (word) {
      if (seen[word]) return;
      seen[word] = 1;
      var hit = chunk.keywords.some(function (k) { return k === word || (word.length > 4 && k.indexOf(word) === 0); });
      if (hit) score += word.length > 5 ? 3 : 1;
    });
    (chunk.phrases || []).forEach(function (phrase) {
      if (query.indexOf(normalize(phrase)) !== -1) score += 6;
    });
    return score;
  }

  function retrieve(question, history) {
    var q = normalize(question);
    var own = tokens(q);
    if (history && history.keywords && own.length > 0 && own.length < 5) q = (q + " " + history.keywords).trim();
    var queryTokens = tokens(q);
    var ranked = knowledge().map(function (chunk) {
      return { chunk: chunk, score: scoreChunk(chunk, q, queryTokens) };
    }).filter(function (row) { return row.score > 0; });
    ranked.sort(function (a, b) { return b.score - a.score; });
    var best = ranked[0] || null;
    var second = ranked[1] || null;
    var coverage = "low";
    if (best && best.score >= 6) coverage = "high";
    else if (best && best.score >= 3) coverage = "medium";
    return {
      coverage: coverage,
      best: best ? best.chunk : null,
      score: best ? best.score : 0,
      alternatives: ranked.slice(1, 3).map(function (row) { return row.chunk; }),
      secondScore: second ? second.score : 0
    };
  }

  return { retrieve: retrieve, normalize: normalize, tokens: tokens };
});
