# LCC Website — Project Briefing

## Working Directory
`C:\Users\Darius\Desktop\Claude Projects\LCC website\`
> There is a duplicate folder at `C:\Users\Darius\Claude Projects\` — always use the Desktop path.

---

## About the Club
**Laurier Consulting Club (LCC)** — business club at Wilfrid Laurier University.
- Hosts networking mixers, workshops, and its own case competitions
- **Pro-Bono arm: Laurier Consulting Group (LCG)** — teams of 6 students + real company clients + consulting firm mentors
- No membership gate — all events are open to any Laurier student
- Run by a 35+ person executive team

---

## Tech Stack
- **Next.js 16.3.2** (Turbopack) with **TypeScript** and **React**
- **GSAP 3** — hero entrance and mouse parallax only (the scroll-triggered heading
  and card reveals were deliberately removed; the user does not want them back)
- **Google Fonts** via CDN (Anton, Poppins, Playfair Display)
- **Font Awesome** via cdnjs, used only by the About value icons and Events meta icons
- Mobile responsive, verified at 375/390/430/768/834/1024/1440/1920/2560
- Dev server runs on **http://localhost:3000**

**Runtime dependencies are only `gsap`, `next`, `react`, `react-dom`.** Tailwind was
removed (it was imported but had zero utility classes in use). `three` and `ogl` were
each added for a React Bits component and then removed again. Every visual effect on
the site is hand-written CSS/DOM — do not assume a library is behind one.
`npm audit` is clean; keep it that way.

## Things that will look like bugs but are deliberate
- `SHEET_URL` in `page.tsx` is public. It ships in any client bundle regardless,
  which is why enforcement lives in `docs/apps-script.gs`, not here.
- Signup validation is duplicated between `page.tsx` and `docs/apps-script.gs`. The
  client copy is for inline errors only; the Apps Script is what enforces.
- The signup form shows success even for rejected bots, so they get no signal.
- Card `:hover` rules were removed from cursor-target cards on purpose. Their lift
  transforms moved the card after `SiteCursor` measured it, so the frame missed.
- `.navbar` must NOT have `padding-right: var(--scrollbar-width)`. `scrollbar-gutter:
  stable` already reserves that space; padding again shifts the navbar 4px left.
- The modal-init effect in `page.tsx` has a `didInitModal` ref guard. Without it,
  StrictMode's second dev pass reads the sessionStorage flag the first pass wrote and
  starts the hero animation behind the modal.
- The particle canvas is gated on `heroReady` for the same reason.
- The rate limit in `docs/apps-script.gs` guards the `appendRow` call, NOT the top of
  `doPost`. Moving it back up means junk requests spend the budget that real signups
  need, and because the form always reports success and posts `no-cors`, those lost
  signups are undetectable by anyone.
- `styles.css` has a narrow `cursor: auto` rule for inputs that deliberately overrides
  the broad `cursor: none`. Without it you type into the signup form with a dot where
  the I-beam belongs.
- `CountUp` returns early when the stat is already on screen at mount, so it shows the
  real number instead of animating. This is not a broken animation: counting up from
  zero when the server already painted "10+" reads as a flick to "0+" and back.
- `LCGLogoTilt` is gated on `IntersectionObserver`. It looks like an unnecessary
  guard on a always-visible element, but the teaser sits far down a long page.

---

## File Structure
```
LCC website/
├── src/
│   ├── app/
│   │   ├── page.tsx          ← Home page (modal, hero, sponsors, offerings, LCG teaser, contact)
│   │   ├── about/page.tsx    ← About Us page
│   │   ├── events/page.tsx   ← Events page
│   │   ├── lcg/page.tsx      ← LCG page (full feature)
│   │   ├── contact/page.tsx  ← Contact page
│   │   ├── layout.tsx        ← Root layout (fonts, metadata, SiteCursor mount)
│   │   ├── globals.css       ← One line: @import of the real stylesheet
│   │   ├── icon.png          ← Favicon
│   │   └── opengraph-image.png ← Social preview card
│   └── components/
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       ├── HeroBackground.tsx
│       ├── PageAnimations.tsx
│       ├── LCGTilesToggle.tsx
│       ├── EventCoverGraphic.tsx
│       ├── CountUp.tsx       ← Stat counters, IntersectionObserver + rAF
│       ├── LCGLogoTilt.tsx   ← Teaser mark tilts toward the pointer
│       └── SiteCursor.tsx    ← Dot + frame that locks to large cards
├── docs/
│   └── apps-script.gs        ← Source of truth for the mailing-list endpoint
├── public/
│   ├── Event Sponsorships/   ← Sponsor logo images
│   └── LCC Brand Kit/        ← Logos, colours, fonts, examples
├── styles.css                ← ALL styles live here (1796 lines)
├── HOSTING-AND-HANDOFF.md
└── CLAUDE.md
```

`src/app/globals.css` is just `@import url('../../styles.css')`. Edit `styles.css`,
never `globals.css`.

---

## Brand Colours (HEX)
| Role | HEX |
|---|---|
| Primary navy | #214162 |
| Deep navy | #0b2337 |
| Darkest navy (bg) | #081b2b |
| Light blue accent | #cfddff |
| Pale blue | #e2f1ff |
| Soft blue | #cedcfe |

---

## Fonts
- **Anton** — heavy display headlines
- **Poppins 300/400/600/700/800** — UI, subheadings, body, buttons
- **Playfair Display Bold / Italic** — elegant serif accent

---

## Key Logos (in public/LCC Brand Kit/)
- `Laurier Consulting Club (Full Logo - White).png` — navbar, footer (dark bg)
- `Laurier Consulting Club (FULL LOGO).png` — colour version (light bg)
- `Laurier Consulting Group (LCG) (Full Logo).png` — white/outline, LCG sections
- `Laurier Consulting Club (Image Only - White).png` — icon only

---

## Design Principles
- Dark deep-navy (#081b2b) base background
- Diagonal thin line pattern overlay on hero sections (CSS repeating-linear-gradient)
- Radial gradient from #214162 → #081b2b for hero/accent backgrounds
- Bold Anton for all major headings
- White + #cfddff for text on dark backgrounds
- Card design: rgba(33,65,98,0.22) bg + 1px subtle border + hover top accent line (blue gradient)
- All cards use `display: flex; flex-direction: column` for consistent internal alignment

---

## Navbar
- Pages: Home, Events, About Us, LCG, Contact (in that order)
- Fixed navbar with `.scrolled` class added after 20px scroll (background darkens)
- Mobile: hamburger toggle opens `.nav-links` with `.open` class
- Scrollbar gutter fix: `useEffect` measures scrollbar width and sets `--scrollbar-width` CSS variable

---

## Homepage (page.tsx) — Section Order
1. **Mailing List Modal** — shown once per session before hero animations run
2. **Hero** — particle canvas, animated title lines, mouse parallax on background
3. **Who We Are** (`#about-club`) — text left, 2×2 stat cards right
4. **Our Sponsors** (`#sponsors`) — spotlight/flashlight grid (grayscale → colour on mouse hover)
5. **What We Offer** (`#offerings`) — 4-column card grid (section label: "Get Involved")
6. **LCG Teaser** (`#lcg-teaser`) — two-column: text + logo, links to /lcg
7. **Contact & Socials** (`#contact`) — contact cards (Instagram, LinkedIn, Email)
8. **Footer**

---

## Who We Are — Stats
| Stat | Label |
|---|---|
| 10+ | Years Running |
| 35+ | Executive Team |
| 7+ | Events Per Year |
| 12+ | Yearly LCG Engagements |

---

## Sponsors Grid
- Spotlight/flashlight effect: cards start grayscale, reveal colour as mouse approaches
- Cards also lift slightly (`translateY`) and gain a box-shadow on hover proximity
- Uses `IntersectionObserver` to activate only when section is in view
- **Current order (prestige):** McKinsey, Bain, BCG, Monitor Deloitte, EY, IBM, KPMG, Mastercard, Accenture, Mercer
- **Image files** (in `public/Event Sponsorships/`): `mckinsey.png`, `bain.png`, `bcg.png`, `monitor deloitte.png`, `ey.png`, `ibm.png`, `kpmg.png`, `mastercard.png`, `accenture.png`, `mercer.png`
- Heights set per-logo inline to normalize visual size
- **Card background is WHITE (#ffffff)** as of 2026-07-19 (classic sponsor-wall look; the
  JS spotlight animation only drives filter/transform, so it is unaffected). The KPMG logo's
  four outlined squares are part of the real KPMG mark, not an artifact.

---

## What We Offer — Cards
(01-04 number labels REMOVED 2026-07-19: the cards are not a sequence, icons + titles
carry the differentiation.)
| Title | Icon |
|---|---|
| Networking Mixers | Person silhouette |
| Workshops | Document with lines |
| Case Competitions | Star shape |
| Pro-Bono Consulting | Briefcase |

The Pro-Bono Consulting card has a "↓ See below ↓" footer element (`.offering-see-below`)
pinned to the bottom via `margin-top: auto`.

LCC **hosts** its own case competitions — it does not send members out to external ones.

---

## Mailing List Modal
- Lives in `src/app/page.tsx`
- Triggers once per browser **session** (`sessionStorage` key `lcc_modal_seen`) — reappears on fresh tab
- Pre-hides hero elements with `gsap.set()` so nothing flashes behind the modal
- On dismiss/skip/subscribe: fades out (380ms), then `runAnimations()` fires
- Dismiss button copy is "Not now" (2026-07-19; the old "No thanks, I'll miss out" was
  confirmshaming and off-brand)
- **Google Sheets integration**: `SHEET_URL` constant at top of `page.tsx` — uses `fetch` POST with `mode: 'no-cors'`, body is `JSON.stringify({ name, email })`. Leading
  formula characters (= + - @) are stripped from name/email before posting (spreadsheet
  formula-injection defense); the Apps Script should also quote-prefix values.
- Apps Script deployment must be: **Execute as: Me**, **Who has access: Anyone** (fully public, not "Anyone with a Google account")
- Form fields: Full Name, Email Address
- **Focus management**: opens focused on the name field, traps Tab and Shift+Tab inside
  `.modal-card`, closes on Escape, and hands focus back on dismiss. Without the trap,
  Tab walks out into the hero behind the modal, which is still in the tab order.
- **Client validation mirrors `rejectionReason_()` in the Apps Script** via
  `isStructurallyClean()`. Keep them in sync: anything the client accepts and the
  server rejects becomes a silent drop, because the form always shows success. A
  parity check over 18 inputs is the cheap way to verify a change here.
- `MODAL_FADE_MS` must match the `.modal-closing` fade duration in `styles.css`.

---

## GSAP Animations (page.tsx)
All animations live in `runAnimations()`, called after modal dismisses (or on load if modal already seen).

- `initHeadingAnimations()` — section titles/labels/subtitles animate on scroll via ScrollTrigger
- `initCardStagger()` — staggered `y: 28` fade-up on grid/card containers
- `initHeroEntrance()` — uses `gsap.fromTo()` (NOT `gsap.from()`) with explicit TO state. Critical — `gsap.from()` breaks after `gsap.set()` pre-hides elements.
- `initMouseParallax()` — moves `.hero-bg-pattern` with mouse position

---

## Placeholder Content — Still Needs Real Content
(Updated 2026-07-19: About mission/values, Events real content, and Contact department
emails are DONE. Remaining:)
| Section | What's needed |
|---|---|
| LCG industries | Confirm/update tile labels |
| LCG engagement types | Confirm/update tile labels |
| LCG CTA | Real application link, semester/year, eligibility details |
| ~~Favicon~~ | DONE 2026-07-19: src/app/icon.png (white brand icon on navy #081b2b) |

(Events "Learn More" buttons are NOT placeholders: four link to real Instagram posts,
one links to /lcg.)

## Contact Departments (live on /contact as of 2026-07-19)
| Department | Email |
|---|---|
| General Enquiries | adus6806@mylaurier.ca |
| LCG Enquiries | khan0148@mylaurier.ca |
| Sponsorship | lanc8836@mylaurier.ca |
| Media & Press | barb5313@mylaurier.ca |

---

## Known Decisions & Conventions
- **"Pro-Bono"** always hyphenated everywhere on the site
- LCC **hosts** its own case competitions — does not send members to external ones
- No Meet the Team page — do not recreate unless explicitly asked
- Stat card label is "Yearly LCG Engagements" (not just "LCG Engagements")
- CTA titles (2026-07-19): About page = "Be Part of LCC" (evergreen; exec hiring is
  seasonal), LCG page = "Apply to LCG". User finds "Ready to X?" phrasing corny.
- Section label above "What We Offer" reads "Get Involved"
- No em dashes in body copy — use commas instead
- All SVG icons use `stroke="#cfddff"`, `stroke-width="1.5"`, `fill="none"` for consistency

---

## Repo & Deploy State

- **Club repo**: `https://github.com/Laz-LCC/website` — PUBLIC, default branch `main`,
  wired to Vercel. Added as `origin` 2026-08-24.
- **The club repo's `main` is a placeholder**: one commit, containing a single
  `index.html`. The real site replaces it.
- **The two histories are unrelated.** The local repo grew from its own root, so
  `local main` and `origin/main` share no merge base. Consequences:
  - `git diff origin/HEAD...HEAD` fails with `no merge base`. Anything that diffs
    against the remote (including `/security-review`) needs a branch cut from
    `origin/main` first.
  - Do NOT merge with `--allow-unrelated-histories` to work around it. The agreed
    approach is a branch based on `origin/main` with the whole site applied as one
    squashed commit on top.
  - The squash means only the final tree is published. The 15 local commits that
    precede it stay on the laptop.
- **The repo is public, so pushing is publishing.** Security review belongs before the
  first push, not before the merge to `main`.
- **Pushing to `main` deploys to production**, because the repo is already connected to
  Vercel. Push to a branch to get a preview URL instead.
- `NEXT_PUBLIC_SITE_URL` must be set in the Vercel project or social link previews
  resolve against the `.vercel.app` address. See HOSTING-AND-HANDOFF.md.
- Repo-local `user.email` is set deliberately, so the global identity is not baked into
  a repo being handed to the club.

## User Context
- University student, no coding background
- Explain outcomes first, technical detail second
- Keep code readable and well-commented
- Prefer concise responses — no trailing summaries

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
