/* Client-visible EmailJS ids only. Never put a private key or a recipient address here.
   Both inboxes are set inside the EmailJS template (To + CC/BCC), not in this file. */
window.DISPATCHYOU_PUBLIC = {
  emailjsPublicKey: "7W84f1nI9d0tmzh4I",
  emailjsServiceId: "dispatchyou_serviceId01",
  emailjsTemplateId: "template_7tawv9j",
  /* Same-origin path only, for example "/api/chat". Empty uses the local composer. */
  inferenceEndpoint: "/api/chat",
  canonicalOrigin: "https://dispatchyouweb.vercel.app"
};
