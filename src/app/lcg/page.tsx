import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageAnimations from '@/components/PageAnimations'
import HeroBackground from '@/components/HeroBackground'
import LCGTilesToggle from '@/components/LCGTilesToggle'

export default function LCG() {
  return (
    <>
      <PageAnimations />
      <Navbar active="lcg" />


      {/* ================================================
          LCG HERO
      ================================================= */}
      <section className="lcg-page-hero">
        <HeroBackground />
        <div className="container">
          <div className="lcg-page-hero-inner">
            <div>
              <div className="section-label">Pro‑Bono Consulting Arm</div>
              <h1 className="lcg-page-hero-title">
                Laurier<br />
                <span className="accent">Consulting</span><br />
                Group
              </h1>
              <p className="page-hero-subtitle">
                Real clients. Real strategy. Real impact, before you graduate.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* ================================================
          AWARD BANNER
      ================================================= */}
      <div className="lcg-award-banner">
        <i className="fa-solid fa-trophy"></i>
        <span>Best Specialty Program, 2 Years Running &nbsp;·&nbsp; Awarded across all Laurier business clubs</span>
      </div>


      {/* ================================================
          HYPE SECTION
      ================================================= */}
      <section className="lcg-hype-section">
        <div className="container">
          <div className="lcg-hype-grid">

            <div>
              <div className="section-label">What Is LCG?</div>
              <h2 className="section-title">Consulting That<br /><em>Actually Matters.</em></h2>
              <p className="body-text">
                LCG is one of the most competitive student programs at Wilfrid Laurier University.
                Accepted students join a six-person team:
              </p>
              <ul className="lcg-roles">
                <li><span className="lcg-role-name">2 Team Leads</span> own client communication</li>
                <li><span className="lcg-role-name">2 Consultants</span> drive the client-facing presentations</li>
                <li><span className="lcg-role-name">2 Associates</span> lead research and build the recommendations</li>
              </ul>
              <p className="body-text">
                Every team is paired with a real company and a mentor from a top consulting firm.
                LCG has helped students land roles at McKinsey, BCG, Deloitte, and other leading firms.
              </p>
            </div>

            <div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', marginBottom: '28px' }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid var(--border-accent)',
                  marginBottom: '12px',
                  flexShrink: 0,
                }}>
                  <img
                    src="/lcg-quote-headshot.jpg"
                    alt="Sydney Robinson"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>Sydney Robinson</span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', letterSpacing: '0.02em' }}>Founder &amp; CEO, Vessl Prosthetics</span>
                <div style={{ width: '100%', borderTop: '2px solid var(--border-accent)', margin: '14px 0 0' }} />
              </div>
              <blockquote className="lcg-hype-quote" style={{ marginTop: 0, borderLeft: 'none', paddingLeft: 0, textAlign: 'center' }}>
                &quot;Laurier Consulting Group handled our European expansion strategy while we stayed focused on what mattered most. Thoughtful, well researched, and strategic.&quot;
              </blockquote>
            </div>

          </div>
        </div>
      </section>


      {/* ================================================
          HOW IT WORKS
      ================================================= */}
      <section className="lcg-how-section">
        <div className="container">
          <div className="section-label">The Process</div>
          <h2 className="section-title">How It Works</h2>
          <div className="lcg-steps">

            <div className="lcg-step">
              <div className="lcg-step-num">01</div>
              <h3 className="lcg-step-title">Get Selected</h3>
              <p className="lcg-step-desc">
                Students are chosen through a competitive application process and placed on a team built
                for diversity of skills and perspectives: strategy, finance, marketing, and beyond.
              </p>
            </div>

            <div className="lcg-step">
              <div className="lcg-step-num">02</div>
              <h3 className="lcg-step-title">Meet Your Client</h3>
              <p className="lcg-step-desc">
                Each team is matched with a real company seeking strategic guidance. You scope the
                problem, build the analysis, and deliver the recommendations.
              </p>
            </div>

            <div className="lcg-step">
              <div className="lcg-step-num">03</div>
              <h3 className="lcg-step-title">Get Mentored</h3>
              <p className="lcg-step-desc">
                A mentor who works at an actual consulting firm is assigned to each team, providing
                regular touchpoints, strategic guidance, and industry perspective throughout the engagement.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* ================================================
          WHY JOIN LCG
      ================================================= */}
      <section className="lcg-why-section">
        <div className="container">
          <div className="section-label">Why Join</div>
          <h2 className="section-title">The LCG<br /><span className="accent">Advantage</span></h2>
          <div className="lcg-why-grid">

            <div className="lcg-why-card">
              <div className="lcg-why-card-inner">
                <div className="lcg-why-card-front">
                  <div className="lcg-why-icon"><i className="fa-solid fa-briefcase"></i></div>
                  <h3 className="lcg-why-title">Real Experience</h3>
                </div>
                <div className="lcg-why-card-back">
                  <p className="lcg-why-desc">
                    Work on live consulting engagements with real companies, the kind of experience that
                    sets you apart in recruiting season.
                  </p>
                  <p className="lcg-why-back-title">Real Experience</p>
                </div>
              </div>
            </div>

            <div className="lcg-why-card">
              <div className="lcg-why-card-inner">
                <div className="lcg-why-card-front">
                  <div className="lcg-why-icon"><i className="fa-solid fa-user-tie"></i></div>
                  <h3 className="lcg-why-title">Industry Mentorship</h3>
                </div>
                <div className="lcg-why-card-back">
                  <p className="lcg-why-desc">
                    Every team is guided by a mentor from a top consulting or strategy firm, giving you
                    direct access to professionals and their networks.
                  </p>
                  <p className="lcg-why-back-title">Industry Mentorship</p>
                </div>
              </div>
            </div>

            <div className="lcg-why-card">
              <div className="lcg-why-card-inner">
                <div className="lcg-why-card-front">
                  <div className="lcg-why-icon"><i className="fa-solid fa-file-lines"></i></div>
                  <h3 className="lcg-why-title">Build Your Portfolio</h3>
                </div>
                <div className="lcg-why-card-back">
                  <p className="lcg-why-desc">
                    Leave with a polished case study, client recommendations, and a story you can speak to
                    in every interview.
                  </p>
                  <p className="lcg-why-back-title">Build Your Portfolio</p>
                </div>
              </div>
            </div>

            <div className="lcg-why-card">
              <div className="lcg-why-card-inner">
                <div className="lcg-why-card-front">
                  <div className="lcg-why-icon"><i className="fa-solid fa-sitemap"></i></div>
                  <h3 className="lcg-why-title">Cross-Functional Teams</h3>
                </div>
                <div className="lcg-why-card-back">
                  <p className="lcg-why-desc">
                    Work alongside students from BBA, CS, Mathematics, and beyond, just like you would
                    at a real firm.
                  </p>
                  <p className="lcg-why-back-title">Cross-Functional Teams</p>
                </div>
              </div>
            </div>

            <div className="lcg-why-card">
              <div className="lcg-why-card-inner">
                <div className="lcg-why-card-front">
                  <div className="lcg-why-icon"><i className="fa-solid fa-building"></i></div>
                  <h3 className="lcg-why-title">Client Exposure</h3>
                </div>
                <div className="lcg-why-card-back">
                  <p className="lcg-why-desc">
                    Present directly to company leadership and build professional relationships that extend
                    beyond the engagement.
                  </p>
                  <p className="lcg-why-back-title">Client Exposure</p>
                </div>
              </div>
            </div>

            <div className="lcg-why-card">
              <div className="lcg-why-card-inner">
                <div className="lcg-why-card-front">
                  <div className="lcg-why-icon"><i className="fa-solid fa-network-wired"></i></div>
                  <h3 className="lcg-why-title">Network</h3>
                </div>
                <div className="lcg-why-card-back">
                  <p className="lcg-why-desc">
                    Join a growing alumni network of LCG consultants who have gone on to roles at top firms,
                    startups, and Fortune 500 companies.
                  </p>
                  <p className="lcg-why-back-title">Network</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ================================================
          INDUSTRIES + ENGAGEMENT TYPES — animated toggle
      ================================================= */}
      <LCGTilesToggle />


      {/* ================================================
          CLIENT CTA BANNER
      ================================================= */}
      <section className="lcg-client-cta-section">
        <a href="/contact" className="lcg-client-cta-btn">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#081b2b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          <span className="lcg-client-cta-label">Work with an LCG team</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#081b2b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        </a>
      </section>


      {/* ================================================
          CTA — APPLY / GET INVOLVED
      ================================================= */}
      <section className="lcg-cta-section">
        <div className="container">
          <div className="section-label section-label--center">Get Involved</div>
          <h2 className="lcg-cta-title">Apply to<br /><span className="accent">LCG</span></h2>
          <p className="lcg-cta-sub">
            LCG applications go out every term. To apply, visit the link in our Instagram bio and
            keep an eye out for recruitment announcements.
          </p>
          <div className="lcg-cta-buttons">
            <a href="/contact" className="btn btn-primary">Have Questions? →</a>
          </div>
        </div>
      </section>


      <Footer />
    </>
  )
}
