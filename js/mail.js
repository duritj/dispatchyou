/* Shared mail payload builder. Recipients are never accepted from the caller. */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.DispatchMailCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  var BANNED = {
    to: 1, cc: 1, bcc: 1, recipient: 1, recipients: 1,
    to_email: 1, email_to: 1, destination: 1, user_id: 1, service_id: 1, template_id: 1
  };
  var LIMITS = { name: 80, email: 120, phone: 40, message: 2000, note: 800, question: 800, job: 80, mc: 24, dot: 24, linkedin: 200 };
  var PAGES = {
    home: "Home",
    "index.html": "Home",
    "about.html": "About",
    "services.html": "Services",
    "solutions.html": "Solutions",
    "pricing.html": "Pricing",
    "contacts.html": "Contact",
    "careers.html": "Careers",
    "blog.html": "Blog",
    "trucking-companies.html": "Trucking companies",
    "owner-operators.html": "Owner-operators",
    "trailer-types.html": "Trailer types",
    "dry-van.html": "Dry van",
    "reefer.html": "Reefer",
    "flatbed.html": "Flatbed",
    "step-deck.html": "Step deck",
    "conestoga.html": "Conestoga",
    "car-hauler.html": "Car hauler"
  };

  function clean(value, max) {
    return String(value == null ? "" : value).replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
  }

  function readableTime(value) {
    var d = new Date(value);
    if (isNaN(d.getTime())) return clean(value, 40);
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    function two(n) { return (n < 10 ? "0" : "") + n; }
    return d.getUTCDate() + " " + months[d.getUTCMonth()] + " " + d.getUTCFullYear() + ", " + two(d.getUTCHours()) + ":" + two(d.getUTCMinutes()) + " UTC";
  }

  function readablePage(value) {
    var key = clean(value, 120).replace(/^\//, "");
    return PAGES[key] || key.replace(/\.html$/, "").replace(/-/g, " ");
  }

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= LIMITS.email;
  }

  function buildPayload(fields) {
    var src = fields || {};
    var email = clean(src.email, LIMITS.email).toLowerCase();
    if (!isEmail(email)) {
      var err = new Error("Enter a valid email address.");
      err.code = "invalid";
      throw err;
    }
    var name = clean(src.name, LIMITS.name);
    if (name.length < 2) {
      var nameErr = new Error("Enter your name.");
      nameErr.code = "invalid";
      throw nameErr;
    }
    var note = clean(src.message || src.note || src.question, 2000);
    if (note.length > 8000) {
      var longErr = new Error("That message is too long.");
      longErr.code = "invalid";
      throw longErr;
    }
    var payload = {
      subject: clean(src.subject, 140) || "DispatchYou website inquiry",
      from_name: name,
      reply_to: email,
      message: note,
      visitor_note: note,
      page: readablePage(src.page),
      source: clean(src.source, 80) || "Website form",
      sent_at: readableTime(src.sent_at)
    };
    ["equipment", "trucks", "months", "phone", "mc", "dot", "job", "linkedin"].forEach(function (key) {
      var val = clean(src[key], LIMITS[key] || 120);
      if (val && val.indexOf("[object ") !== 0) payload[key] = val;
    });
    if (src.sms === "on" || src.sms === "true" || src.sms === "yes") payload.text_updates = "Yes";
    return payload;
  }

  return { buildPayload: buildPayload, isEmail: isEmail, clean: clean, BANNED: BANNED };
});
