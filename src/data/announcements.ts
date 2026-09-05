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
// ACTIVE — Fall 2026 recruitment
// ---------------------------------------------------------------------------

export const ANNOUNCEMENT_BANNER: Banner | null = {
  headline: "We're hiring!",
  detail: 'Fall 2026 LCG positions and First Year Representative applications are open.',
}

/** LCG engagement roles. Shown on /apply and in the /lcg applications banner. */
export const LCG_APPLICATIONS: Application[] = [
  {
    key: 'associate',
    label: 'Associate Application',
    role: 'Associate',
    program: 'LCG',
    href: 'https://docs.google.com/forms/d/e/1FAIpQLSfyS0aAVSoeOaB8tH5TGHpYy3Ui2IvnHZ-gHk4OlBiZ4VW1PQ/viewform',
    closes: 'September 13 at 11:59 PM',
    // Descriptions do not restate the role name: the card title directly above
    // already says it.
    description:
      'Leads the research behind an engagement and builds the recommendations that go into the team\'s final deliverable.',
    eligibility: 'Open to first and second year students.',
  },
  {
    key: 'consultant',
    label: 'Consultant Application',
    role: 'Consultant',
    program: 'LCG',
    href: 'https://docs.google.com/forms/d/e/1FAIpQLSeWUpKJGN5BeQj7HVAOUxQZQc_5AJgN00W4R-Rm3TVKw-kctg/viewform',
    closes: 'September 13 at 11:59 PM',
    description:
      'Drives the client-facing presentations and works directly with the company the team is paired with.',
    eligibility: 'Open to second year students and above.',
  },
]

/** Club executive roles. Shown on /apply only. */
export const CLUB_APPLICATIONS: Application[] = [
  {
    key: 'first-year-rep',
    label: 'First Year Rep Application',
    role: 'First Year Representative',
    program: 'LCC',
    href: 'https://docs.google.com/forms/d/e/1FAIpQLSc_Q-3aY0dxS4POjTNE7K7I8NxuYWlhEjsoEk4usNFOB43p5g/viewform',
    closes: 'September 18',
    description:
      'A rotational role across the club\'s portfolios, including Corporate, Events, Finance, and LCG, helping run the events and engagements each one is responsible for.',
    eligibility: 'Open to first year students only.',
  },
]

/** Shown on /events as a strip above the past-event cards. */
export const UPCOMING_EVENTS: UpcomingEvent[] = [
  {
    key: 'first-year-mixer',
    title: 'First Year Networking Mixer',
    date: 'September 16, 2026',
    time: '6:30 PM - 8:30 PM',
    location: 'Lazaridis Atrium & LH1009',
    cost: 'Free to attend',
    signupHref:
      'https://docs.google.com/forms/d/e/1FAIpQLSfWvzL1cZdXQQUkTAetCs_EM2GPM4l7jczIK2xXxryrUQ2X7w/viewform',
  },
]
