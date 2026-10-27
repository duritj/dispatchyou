const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
for (const name of fs.readdirSync(root)) {
  if (!name.endsWith(".html")) continue;
  const file = path.join(root, name);
  let t = fs.readFileSync(file, "utf8");
  const before = t;
  t = t.replace(/by phone, email or/g, "by email or");
  t = t.replace("or pick up the phone and a real person will answer.", "or email duriyodtj@gmail.com and a person will reply.");
  t = t.replace("or give us a call.", "or email duriyodtj@gmail.com.");
  t = t.replace("or call us.", "or email duriyodtj@gmail.com.");
  if (t !== before) fs.writeFileSync(file, t);
}
console.log("phrases updated");
