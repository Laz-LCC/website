# LCC Website — Hosting, Accounts & Handoff Plan

> Originally written 2026-07-08 as a plan for going live. Updated 2026-08-25, the
> day the site actually launched. The plan sections have been rewritten to
> describe what is now true rather than what was intended.

---

## Current state (2026-08-25)

**The site is live at https://laurierconsultingclub.ca.**

| Thing | Where it lives | Status |
|---|---|---|
| Code | `github.com/Laz-LCC/website`, branch `main` | Club-owned, public |
| Hosting | Vercel team `lcc9`, project `website`, Hobby plan | Club-owned |
| Domain | `laurierconsultingclub.ca` | Bought personally, see below |
| DNS | Nameservers at `ns0/ns1.wixdns.net` | **Not club-controlled** |
| Mailing list | Google Sheet + Apps Script | Personal Google account |

Deploys are automatic: any commit pushed to `main` on GitHub rebuilds and ships
to the live domain within about a minute. Nobody needs a terminal to edit the
site, and nobody needs to remember a deploy command.

`www.laurierconsultingclub.ca` permanently redirects (308) to the apex, which is
the canonical address.

---

## The four accounts

The original version of this document said the risk was the code living on one
laptop. That is solved. The remaining risk is **accounts**, and there are four,
not three. Losing any one of them breaks something different:

1. **GitHub** (`Laz-LCC`) — club-owned. Losing it means losing the ability to
   change the site.
2. **Vercel** (team `lcc9`) — club-owned. Losing it means the site stays up but
   cannot be redeployed or reconfigured.
3. **Google** — the mailing-list Sheet and its Apps Script. Still on a personal
   account. Losing it means signups silently stop being recorded, while the form
   continues to tell people they subscribed.
4. **DNS** — currently at Wix, under whoever bought the domain. Losing it means
   the domain stops pointing at the site, and no amount of GitHub or Vercel
   access can fix that.

Number 4 is the one that gets forgotten, because it is invisible while it works.

---

## TL;DR on cost

- **Hosting costs $0/month.** The Google side is free, and the site fits
  Vercel's free tier.
- The only real cost is the **domain, ~$15–20 CAD/year**, and it renews
  annually. A lapsed renewal takes the site offline even though nothing about
  the site itself has changed.

---

## How the Google Sheet is wired up today

The connection lives in one place: the mailing list modal on the homepage
(`src/app/page.tsx`). When someone types their name and email and hits subscribe:

1. The visitor's **browser sends the name and email directly to a Google Apps
   Script URL** (the `SHEET_URL` constant at the top of the file). Apps Script
   is a small free program that lives inside a Google account.
2. That script **appends a new row to the Google Sheet**.

Two important properties of this setup:

- **The website server is never involved.** The browser talks straight to
  Google. So hosting the site on Vercel adds zero cost for the mailing list —
  Vercel never sees or processes those signups.
- **It's tied to whoever's Google account deployed the script.** The Apps
  Script is deployed as "Execute as: Me, accessible to Anyone" — worth knowing
  for club logistics: if it's on a personal account, redeploy it from a
  club-owned Google account before handoff so it doesn't break after graduation.

## Adding a Google Form

Also free, and there are two ways to do it:

- **Embed a real Google Form** (iframe) — zero code, Google hosts it, responses
  land in a Sheet automatically. Downside: it looks like a Google Form, not the
  site's design.
- **Build a styled form on the site that posts to Apps Script** — exactly the
  same pattern as the mailing list modal, just with more fields. Matches the
  brand, still free.

Since the Apps Script pattern is already working, the second option is the
natural fit if design matters.

## Cost estimate

| Item | Cost |
|---|---|
| Vercel Hobby plan | **$0/month** |
| Google Sheets + Apps Script + Forms | **$0** (free with any Google account) |
| Custom domain (e.g. lauriercc.ca) | **~$15–20 CAD/year** |
| **Total** | **~$1.50/month equivalent** |

Why the site fits Vercel's free tier: it's a mostly-static Next.js site —
pages, images, animations — with no server-side API routes and no paid AI
calls. The Hobby plan includes 100 GB of bandwidth per month; a club site would
use a small fraction of that even during recruitment season. A free
`lcc-website.vercel.app` URL comes included; the domain is only needed for a
clean club URL.

Two caveats:

- **Vercel Hobby is licensed for non-commercial use.** A student club site is
  generally fine, but the sponsors page technically brushes against
  "commercial." If Vercel ever flagged it (uncommon for club sites), the Pro
  plan is **$20 USD/month**. Start on Hobby and only upgrade if asked.
- **Google's free quotas** for Apps Script allow roughly 20,000 submissions per
  day — a club mailing list will never hit that.

So realistically: register a domain, deploy to Vercel Hobby, and the total
running cost is the domain renewal.

---

# Handoff Plan (if not returning to LCC)

The handoff is less about the code and more about the **accounts** everything
hangs off. There are four things to transfer, and the golden rule for each is:
put it under a club-owned identity, not a personal one.

## 1. The code → GitHub — DONE

Lives at `github.com/Laz-LCC/website` under the club org. The laptop is no
longer a single point of failure. Any future exec can clone it, and any future
Claude Code user can open it and pick up where things left off — `CLAUDE.md` is
the briefing document for exactly that (brand colours, page structure,
conventions, and a section on the decisions that look like bugs but are not).

## 2. Vercel → connected — DONE

Vercel team `lcc9`, project `website`, connected to the club GitHub repo. A push
to `main` redeploys automatically, so no terminal is needed to publish a change.

Two settings on that project are load-bearing and worth knowing, because both
produce a site that looks broken with no error anywhere:

- **Framework Preset must be `Next.js`.** It was `Other` at launch, because the
  project was created when the repo held only a placeholder `index.html`. With
  `Other`, Vercel's output directory rule is "`public` if it exists" — and this
  repo has a `public/` folder — so it ran the build, threw the result away, and
  served the images folder as the website. Every page 404'd while the deployment
  reported Ready.
- **`NEXT_PUBLIC_SITE_URL` must be set** to `https://laurierconsultingclub.ca`.
  `src/app/layout.tsx` builds absolute URLs for social preview cards from it. If
  it is missing the site still works, but links pasted into Instagram or LinkedIn
  preview against the raw `.vercel.app` address. Set it as type **Config**, not
  Secret — it ships in the browser bundle by design.

## 3. Google side → redeploy Apps Script from a club Google account

This is the one that silently breaks if forgotten. The mailing list Sheet and
its Apps Script currently live in a **personal** Google account. If that
account is ever locked or the script deleted, signups would silently stop
working (the site would look fine — data would just vanish). Handoff:

- Create/use a club Google account
- Move or recreate the Sheet there, add the same Apps Script, deploy it, and
  paste the new URL into `SHEET_URL` in `page.tsx`

It's about a 15-minute job, and future Google Forms should be created from
that account too.

## 4. Domain and DNS → still personal — NOT DONE

`laurierconsultingclub.ca` is registered personally, not by the club, and its
nameservers point at Wix (`ns0.wixdns.net`, `ns1.wixdns.net`) rather than at the
registrar or Vercel. So there are two separate things to move, and they are
often confused:

- **The registration** — who pays the annual renewal and can transfer or let the
  domain lapse.
- **The DNS** — who controls where the domain points. Currently whoever holds
  the Wix account. This is the one that can silently break the site: someone
  editing DNS in Wix for an unrelated reason can take the whole site offline,
  and nothing in GitHub or Vercel will show why.

The current record is an `A` record on the apex pointing to Vercel's
`216.198.79.1`, plus a `CNAME` for `www`.

Two acceptable end states:

1. **Move DNS to Vercel.** Change the nameservers to Vercel's, and the domain is
   managed in the same dashboard as the site. Fewest moving parts, and the option
   to prefer if the club has no other use for the domain.
2. **Leave DNS where it is, but under a club login.** Fine, as long as the
   account is club-owned and someone records that DNS is the thing that lives
   there.

Either way, the registration should end up billed to a club-owned payment method
with auto-renew on. An expired domain in a graduated student's personal account
is the single most common way club websites die.

## The handoff package itself

For the human handoff, a one-page doc in the repo (e.g. `HANDOFF.md`) listing:

- Club email + where credentials are kept
- Links to GitHub repo / Vercel dashboard / Google Sheet
- The domain registrar and renewal date
- "How to make edits": open the repo in Claude Code, describe the change,
  push, Vercel auto-deploys

Since the next exec likely won't code either, that last line matters most —
the realistic maintenance path for this site is exactly the way it was built.
