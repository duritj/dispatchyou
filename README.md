# Dispatch website

Static marketing website for a US truck dispatch company. Plain HTML, CSS and
JavaScript: no build step, no framework, no dependencies besides the Inter font
from Google Fonts.

## Pages

| Area | Files |
|---|---|
| Home | `index.html` |
| Company | `about.html`, `careers.html`, `contacts.html`, `blog.html` |
| Services | `services.html`, `trucking-companies.html`, `owner-operators.html`, `trailer-types.html` |
| Equipment | `dry-van.html`, `reefer.html`, `step-deck.html`, `flatbed.html`, `conestoga.html`, `car-hauler.html` |
| Solutions and pricing | `solutions.html`, `pricing.html` |
| Legal | `terms.html`, `privacy.html`, `cookies.html` |

## Structure

- `styles.css` holds the shared design tokens, header, navigation, footer,
  buttons, cards, cookie bar and scroll-reveal animations.
- `script.js` holds the shared behaviour: sticky header, mobile menu, scroll
  reveal, FAQ accordion, cookie bar and demo form handlers.
- `css/<page>.css` holds the styles that belong to one page or page family.
- The header, footer and cookie bar markup is identical on every page. Change
  it once and copy it to the others.

## Run locally

```bash
python -m http.server 5600
```

Then open <http://localhost:5600>.

## Before going live

- Replace the placeholder content: pricing rates, testimonials, team members,
  job postings, sample lanes and headline statistics.
- Have the three legal pages reviewed by a lawyer. They are generic templates.
- Connect the forms to a real backend or form service. They currently only
  show a confirmation message in the browser.
- Add real social profile links on the contacts page.
