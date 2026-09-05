import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageAnimations from '@/components/PageAnimations'
import HeroBackground from '@/components/HeroBackground'
import { LCG_APPLICATIONS, CLUB_APPLICATIONS, type Application } from '@/data/announcements'

/**
 * Page-level metadata, which the other pages do not bother with because they
 * inherit the root layout's. This one earns it: /apply is the URL that goes in
 * the Instagram bio, so it is the page most likely to be pasted somewhere that
 * renders a link preview. A generic "Laurier Consulting Club" card on a link
 * that says "apply here" is a wasted impression.
 */
export const metadata: Metadata = {
  title: 'Apply | Laurier Consulting Club',
  description:
    'Open roles with the Laurier Consulting Club and the Laurier Consulting Group, with deadlines and application links.',
  openGraph: {
    title: 'Apply to LCC',
    description:
      'Open roles with the Laurier Consulting Club and the Laurier Consulting Group, with deadlines and application links.',
  },
}

/** The two groups, in the order they appear on the page. */
const GROUPS: { program: Application['program']; heading: string; blurb: string }[] = [
  {
    program: 'LCG',
    heading: 'Laurier Consulting Group',
    blurb:
      'Our pro-bono consulting arm. Teams of six students are paired with a real company client and a mentor from a top consulting firm.',
  },
  {
    program: 'LCC',
    heading: 'Laurier Consulting Club',
    blurb:
      'The club itself, run by a 35+ person executive team that puts on the mixers, workshops, and case competitions.',
  },
]

export default function Apply() {
  const applications = [...LCG_APPLICATIONS, ...CLUB_APPLICATIONS]
  const isOpen = applications.length > 0

  return (
    <>
      <PageAnimations />
      <Navbar active="apply" />


      {/* PAGE HERO */}
      <section className="page-hero">
        <HeroBackground />
        <div className="container page-hero-content">
          <div className="section-label">Join Us</div>
          <h1 className="page-hero-title">Apply to<br /><span className="accent">LCC</span></h1>
          <p className="page-hero-subtitle">
            {isOpen
              ? 'Every open role, what it involves, and when it closes.'
              : 'Where every open role is listed when recruitment runs.'}
          </p>
        </div>
      </section>


      {/* ================================================
          OPEN ROLES
          Grouped by program rather than listed flat, so a
          first year can tell the club exec roles apart
          from the LCG engagement roles at a glance.
      ================================================= */}
      <section className="apply-section">
        <div className="container">
          {isOpen ? (
            GROUPS.map(group => {
              const groupApplications = applications.filter(a => a.program === group.program)
              if (groupApplications.length === 0) return null

              return (
                <div key={group.program} className="apply-group">
                  <div className="apply-group-head">
                    <h2 className="apply-group-title">{group.heading}</h2>
                    <p className="apply-group-blurb">{group.blurb}</p>
                  </div>

                  <div className="apply-grid">
                    {groupApplications.map(application => (
                      <div key={application.key} className="apply-card">
                        <div className="apply-card-body">
                          <h3 className="apply-card-role">{application.role}</h3>
                          <p className="apply-card-desc">{application.description}</p>
                          <dl className="apply-card-facts">
                            <div className="apply-fact">
                              <dt className="apply-fact-label">Closes</dt>
                              <dd className="apply-fact-value">{application.closes}</dd>
                            </div>
                            <div className="apply-fact">
                              <dt className="apply-fact-label">Who can apply</dt>
                              <dd className="apply-fact-value">{application.eligibility}</dd>
                            </div>
                          </dl>
                        </div>
                        <a
                          href={application.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary"
                        >
                          Apply Now →
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })
          ) : (
            /* Off-season. The page stays up rather than 404ing, because this URL
               is handed out in the Instagram bio and on printed material, and a
               dead link during the eleven months nothing is open is worse than
               a page that says so. */
            <div className="apply-closed">
              <h2 className="apply-closed-title">Nothing is open right now</h2>
              <p className="apply-closed-text">
                LCG applications go out every term, and LCC executive applications open over the
                summer. Follow us on Instagram to hear when the next round opens, or get in touch
                if you have questions in the meantime.
              </p>
              <div className="apply-closed-buttons">
                <a
                  href="https://www.instagram.com/laurierconsultingclub/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Follow on Instagram →
                </a>
                <a href="/contact" className="btn btn-ghost">Contact Us →</a>
              </div>
            </div>
          )}
        </div>
      </section>


      <Footer />
    </>
  )
}
