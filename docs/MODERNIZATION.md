# DispatchYou modernization record

Working notes for this branch. The public site structure stays. Orange brand accents are replaced by the light-green tokens in `styles.css`.

## Email

EmailJS free tier, confirmed from the pricing page during this work (October 2026):

- $0, no card
- 200 requests per month
- 2 templates, 50KB per request
- CC and BCC included on the free plan
- Requests past the cap are dropped, not billed
- Domain whitelist is on the paid Personal plan, so this site does not depend on it

Recipients are fixed in the EmailJS template, not in browser parameters:

- To: duriyodtj@gmail.com
- CC or BCC: azizbek.dev.ac@gmail.com

Set the template Reply-To to `{{reply_to}}`. Client config in `js/public-config.js` holds only the public key, service id, and template id. Empty values must keep forms in the failure state.

Mailbox delivery is not verified in this repository. There is no EmailJS account configured here.

## Chat

`js/retrieve.js` scores site chunks. `js/compose.js` writes the reply. `js/infer.js` may call a same-origin `inferenceEndpoint` and will discard an answer that adds dollar amounts the evidence does not contain. The default endpoint is empty, so the composer is what visitors get.

`api/chat.js` is an optional Vercel route. It runs only when `LLM_API_KEY`, `LLM_BASE_URL`, and `LLM_MODEL` are set on the server. Those are not in the repo. Without them the route returns 503 and the page keeps the composer.

## Content flags

- Hero copy and `$7,000+` average weekly gross match the requested wording. The gross figure has no source in the repo.
- Other published statistics were left as they were.
- Add-on rate cards were removed from pricing. Other mentions of billing, paperwork, and after-hours support stay.
- About intro image and the solutions desk image are removed. Other photographs stay.
- Testimonials are illustrative examples, not customer reviews.
- The footer is not a newsletter signup.

## Checks

`node --test tests/chat.test.js tests/content.test.js`
