import { ANNOUNCEMENT_BANNER } from '@/data/announcements'

/**
 * The strip pinned above the navbar on every page.
 *
 * Rendering nothing is a real outcome here, not an error state: when
 * ANNOUNCEMENT_BANNER is null there is no announcement to make. The matching
 * `has-banner` class on <body> in layout.tsx is what reserves the space, so the
 * two must be driven by the same value or the navbar ends up floating 46px
 * below the top of the window with nothing above it.
 *
 * No "use client" on purpose: this is static markup, so it costs no JavaScript.
 */
export default function AnnouncementBanner() {
  if (!ANNOUNCEMENT_BANNER) return null

  const { headline, detail } = ANNOUNCEMENT_BANNER

  return (
    <div className="announcement-banner">
      {/* Font Awesome's solid five-point star, the same mark already used on the
          event award badge. Explicitly NOT the four-point sparkle: that glyph
          reads as an AI badge everywhere on the web now.
          Hidden under 768px by CSS, where the message wraps to two lines and the
          star centres itself against the block rather than the first line. */}
      <i className="fa-solid fa-star announcement-banner-icon" aria-hidden="true"></i>
      <span className="announcement-banner-text">
        <strong className="announcement-banner-headline">{headline}</strong>{' '}
        {detail}
      </span>
    </div>
  )
}
