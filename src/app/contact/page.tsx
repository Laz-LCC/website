import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageAnimations from '@/components/PageAnimations'
import HeroBackground from '@/components/HeroBackground'

export default function Contact() {
  return (
    <>
      <PageAnimations />
      <Navbar active="contact" />


      {/* PAGE HERO */}
      <section className="page-hero">
        <HeroBackground />
        <div className="container page-hero-content">
          <div className="section-label">Reach Out</div>
          <h1 className="page-hero-title">Get in<br /><span className="accent">Touch</span></h1>
          <p className="page-hero-subtitle">
            Questions about LCC or LCG? Want to partner with us? We&apos;d love to hear from you.
          </p>
        </div>
      </section>


      {/* ================================================
          CONTACT DETAILS
      ================================================= */}
      <section className="contact-page-section">
        <div className="container">
          <div className="contact-page-grid">

            {/* Left: info + social links */}
            <div>
              <div className="section-label">Find Us</div>
              <h2 className="section-title">Connect<br /><em>Anywhere.</em></h2>
              <p className="body-text">
                Whether you&apos;re a student interested in joining, a company looking to partner with LCG,
                or a sponsor wanting to support LCC events, reach out through any of the channels below.
              </p>
              <div className="contact-list">

                <a
                  href="https://www.instagram.com/laurierconsultingclub/"
                  className="contact-item"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="contact-item-icon">
                    <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                      <rect x="3" y="3" width="26" height="26" rx="6" stroke="#cfddff" strokeWidth="1.5"/>
                      <circle cx="16" cy="16" r="6" stroke="#cfddff" strokeWidth="1.5"/>
                      <circle cx="23.5" cy="8.5" r="1.5" fill="#cfddff"/>
                    </svg>
                  </div>
                  <div>
                    <div className="contact-item-label">Instagram</div>
                    <div className="contact-item-value">@laurierconsultingclub</div>
                  </div>
                </a>

                <a
                  href="https://www.linkedin.com/company/laurier-consulting-club/posts/?feedView=all"
                  className="contact-item"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="contact-item-icon">
                    <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                      <rect x="3" y="3" width="26" height="26" rx="4" stroke="#cfddff" strokeWidth="1.5"/>
                      <circle cx="10" cy="10" r="1.5" fill="#cfddff"/>
                      <path d="M10 14v9"    stroke="#cfddff" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M15 23v-5c0-2.2 1.8-4 4-4s4 1.8 4 4v5" stroke="#cfddff" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M15 14v9"    stroke="#cfddff" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="contact-item-label">LinkedIn</div>
                    <div className="contact-item-value">Laurier Consulting Club</div>
                  </div>
                </a>

                <a href="mailto:lcc@lazsoc.ca" className="contact-item">
                  <div className="contact-item-icon">
                    <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                      <rect x="3" y="7" width="26" height="18" rx="3" stroke="#cfddff" strokeWidth="1.5"/>
                      <path d="M3 11l13 8 13-8" stroke="#cfddff" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="contact-item-label">Email</div>
                    <div className="contact-item-value">lcc@lazsoc.ca</div>
                  </div>
                </a>

              </div>
            </div>

            {/* Right: specific enquiry cards */}
            <div>
              <div className="section-label">Specific Enquiries</div>
              <h2 className="section-title">Who to<br /><em>Contact.</em></h2>
              <div className="values-grid">

                <div className="value-card">
                  <div className="value-title">General Enquiries</div>
                  <p className="value-desc">
                    For general questions about LCC membership, events, or the club.
                  </p>
                  <a href="mailto:adus6806@mylaurier.ca" className="value-email">adus6806@mylaurier.ca</a>
                </div>

                <div className="value-card">
                  <div className="value-title">LCG Enquiries</div>
                  <p className="value-desc">
                    For companies interested in an LCG engagement or students with LCG questions.
                  </p>
                  <a href="mailto:khan0148@mylaurier.ca" className="value-email">khan0148@mylaurier.ca</a>
                </div>

                <div className="value-card">
                  <div className="value-title">Sponsorship</div>
                  <p className="value-desc">
                    For businesses looking to sponsor LCC events or initiatives.
                  </p>
                  <a href="mailto:lanc8836@mylaurier.ca" className="value-email">lanc8836@mylaurier.ca</a>
                </div>

                <div className="value-card">
                  <div className="value-title">Media & Press</div>
                  <p className="value-desc">
                    For media enquiries, partnerships, or collaboration opportunities.
                  </p>
                  <a href="mailto:barb5313@mylaurier.ca" className="value-email">barb5313@mylaurier.ca</a>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>


      <Footer />
    </>
  )
}
