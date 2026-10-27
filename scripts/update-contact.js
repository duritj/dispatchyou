const fs = require("fs");
const path = require("path");

function walk(dir, acc) {
  for (const name of fs.readdirSync(dir)) {
    if (name === "node_modules" || name === "images" || name === ".git") continue;
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, acc);
    else if (/\.(html|js|md)$/.test(name)) acc.push(full);
  }
  return acc;
}

let count = 0;
for (const file of walk(path.join(__dirname, ".."), [])) {
  let text = fs.readFileSync(file, "utf8");
  const before = text;
  text = text.replace(/office@dispatchyou\.com/g, "7tjduri@gmail.com");
  text = text.replace(/\s*<a href="tel:\+15513094943">[\s\S]*?<\/a>/g, "");
  text = text.replace(/<p>Send a text or give us a call at \(551\) 309-4943\.<\/p>\s*/g, "");
  text = text.replace(/<p>Text or call us at \(551\) 309-4943\.<\/p>\s*/g, "");
  text = text.replace(/\s*"telephone": "\+1-551-309-4943",?\r?\n/g, "\n");
  text = text.replace(/<div><small>Address<\/small>Missouri, USA<\/div>\s*/g, "");
  text = text.replace(/Call \(551\) 309-4943 or write to /g, "Write to ");
  text = text.replace(/, or call \(551\) 309-4943 or /g, " or ");
  if (text !== before) {
    fs.writeFileSync(file, text);
    count += 1;
  }
}
console.log("updated", count);
