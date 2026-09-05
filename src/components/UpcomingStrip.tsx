import { UPCOMING_EVENTS } from '@/data/announcements'

/**
 * The "what's on right now" strip that sits above the past-event cards on
 * /events.
 *
 * Deliberately not an event card: the cards below are a record of events that
 * already happened, with photos and results. This is a short notice for things
 * that have not happened yet, so it stays compact and text-first.
 *
 * Events only. It used to carry the open application links as well, which made
 * it a second application hub competing with /apply. Applications now live in
 * exactly one place.
 *
 * Renders nothing when there is nothing coming up. See src/data/announcements.ts.
 */
export default function UpcomingStrip() {
  if (UPCOMING_EVENTS.length === 0) return null

  return (
    <section className="upcoming-section">
      <div className="container">
        <div className="upcoming-strip">
          <div className="upcoming-strip-label">Upcoming Events</div>

          {UPCOMING_EVENTS.map(event => (
            <div key={event.key} className="upcoming-event">
              <div className="upcoming-event-info">
                <h2 className="upcoming-event-title">{event.title}</h2>
                <div className="event-meta">
                  <span className="event-meta-item">
                    <i className="fa-regular fa-calendar"></i>{event.date}
                  </span>
                  {event.time && (
                    <span className="event-meta-item">
                      <i className="fa-regular fa-clock"></i>{event.time}
                    </span>
                  )}
                  {event.location && (
                    <span className="event-meta-item">
                      <i className="fa-solid fa-location-dot"></i>{event.location}
                    </span>
                  )}
                  {event.cost && (
                    <span className="event-meta-item">
                      <i className="fa-solid fa-ticket"></i>{event.cost}
                    </span>
                  )}
                </div>
              </div>
              {event.signupHref && (
                <a
                  href={event.signupHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                >
                  Sign Up →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
