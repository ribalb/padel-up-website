# Padel UP — website

A modern, bilingual (English / العربية) one-page site for **Padel UP**, the sports club in
Al Diriyah Al Jadidah, Riyadh. Plain HTML, CSS and JavaScript — no build step, no dependencies.

**Live:** <https://ribalb.github.io/padel-up-website/> (GitHub Pages, served from `main` / root —
every push to `main` redeploys within a minute or two).

```
padel up/
├── index.html              the site — lime accent (both languages live in data-en / data-ar attributes)
├── index-blue.html         same page, blue accent — a throwaway for comparing the two
├── assets/
│   ├── css/styles.css      design tokens + all styling
│   ├── css/theme-blue.css  accent overrides only, loaded on top by index-blue.html
│   ├── js/main.js          nav, language switch, reveals, counters, lightbox, WhatsApp form
│   └── img/                photos + favicon
└── README.md
```

**Pick a colour, then delete the loser.** `index-blue.html` and `theme-blue.css` exist purely so
you can compare. Once you've chosen: keep lime → delete both files; keep blue → copy the seven
token values out of `theme-blue.css` into the accent block in `styles.css`, then delete both
files. Don't ship both — two copies of the same page will drift apart and confuse search engines.

## Run it

Double-click `index.html`, or serve it locally so the map iframe behaves normally:

```bash
python -m http.server 8000     # then open http://localhost:8000
```

## What's on the page

Hero with live rating · sports overview (padel / football / table tennis) · amenities ·
3-step booking explainer · rates · photo gallery with lightbox · real Google reviews · booking
form that opens a pre-filled WhatsApp message · map, address and opening hours · FAQ · footer.

Extras baked in: sticky nav with scroll-spy, EN⇄AR toggle with full RTL flip (remembered in
`localStorage`, auto-selected from the browser language on first visit), scroll reveals,
animated stat counters, today's row highlighted in the hours table and the hero "opens at"
badge read off it (the club opens 4 PM Sun–Wed but 3 PM Thu–Sat), lazy-loaded responsive
images, floating WhatsApp button, `SportsActivityLocation` JSON-LD for Google, and
`prefers-reduced-motion` support.

## Photos

Six real photos of the club are in `assets/img/`, each at two widths (`-600` and `-1200`) as
WebP, wired up with `srcset` so phones download the small one:

| File | Used in |
| --- | --- |
| `courts-avenue` | hero background |
| `courts-wide` | gallery — "Courts after dark" |
| `mural` | gallery — "The Padel UP wall" |
| `net-detail` | gallery — "Racket & ball at the net" |
| `lounge` | gallery — "Seating area" |
| `reception` | gallery — "Reception & pro shop" |

They came from the Padel UP Google Business listing. Every one was checked for Padel UP
branding before use — a plain Maps *search* also surfaces photos from Padel.It and Padel Rush
nearby, and none of those are in here.

Two caveats worth knowing:

- Google Business photos are uploaded by a mix of the owner and visiting reviewers, and the
  reviewer ones stay the reviewer's copyright. For a site that represents the business, the
  safest version of this gallery is the club's **own** photography. If you have the originals,
  overwrite these files and you're done — the markup doesn't change.
- They're phone snapshots, not commissioned shots. A short evening shoot would lift this page
  more than any other single change.

To swap one out, replace both sizes (`name-600.webp` and `name-1200.webp`) keeping the
filenames, or edit the `<img>` in `index.html`. Clicking any gallery photo opens a lightbox
(arrow keys and Esc work).

## Before you publish — 3 things to fill in

Address, phone, plus code, 4.4★ / 261 reviews, the three quoted reviews and the opening hours
all come from the club's public Google listing and are accurate. These are not:

**1. Rates** — `index.html`, `<section id="rates">`, marked `TODO(owner)`.
The SAR figures (120 / 160 / 200) are illustrative. Replace the `<span class="num">` values
and the time windows in `.rate__when` with your real pricing.

**2. Amenity claims** — the six chips under the sports section (free parking, card & Apple Pay,
shade, snacks, late slots) are reasonable for a club like yours but unverified. Delete any that
don't apply.

**3. The domain.** `og:url`, `og:image` and `<link rel="canonical">` in `<head>` are absolute
URLs pointing at `ribalb.github.io`. They have to be absolute for WhatsApp/X link previews to
work, so if the site moves to a custom domain, update all three or the preview card breaks.

## Booking

Two routes, deliberately:

1. **Playtomic** — every "Book a court" / "Book this" / "Check availability" button goes to
   <https://playtomic.com/clubs/padel-up-riyadh> (the club's real system, listed as
   *Padel UP-Ad-Deriya*). The Instagram bio links to the tenant URL
   `playtomic.io/tenant/91b97f64-...`, which 308-redirects to that address — the site uses the
   canonical one so there's no redirect hop. It's also declared as a `ReserveAction` in the
   JSON-LD, which is what lets Google show a "Book" action.
2. **The WhatsApp form** — kept below the Playtomic card as the "or send us the details" route,
   for groups, coaching, corporate days and questions. Its copy now says plainly that it sends a
   message rather than a confirmed booking, so nobody turns up expecting a court.

If the Playtomic URL ever changes, it appears 10 times in `index.html` — find and replace.

## Still not on the site

From [@padel_up](https://www.instagram.com/padel_up/) (11.4K followers) — the club is a good
deal more than a place to rent a court:

- **Coaching, an academy, and corporate packages.** The page only sells court time.
- **Theeb Padel League 2026 champions**, a competitive team, a head coach and named players.
  That's a strong trust section the page is missing entirely.
- The **½M / Half Million** partnership.

## Changing the accent colour

Every accent in the page — buttons, the gradient headline, ticks, badges, focus rings, glows,
hover tints — resolves from seven tokens in the accent block at the top of `styles.css`. Nothing
is hardcoded, so a re-skin is those seven lines and nothing else. `theme-blue.css` is exactly
that block, overridden:

```css
--accent:      #3b82ff;      /* primary accent */
--accent-hi:   #5c99ff;      /* lightened, for :hover */
--accent-dim:  #2563eb;      /* darkened */
--accent2:     #67e8f9;      /* gradient partner */
--accent-rgb:  59,130,255;   /* --accent as rgb, for rgba() tints */
--accent2-rgb: 103,232,249;
--on-accent:   #ffffff;      /* text on an accent fill — white on blue, near-black on lime */
```

`--on-accent` is the one to watch: dark ink reads on lime, white reads on blue. Get that wrong
and every primary button loses its contrast.

## Contact details

The phone number appears in four places and the WhatsApp number in five. If it changes, update:

- `index.html` — `tel:` links, the visible number, `wa.me/966506940479` links, and `"telephone"` in the JSON-LD
- `assets/js/main.js` — the `WHATSAPP` constant at the top (digits only, with country code)

## Publishing

It's a static site, so anything works. The quickest free options:

- **Netlify** — drag the whole folder onto <https://app.netlify.com/drop>
- **Cloudflare Pages / GitHub Pages** — push the folder to a repo and point the service at it
- **Any shared host** — upload via FTP to `public_html/`

Once it's live, add the URL to the Google Business Profile (the listing currently shows
"Add website") — that link is the main reason to have this page.

## Editing text

Every translated string carries both languages on the same element:

```html
<h3 data-en="Padel courts" data-ar="ملاعب البادل">Padel courts</h3>
```

The visible text is the English fallback for anyone with JavaScript off. When you edit copy,
change all three: the `data-en` attribute, the `data-ar` attribute, and the inner text.

## Browser support

Modern evergreen browsers (Chrome, Edge, Safari, Firefox) on desktop and mobile. The layout uses
CSS logical properties so the RTL flip needs no separate stylesheet.
