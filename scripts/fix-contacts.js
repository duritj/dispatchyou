const fs = require("fs");
const p = "D:/Workplace/Web/dispatchyou/contacts.html";
let t = fs.readFileSync(p, "utf8");
const a = t.indexOf("    <!-- map placeholder -->");
const b = t.indexOf('      <div class="office reveal delay-1">');
if (a < 0 || b < 0) throw new Error("markers " + a + " " + b);
t = t.slice(0, a) + t.slice(b);
t = t.replace(
  'content="Reach the DispatchYou team by phone, email or the contact form. Missouri-based dispatch support for carriers and owner-operators."',
  'content="Reach the DispatchYou team by email or the contact form."'
);
t = t.replace('<h2 class="contact__title">Reach us directly</h2>', '<h2 class="contact__title">Email the desk</h2>');
t = t.replace('href="#" aria-label="Facebook"', 'href="https://www.facebook.com/profile.php?id=61595350131151&amp;mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook"');
t = t.replace('href="#" aria-label="Instagram"', 'href="https://www.instagram.com/dispatchyou/" target="_blank" rel="noopener noreferrer" aria-label="Instagram, @dispatchyou"');
t = t.replace(/\s*<a href="#" aria-label="LinkedIn">[\s\S]*?<\/a>/, "");
t = t.replace(
  "<p>The desk is staffed Monday to Friday, 7:00 to 19:00 CT, with an after-hours line for weekend loads and emergencies.</p>",
  "<p>The desk is staffed Monday to Friday, 7:00 to 19:00 CT, with after-hours coverage for weekend loads and emergencies.</p>"
);
t = t.replace(
  '<span class="office__meta"><i class="office__dot" aria-hidden="true"></i> Now in Missouri: <b class="office__clock" id="moClock">--:--</b></span>',
  '<span class="office__meta">Central Time (CT)</span>'
);
t = t.replace(
  "<p>Emails are answered within one business hour and calls are picked up in seconds. Urgent load issues jump the queue.</p>",
  "<p>Emails are answered within one business hour. Urgent load issues jump the queue.</p>"
);
if (t.includes("Head office") || t.includes("contact__map")) throw new Error("office content remains");
fs.writeFileSync(p, t);
console.log("contacts updated");
