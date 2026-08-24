# LCC Website — Hosting Costs & Handoff Plan

> Saved from a Claude Code session on 2026-07-08. Reference for when it's time to
> host the site, budget for it, and eventually hand it off to the next exec team.

---

## TL;DR

- **Hosting this site can cost $0/month.** The Google side is entirely free, and
  the site as built fits Vercel's free tier.
- The only near-mandatory cost is a **custom domain (~$15–20 CAD/year)**.
- For handoff: the key is moving everything onto **club-owned accounts**
  (GitHub, Vercel, Google, domain registrar), not personal ones.

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

## 1. The code → a GitHub repository under a club account

Right now the code only exists on one laptop, which is the riskiest part of the
whole setup — if the laptop dies, the website source is gone. The fix:

- Create a club GitHub account (or organization) with a shared club email like
  `laurierconsulting@gmail.com`
- Push the project there as a repository

That makes the repo the permanent home of the code. Any future exec can
download it, and any future Claude Code user can open it and pick up right
where things left off — the `CLAUDE.md` file is already a solid briefing
document for exactly that (it explains the brand colours, page structure,
conventions, and even the Google Sheets wiring).

## Before the first deploy: set `NEXT_PUBLIC_SITE_URL`

One env var needs setting in the Vercel project, or link previews break in a way
nothing on the site itself will show you.

`src/app/layout.tsx` builds the absolute URLs for social preview cards (the image
and title that appear when someone pastes the link into Instagram DMs, LinkedIn,
or a group chat). It reads `NEXT_PUBLIC_SITE_URL`, falls back to the Vercel
deployment URL, and finally to `http://localhost:3000`.

So: the site works fine without it, but until it is set to the real domain, a
shared link may render its preview against the `*.vercel.app` address instead of
the club domain. Set it once the domain is registered.

## 2. Vercel → connect it to that GitHub repo

Deploy on Vercel via a club-owned Vercel account (sign up with the same club
email), connected to the club GitHub repo, so hosting is fully decoupled from
any one person. Bonus: with that connection, anyone who edits the code on
GitHub gets the site redeployed automatically — no terminal needed.

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

## 4. Domain → register it with club credentials

Register the domain using the club email and share the registrar login. An
expired domain in a graduated student's personal account is the single most
common way club websites die.

## The handoff package itself

For the human handoff, a one-page doc in the repo (e.g. `HANDOFF.md`) listing:

- Club email + where credentials are kept
- Links to GitHub repo / Vercel dashboard / Google Sheet
- The domain registrar and renewal date
- "How to make edits": open the repo in Claude Code, describe the change,
  push, Vercel auto-deploys

Since the next exec likely won't code either, that last line matters most —
the realistic maintenance path for this site is exactly the way it was built.
