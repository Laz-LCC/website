/**
 * SEASONAL ANNOUNCEMENTS — the one file to edit when recruitment opens or closes.
 *
 * Everything time-sensitive on the site reads from here:
 *   - the strip pinned above the navbar on every page   (ANNOUNCEMENT_BANNER)
 *   - every role card on /apply                         (both application arrays)
 *   - the seasonal Apply item in the navbar and footer  (both application arrays)
 *   - the applications banner near the top of /lcg      (LCG_APPLICATIONS)
 *   - the "what's coming up" strip on /events           (UPCOMING_EVENTS)
 *
 * /apply is the one place that lists applications. /events shows events only,
 * and /about and the /lcg bottom CTA stay evergreen year-round.
 *
 * TO TURN EVERYTHING OFF once the deadlines pass:
 *   set ANNOUNCEMENT_BANNER to null, and set all three arrays to [].
 * The banner disappears, the navbar slides back to the top of the window, the
 * Apply item leaves the navbar and footer, the /lcg banner and the events strip
 * are not rendered, and /apply stays up saying nothing is open. Nothing else
 * needs touching.
 *
 * Dates are written out by hand rather than computed. They appear in copy that
 * a human reads, so a real sentence beats a formatted Date object here.
 */

/** A form that is open for applications right now. */
export type Application = {
  /** React list key. Any short unique string. */
  key: string
  /** Button text. Keep it to a few words so the buttons stay the same size. */
  label: string
  /** Google Form responder link. */
  href: string
  /** Deadline as it should read in a sentence, e.g. "September 13 at 11:59 PM". */
  closes: string
  /** Role name on its own, without the word "Application". Used on /apply. */
  role: string
  /** Which team the role sits on. Groups the cards on /apply. */
  program: 'LCG' | 'LCC'
  /** One or two sentences on what the role actually does. Shown on /apply. */
  description: string
  /** Who is eligible. Shown on /apply. */
  eligibility: string
}

/** An event that has not happened yet. Past events stay as cards in events/page.tsx. */
export type UpcomingEvent = {
  key: string
  title: string
  /** e.g. "September 16, 2026" */
  date: string
  /** e.g. "6:30 PM - 8:30 PM". Omit if not announced yet. */
  time?: string
  /** Where it is happening. Omit if not announced yet. */
  location?: string
  /** e.g. "Free to attend". Omit if there is nothing to say about cost. */
  cost?: string
  /** Sign-up form. Omit for an event with no RSVP. */
  signupHref?: string
}

/**
 * The strip above the navbar. Set to null to remove it site-wide.
 *
 * Deliberately not a link and carries no button: it is an announcement, and the
 * pages it refers to are one row below it in the navbar.
 */
export type Banner = {
  /** The bold half. Short. */
  headline: string
  /** The plain half that follows it. Together they must fit a thin strip. */
  detail: string
}

// ---------------------------------------------------------------------------
// OFF SEASON — nothing is open.
//
// The Fall 2026 cycle closed September 18, 2026 and was taken down on
// September 29, 2026. Its role copy, form links and deadlines are in the
// commit that removed them, and the cycle is summarised in CLAUDE.md, so
// next year's cycle can start from what actually ran rather than from blank.
// ---------------------------------------------------------------------------

export const ANNOUNCEMENT_BANNER: Banner | null = null

/** LCG engagement roles. Shown on /apply and in the /lcg applications banner. */
export const LCG_APPLICATIONS: Application[] = []

/** Club executive roles. Shown on /apply only. */
export const CLUB_APPLICATIONS: Application[] = []

/** Shown on /events as a strip above the past-event cards. */
export const UPCOMING_EVENTS: UpcomingEvent[] = []
