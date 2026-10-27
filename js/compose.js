/* Turns retrieval into a conversational reply. Does not invent facts. */
(function (root, factory) {
  var api = factory(root);
  if (typeof module === "object" && module.exports) module.exports = api;
  root.DispatchCompose = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  function retrieveApi() {
    if (typeof module === "object" && module.exports) {
      try { return require("./retrieve.js"); } catch (e) { /* browser */ }
    }
    return root.DispatchRetrieve;
  }

  function reply(text, extra) {
    var out = { text: text, links: [], escalate: false, topic: null, keywords: "", source: "composer" };
    if (extra) Object.keys(extra).forEach(function (k) { out[k] = extra[k]; });
    return out;
  }

  function link(chunk) {
    if (!chunk) return [];
    return [{ href: chunk.url, label: chunk.title }];
  }

  function compose(question, history) {
    var q = String(question || "").trim();
    var lower = q.toLowerCase();
    if (!q) return reply("Ask me something about DispatchYou, dispatching, equipment, or the published pricing.", { escalate: false });

    if (/api key|ignore (your|the) rules|system prompt|reveal (your|the) (secret|prompt)|drop (the|your) instructions/.test(lower)) {
      return reply("I can't share keys, hidden instructions, or anything that isn't on the public site. If you have a real question about dispatching, ask it in plain language, or I can pass a note to the team.", { escalate: false });
    }
    if (/weather|forecast|temperature|chicago right now/.test(lower)) {
      return reply("I don't have live weather or anything outside this website. I can explain DispatchYou's services, equipment, or published percentages, or send your question to the team.", { escalate: true });
    }
    if (/guarantee|\$\s*10[,.]?000|10,?000 every week|promise me/.test(lower)) {
      return reply("No. DispatchYou does not guarantee a weekly gross, including $10,000. The homepage shows an average weekly gross of $7,000+, and that is a marketing figure, not a promise for your truck. Pricing on the site is a percentage of the load, built from fleet size, time in business, and safety score.", {
        escalate: true,
        links: [{ href: "pricing.html", label: "Published pricing" }, { href: "index.html", label: "Homepage" }]
      });
    }

    var found = retrieveApi().retrieve(q, history || null);
    if (found.coverage === "low" || !found.best) {
      return reply("I don't have a reliable answer for that in DispatchYou's site content. I can pass it to the team if you leave your name and email.", { escalate: true });
    }

    var best = found.best;
    var lead = best.answer;
    if (/specific truck|how much will you charge|exact (price|rate|quote)/.test(lower) && best.id !== "specific-quote") {
      best = found.alternatives.filter(function (c) { return c.id === "specific-quote"; })[0] || best;
      lead = best.answer;
    }
    if (/five trucks|5 trucks/.test(lower)) {
      lead = "For five trucks of ordinary equipment, the published fleet-size band is 4% (the 4–6 truck row). Time in business and safety score can add a bit more, so that 4% is not a finished quote. " + (best.id === "pricing" ? "" : best.answer);
    }

    var follow = " I can also point you to the page this comes from.";
    if (best.id === "pricing" || best.id === "specific-quote") follow = " If you would rather have a person run the numbers for your authority, I can send the team a note.";
    return reply(lead + follow, {
      links: link(best),
      escalate: best.id === "specific-quote" || best.id === "contact",
      topic: best.id,
      keywords: best.keywords.slice(0, 6).join(" ")
    });
  }

  return { compose: compose };
});
