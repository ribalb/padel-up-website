# Padel UP — website

A modern, bilingual (English / العربية) one-page site for **Padel UP**, the sports club in
Al Diriyah Al Jadidah, Riyadh. Plain HTML, CSS and JavaScript — no build step, no dependencies.

**Live:** <https://ribalb.github.io/padel-up-website/> (GitHub Pages, served from `main` / root —
every push to `main` redeploys within a minute or two).

```
padel up/
├── index.html              the whole site (both languages live in data-en / data-ar attributes)
├── assets/
│   ├── css/styles.css      design tokens + all styling
│   ├── js/main.js          nav, language switch, reveals, counters, lightbox, WhatsApp form
│   └── img/                photos, logo, favicon
└── README.md
```

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
`localStorage`), scroll reveals,
animated stat counters, today's row highlighted in the hours table and the hero "opens at"
badge read off it, lazy-loaded responsive
images, floating WhatsApp button, `SportsActivityLocation` JSON-LD for Google, and
`prefers-reduced-motion` support.

## Logo

`assets/img/logo.png` (160px) and `favicon.png` (64px) were extracted from the logo artwork:
cropped to the badge circle, masked round so the corners are transparent, and one row of stray
dashed rule healed out of the bottom. The badge is used as the nav and footer mark and as the
favicon. If you have the original vector, an SVG would be sharper — drop it in and swap the two
`<img>` references plus the `<link rel="icon">`.

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

## Pricing — where the numbers came from, and the catch

Every figure in the Rates section is the club's own published pricing, transcribed from the
Instagram story highlights (`الباقات`). Nothing is invented:

- **Court packages** — 60 min: 10 for 2,500 SAR (250 each), 20 for 4,600 SAR (230 each).
  90 min: 10 for 3,200 SAR (320 each), 20 for 5,900 SAR (295 each).
- **Private coaching**, 60 min — 1 player 380 SAR; 2 players 200 each; 3 players 150 each;
  4 players 130 each.
- **Group coaching** — 3 players: 5 sessions 700 SAR/player, 10 sessions 1,300 SAR/player.
  4 players: 5 sessions 700 SAR/player, 10 sessions 1,200 SAR/player.

**The catch: those highlights were posted ~183 weeks ago — roughly three and a half years.**
They are the club's real prices, but they may well be out of date. Check them before you point
customers here. The working-hours highlight is far newer (~10 weeks), so it is more trustworthy.

There is deliberately **no single-court walk-up rate on the page.** The stories don't give one,
and the package prices only imply a per-booking floor. Rather than guess, the section ends with
a link to Playtomic, which carries live prices and availability.

## Opening hours — a conflict you should resolve

Two sources disagree:

| Source | Hours |
| --- | --- |
| Instagram story highlight (`أوقات العمل`, ~10 weeks old) | **3:00 PM – 3:00 AM, every day** |
| Google Business listing (read today) | 4 PM–3 AM Sun–Wed, 3 PM–4 AM Thu–Sat |

The site uses the Instagram version, on the grounds that it's the club stating its own hours
rather than a listing that may have drifted. If Google is the correct one, update the `<tbody>`
in `<section id="visit">`, the `data-opens` attribute on each row, and the
`openingHoursSpecification` in the JSON-LD. Either way it's worth fixing the Google listing so
the two agree — it's the first thing most customers see.

## Still to verify

**Amenity claims** — the six chips under the sports section (free parking, card & Apple Pay,
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

From [@padel_up](https://www.instagram.com/padel_up/) (11.4K followers):

- **Theeb Padel League 2026 champions**, a competitive team, a head coach and named players.
  That's a strong trust section the page is missing entirely.
- **Corporate packages** are advertised in the bio but have no published rates, so there's
  nothing to put on the page yet.
- The **½M / Half Million** partnership.

Coaching and the academy *are* now covered, via the Rates section.

## Colour

The palette is sampled from the club logo, not guessed. Reading the logo PNG pixel by pixel:
the badge sits on a near-black navy `#000014`, the swoosh is `#001466`, the type is white.

`#001466` cannot be used as an accent — on a near-black page it's invisible. So `--accent` keeps
the logo's hue (229°) and lifts the lightness until it carries. The literal logo blue is kept as
`--accent-deep` for fills that sit behind text.

There are **two** accent values on purpose, and this is the part to not "simplify" later:

| Token | Value | Contrast | For |
| --- | --- | --- | --- |
| `--accent` | `#3358ff` | **5.28:1** with white on top | button and badge *fills* |
| `--accent-text` | `#7f9cff` | **7.76:1** on the page ground | accent used *as text* or icons |

`--accent` as text on the navy only reaches 3.81:1, which fails WCAG AA for body-size text — so
every `color:` use points at `--accent-text` instead. Collapsing the two back into one will fail
accessibility at one end or the other, whichever you pick.

Everything else — the gradient headline, ticks, focus rings, glows, hover tints — resolves from
the same token block, so a re-skin is that block and nothing else.

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

## Language

**The site opens in Arabic.** That is baked into the served markup, not applied by JavaScript:
`<html lang="ar" dir="rtl">` and every element's visible text is the Arabic one. So the first
paint is already Arabic and right-to-left — there is no flash of English, and it stays correct
with JavaScript disabled.

Every translated string carries both languages on the same element:

```html
<h3 data-en="Padel courts" data-ar="ملاعب البادل">ملاعب البادل</h3>
```

The toggle swaps `lang`/`dir` and rewrites the text from these attributes; the choice is stored
in `localStorage`, so a visitor who picks English keeps English on their next visit. Form
placeholders use the same pattern with `data-ph-en` / `data-ph-ar`.

**When editing copy, change all three:** the `data-en` attribute, the `data-ar` attribute, and
the inner text (which must stay identical to `data-ar`). If the inner text and `data-ar` drift
apart, the page will visibly change the moment JavaScript runs.

The three Google reviews are a deliberate exception: the Arabic original is always shown, and
the English translation beneath it carries `hidden` and is revealed only in English mode.

The layout needs no separate RTL stylesheet — it uses CSS logical properties throughout, so the
whole page mirrors from the `dir` attribute alone.

## Browser support

Modern evergreen browsers (Chrome, Edge, Safari, Firefox) on desktop and mobile. The layout uses
CSS logical properties so the RTL flip needs no separate stylesheet.
