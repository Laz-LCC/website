import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageAnimations from '@/components/PageAnimations'
import HeroBackground from '@/components/HeroBackground'
import EventCoverGraphic from '@/components/EventCoverGraphic'

export default function Events() {
  return (
    <>
      <PageAnimations />
      <Navbar active="events" />


      {/* PAGE HERO */}
      <section className="page-hero">
        <HeroBackground />
        <div className="container page-hero-content">
          <div className="section-label">What&apos;s On</div>
          <h1 className="page-hero-title">LCC<br /><span className="accent">Events</span></h1>
          <p className="page-hero-subtitle">
            Workshops, networking nights, case competitions, and more, open to all Laurier students.
          </p>
        </div>
      </section>


      {/* ================================================
          EVENTS
      ================================================= */}
      <section className="events-section">
        <div className="container">

          {/* ---- Event 1: LCG Networking Mixer ---- */}
          <div className="event-card">
            <div className="event-card-inner">
              <div className="event-card-image">
                <Image
                  src="/event-lcg-mixer.jpg"
                  alt="LCG Networking Mixer"
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  style={{ objectFit: 'cover', objectPosition: 'left bottom' }}
                />
              </div>
              <div className="event-card-body">
                <div className="event-card-content">
                  <div className="event-card-top">
                    <h2 className="event-title">LCG Networking Mixer</h2>
                    <div className="event-meta">
                      <span className="event-meta-item"><i className="fa-regular fa-calendar"></i>March 29, 2026</span>
                      <span className="event-meta-item"><i className="fa-regular fa-clock"></i>2:00 PM – 5:00 PM</span>
                      <span className="event-meta-item"><i className="fa-solid fa-location-dot"></i>Schlegel Atrium</span>
                    </div>
                  </div>
                  <p className="event-desc">
                    Students connected with alumni from top consulting firms, heard from LCG teams
                    presenting snapshots of their engagements, and prepared for the upcoming recruitment cycle.
                  </p>
                  <div>
                    <div className="event-detail-label" style={{ marginBottom: '8px' }}>Sponsors</div>
                    <div className="event-tags">
                      <span className="event-tag">Invictus Analytics + Strategy</span>
                      <span className="event-tag">IBM</span>
                      <span className="event-tag">EY</span>
                      <span className="event-tag">Monitor Deloitte</span>
                      <span className="event-tag">Wispr Flow</span>
                    </div>
                  </div>
                </div>
                <a href="https://www.instagram.com/p/DV84ZIuE1TL/" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">Learn More →</a>
              </div>
            </div>
          </div>

          {/* ---- Event 2: Premier Consulting Week ---- */}
          <div className="event-card">
            <div className="event-card-inner event-card-inner--flip">
              <div className="event-card-image">
                <Image
                  src="/event-pcw.jpg"
                  alt="Premier Consulting Week"
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  style={{ objectFit: 'cover', objectPosition: '62% center', filter: 'brightness(0.82)' }}
                />
              </div>
              <div className="event-card-body">
                <div className="event-card-content">
                  <div className="event-card-top">
                    <h2 className="event-title">Premier Consulting Week</h2>
                    <div className="event-meta">
                      <span className="event-meta-item"><i className="fa-regular fa-calendar"></i>March 1 – 8, 2026</span>
                      <span className="event-meta-item"><i className="fa-solid fa-location-dot"></i>Wilfrid Laurier University</span>
                    </div>
                  </div>
                  <p className="event-desc">
                    One week. One evolving fintech case. Unlimited strategy. A fast-paced case competition
                    that connected students with industry leaders in consulting, banking, and tech.
                  </p>
                  <div className="event-detail-row">
                    <span className="event-detail-label">Prize Pool</span>
                    <span className="event-detail-value">$3,500 total: 1st $2,000 + Monitor Deloitte coffee chats &nbsp;·&nbsp; 2nd $1,000 &nbsp;·&nbsp; 3rd $500</span>
                  </div>
                  <div>
                    <div className="event-detail-label" style={{ marginBottom: '8px' }}>Sponsors</div>
                    <div className="event-tags">
                      <span className="event-tag">BCG</span>
                      <span className="event-tag">Investly</span>
                      <span className="event-tag">Invictus</span>
                      <span className="event-tag">Mastercard</span>
                      <span className="event-tag">Monitor Deloitte</span>
                      <span className="event-tag">KPMG</span>
                      <span className="event-tag">IBM</span>
                    </div>
                  </div>
                </div>
                <a href="https://www.instagram.com/p/DVta56dDQVx/?img_index=1" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">Learn More →</a>
              </div>
            </div>
          </div>

          {/* ---- Event 3: LCG Recruitment Info Session ---- */}
          <div className="event-card">
            <div className="event-card-inner">
              <div className="event-card-image">
                <EventCoverGraphic />
              </div>
              <div className="event-card-body">
                <div className="event-card-content">
                  <div className="event-card-top">
                    <h2 className="event-title">LCG Recruitment Info Session</h2>
                    <div className="event-meta">
                      <span className="event-meta-item"><i className="fa-regular fa-calendar"></i>December 1, 2025</span>
                      <span className="event-meta-item"><i className="fa-regular fa-clock"></i>6:00 PM</span>
                      <span className="event-meta-item"><i className="fa-solid fa-location-dot"></i>Zoom (Virtual)</span>
                    </div>
                  </div>
                  <p className="event-desc">
                    Attendees learned what LCG consultants and associates actually do, the real-world
                    experience the program provides, and how to stand out in the application and interview process.
                  </p>
                  <div className="event-detail-row">
                    <span className="event-detail-label">Open To</span>
                    <span className="event-detail-value">Anyone interested in the Consultant or Associate role</span>
                  </div>
                </div>
                <a href="/lcg" className="btn btn-primary btn-sm">Learn More →</a>
              </div>
            </div>
          </div>

          {/* ---- Event 4: Diversity in Consulting Speaker Panel ---- */}
          <div className="event-card">
            {/* The inline height:460px that used to be here duplicated the
                value already in .event-card-inner, and being inline it survived
                the mobile media query that has to clear it. */}
            <div className="event-card-inner event-card-inner--flip">
              <div className="event-card-image">
                <Image
                  src="/event-diversity-panel.png"
                  alt="Diversity in Consulting Speaker Panel"
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="event-card-body">
                <div className="event-card-content">
                  <div className="event-card-top">
                    <h2 className="event-title">Diversity in Consulting Speaker Panel</h2>
                    <div className="event-meta">
                      <span className="event-meta-item"><i className="fa-regular fa-calendar"></i>November 23, 2025</span>
                      <span className="event-meta-item"><i className="fa-regular fa-clock"></i>2:00 PM – 4:00 PM</span>
                      <span className="event-meta-item"><i className="fa-solid fa-location-dot"></i>Schlegel Atrium</span>
                    </div>
                  </div>
                  <p className="event-desc">
                    Consultants from BCG, Deloitte, EY, and IBM shared their journeys and insights on
                    navigating consulting as professionals from diverse backgrounds.
                  </p>
                  <div className="event-award">
                    <i className="fa-solid fa-star"></i>
                    Best Partnership Event, 2025/2026
                  </div>
                  <div>
                    <div className="event-detail-label" style={{ marginBottom: '8px' }}>Sponsors</div>
                    <div className="event-tags">
                      <span className="event-tag">BCG</span>
                      <span className="event-tag">Deloitte</span>
                      <span className="event-tag">EY</span>
                      <span className="event-tag">IBM</span>
                    </div>
                  </div>
                  <div>
                    <div className="event-detail-label" style={{ marginBottom: '8px' }}>Partners</div>
                    <div className="event-tags">
                      <span className="event-tag">ASIB</span>
                      <span className="event-tag">BSOL</span>
                    </div>
                  </div>
                </div>
                <a href="https://www.instagram.com/p/DQ4-pXBAeY1/?img_index=1" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">Learn More →</a>
              </div>
            </div>
          </div>

          {/* ---- Event 5: Mastercard Info Session & Networking Night ---- */}
          <div className="event-card">
            <div className="event-card-inner">
              <div className="event-card-image">
                <Image
                  src="/event-mastercard.jpg"
                  alt="Mastercard Info Session & Networking Night"
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  style={{ objectFit: 'fill', transform: 'scaleX(1.4)', transformOrigin: 'center', filter: 'brightness(0.82)' }}
                />
              </div>
              <div className="event-card-body">
                <div className="event-card-content">
                  <div className="event-card-top">
                    <h2 className="event-title">Mastercard Info Session &amp; Networking Night</h2>
                    <div className="event-meta">
                      <span className="event-meta-item"><i className="fa-regular fa-calendar"></i>November 6, 2025</span>
                      <span className="event-meta-item"><i className="fa-regular fa-clock"></i>6:00 PM – 7:30 PM</span>
                      <span className="event-meta-item"><i className="fa-solid fa-location-dot"></i>Schlegel Atrium</span>
                    </div>
                  </div>
                  <p className="event-desc">
                    Students explored Mastercard&apos;s consulting tracks, internship and full-time
                    opportunities, and networked directly with company reps from a global leader in payments technology. Selected candidates only.
                  </p>
                  <div>
                    <div className="event-detail-label" style={{ marginBottom: '8px' }}>Sponsors</div>
                    <div className="event-tags">
                      <span className="event-tag">Mastercard</span>
                    </div>
                  </div>
                </div>
                <a href="https://www.instagram.com/p/DQM74CiAT7X/" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">Learn More →</a>
              </div>
            </div>
          </div>

        </div>
      </section>


      <Footer />
    </>
  )
}
