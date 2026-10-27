const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const mail = require("../js/mail.js");

const root = path.join(__dirname, "..");

test("payload rejects bad email and strips recipient fields", () => {
  assert.throws(() => mail.buildPayload({ name: "A", email: "nope" }));
  const payload = mail.buildPayload({
    name: "Ari Lane",
    email: "ari@example.com",
    to: "evil@example.com",
    cc: "also-evil@example.com",
    bcc: "hidden@example.com",
    to_email: "nope@example.com",
    message: "Need a call",
    source: "Website form"
  });
  assert.equal(payload.reply_to, "ari@example.com");
  assert.equal(Object.hasOwn(payload, "to"), false);
  assert.equal(Object.hasOwn(payload, "cc"), false);
  assert.equal(Object.hasOwn(payload, "bcc"), false);
  assert.equal(Object.hasOwn(payload, "to_email"), false);
  assert.match(payload.message, /Need a call/);
});

test("site copy and structure", () => {
  const htmlFiles = fs.readdirSync(root).filter((n) => n.endsWith(".html"));
  assert.equal(htmlFiles.length, 20);
  const index = fs.readFileSync(path.join(root, "index.html"), "utf8");
  assert.match(index, /Budget-friendly dispatching with <em>high-paying loads<\/em>/);
  assert.match(index, /We're here to build lasting partnerships, since we only succeed when you do\. Squeeze the most value out of every mile with our help\./);
  assert.match(index, /data-count="7000"/);
  assert.doesNotMatch(index, /\$8,000/);
  assert.doesNotMatch(index, /id="newsForm"/);
  assert.match(index, /does not run a newsletter/);
  const joined = htmlFiles.map((n) => fs.readFileSync(path.join(root, n), "utf8")).join("\n");
  const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
  assert.equal(/\.site-header\.scrolled\s*\{[^}]*height\s*:/.test(css), false);
  assert.equal(joined.includes("tel:+15513094943"), false);
  assert.equal(joined.includes("office@dispatchyou.com"), false);
  assert.match(joined, /7tjduri@gmail.com/);
  assert.equal(joined.includes("Add-on service rates"), false);
  assert.equal(joined.includes("Head office"), false);
  assert.equal(joined.includes("Now in Missouri"), false);
  assert.equal(joined.includes("Need help?"), false);
  assert.equal(joined.includes("or call."), false);
  const chat = fs.readFileSync(path.join(root, "js", "chat.js"), "utf8");
  assert.match(chat, /What does DispatchYou do\?/);
  assert.match(chat, /7tjduri@gmail\.com/);
  assert.equal(chat.includes("551"), false);
  assert.equal(chat.includes("office@dispatchyou.com"), false);
  assert.equal(joined.includes("photo--desk"), false);
  assert.equal(/Ironline|Valeo Carriers|Northline Freight|Vega Carriers/.test(joined), false);
  const photos = fs.readFileSync(path.join(root, "css", "photos.css"), "utf8");
  assert.equal(/\.about-intro \.office\s*\{[^}]*background-image/.test(photos), false);
  assert.equal(/\.photo--desk\s*\{[^}]*documents\.jpg/.test(photos), false);
  assert.match(photos, /hero-highway\.jpg/);
  const forms = fs.readFileSync(path.join(root, "forms.js"), "utf8");
  assert.equal(/to_email|template_params\.to\b|bcc:/.test(forms), false);
  const blog = fs.readFileSync(path.join(root, "blog.html"), "utf8");
  ["dispatcher-vs-broker", "semi-truck-safety-habits", "ifta-reporting-basics", "dispatcher-salary-guide"].forEach((id) => {
    assert.match(blog, new RegExp('id="' + id + '"'));
    assert.match(blog, new RegExp('href="blog.html#' + id + '"'));
  });
});
