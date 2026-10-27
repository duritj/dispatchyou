const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const phone = '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" fill="none" stroke="#2C6B32" stroke-width="1.6" stroke-linejoin="round"/></svg>';
const mail = '<svg viewBox="0 0 24 24" width="22" height="22"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="#2C6B32" stroke-width="1.6"/><path d="M4 7l8 6 8-6" fill="none" stroke="#2C6B32" stroke-width="1.6"/></svg>';
const label = "<small>Need help? Call us</small>";
const next = '<small>Need help?</small>\n          <a href="mailto:duriyodtj@gmail.com">duriyodtj@gmail.com</a>';
let n = 0;
for (const name of fs.readdirSync(root)) {
  if (!name.endsWith(".html")) continue;
  const file = path.join(root, name);
  let t = fs.readFileSync(file, "utf8");
  if (!t.includes(label)) continue;
  if (!t.includes(phone)) throw new Error("phone icon missing in " + name);
  t = t.replace(phone, mail).replace(label, next);
  fs.writeFileSync(file, t);
  n++;
}
console.log("faq help updated", n);
