import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageAnimations from '@/components/PageAnimations'
import HeroBackground from '@/components/HeroBackground'

export default function About() {
  return (
    <>
      <PageAnimations />
      <Navbar active="about" />


      {/* PAGE HERO */}
      <section className="page-hero">
        <HeroBackground />
        <div className="container page-hero-content">
          <div className="section-label">Our Story</div>
          <h1 className="page-hero-title">About<br /><span className="accent">LCC</span></h1>
          <p className="page-hero-subtitle">
            Who we are, what we stand for, and how we&apos;re shaping the next generation of consultants.
          </p>
        </div>
      </section>


      {/* ================================================
          MISSION & WHAT WE DO
      ================================================= */}
      <section className="about-mission-section">
        <div className="container">
          <div className="about-mission-grid">

            <div>
              <div className="section-label">Our Mission</div>
              <h2 className="section-title">Where Consulting<br /><em>Careers Begin.</em></h2>
              <p className="body-text">
                Laurier Consulting Club exists to give Wilfrid Laurier University students a real head
                start in consulting. We bridge the gap between the classroom and the career by building
                the skills, connections, and experiences that recruiting actually rewards.
              </p>
              <p className="body-text">
                Whether you&apos;re learning to crack a case, presenting to a real client through LCG, or
                networking with professionals from top firms, LCC is where that journey starts.
              </p>
            </div>

            <div>
              <div className="section-label">What We Do</div>
              <h2 className="section-title">The Full<br /><em>Picture.</em></h2>
              <p className="body-text">
                LCC runs high-impact events throughout the year: networking mixers with professionals
                from top consulting firms, skill-building workshops on case frameworks, slide building,
                and financial modelling, and our own case competitions with real cash prizes.
              </p>
              <p className="body-text">
                At the core of LCC is the Laurier Consulting Group, our pro-bono consulting arm that
                places students on structured teams to deliver real strategic engagements for real
                companies, mentored by professionals from leading firms.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* ================================================
          CORE VALUES
      ================================================= */}
      <section className="about-story-section">
        <div className="container">
          <div className="section-label">Core Values</div>
          <h2 className="section-title">What We<br />Stand For</h2>
          <div className="values-grid">

            <div className="value-card">
              <i className="fa-solid fa-trophy value-icon"></i>
              <div className="value-title">Excellence</div>
              <p className="value-desc">
                We hold ourselves to a high standard in everything we deliver, from the quality of our
                events to the work our consulting teams put in front of real clients.
              </p>
            </div>

            <div className="value-card">
              <i className="fa-solid fa-handshake value-icon"></i>
              <div className="value-title">Integrity</div>
              <p className="value-desc">
                We operate with transparency and professionalism, in how we engage with partners,
                clients, and each other, and in how we represent Laurier in the industry.
              </p>
            </div>

            <div className="value-card">
              <i className="fa-solid fa-people-group value-icon"></i>
              <div className="value-title">Community</div>
              <p className="value-desc">
                LCC is more than a résumé line. It&apos;s a network of students who push each other
                forward, celebrate each other&apos;s wins, and show up for one another.
              </p>
            </div>

            <div className="value-card">
              <i className="fa-solid fa-chart-line value-icon"></i>
              <div className="value-title">Growth</div>
              <p className="value-desc">
                We believe every student who walks through our doors has the potential to build a
                career in consulting. Our job is to create the environment that makes it happen.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* ================================================
          CTA — JOIN LCC
      ================================================= */}
      <section className="lcg-cta-section">
        <div className="container">
          <div className="section-label section-label--center">Get Involved</div>
          <h2 className="lcg-cta-title">Be Part of<br /><span className="accent">LCC</span></h2>
          <p className="lcg-cta-sub">
            Applications for LCC executive roles open over the summer. To apply, visit the link in
            our Instagram bio. In the meantime, keep an eye on our Instagram for upcoming events
            open to all Laurier students.
          </p>
          <div className="lcg-cta-buttons">
            <a href="/contact" className="btn btn-primary">Contact Us →</a>
          </div>
        </div>
      </section>


      <Footer />
    </>
  )
}
