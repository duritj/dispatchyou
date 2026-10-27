# Dispatch website

Static marketing website for a US truck dispatch company. Plain HTML, CSS and
JavaScript: no build step and no framework. Type is Instrument Sans and
Instrument Serif from Google Fonts.

## Pages

Twenty HTML pages. Home, about, careers, contacts, blog, services,
trucking companies, owner-operators, trailer types, six equipment pages,
solutions, pricing, and three legal pages.

## Structure

- `styles.css` holds the shared tokens, header, navigation, footer, buttons, cards, cookie bar, and scroll reveals.
- `script.js` holds the sticky header, mobile menu, scroll reveal, FAQ accordion, cookie bar, and chat launcher.
- `forms.js` sends inquiries through EmailJS after the provider accepts them. It does not show success when email is not configured.
- `js/chat.js` is a website assistant. Retrieval and wording are separate from an optional same-origin inference route.
- `css/<page>.css` holds styles for one page or page family.
- The header and footer markup is repeated on every page.

## Run locally

```bash
python -m http.server 5600
```

Then open <http://localhost:5600>.

```bash
node --test tests/chat.test.js tests/content.test.js
```

## Before going live

- Create a free EmailJS account and paste the public service id, template id, and public key into `js/public-config.js`. In the template, set To and CC/BCC to the two business inboxes. Do not put those addresses in the browser request. See `docs/MODERNIZATION.md`.
- The footer does not collect newsletter subscriptions. There is no mailing list.
- Testimonial cards are labeled illustrative examples until the business supplies real reviews.
- The homepage average weekly gross of $7,000+ is a requested marketing figure and is not sourced in this repository.
- Have the three legal pages reviewed by a lawyer. They are generic templates.
- Optional natural-language rewrite of chat answers needs server environment variables on the host. Without them, the on-site composer answers from the site's own content.
