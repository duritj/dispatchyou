const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
for (const name of fs.readdirSync(root)) {
  if (!name.endsWith(".html")) continue;
  const file = path.join(root, name);
  const before = fs.readFileSync(file, "utf8");
  const after = before.replace(/or call the desk/g, "or email the desk");
  if (after !== before) fs.writeFileSync(file, after);
}
console.log("done");
