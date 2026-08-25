export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">

        {/* Top: brand + link columns */}
        <div className="footer-grid">

          {/* Brand column */}
          <div className="footer-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/LCC Brand Kit/Laurier Consulting Club (Full Logo - White).png"
              alt="LCC"
              className="footer-logo"
            />
            <p className="footer-tagline">
              Your consulting journey starts here.
            </p>
          </div>

          {/* Pages column */}
          <div>
            <div className="footer-heading">Pages</div>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/events">Events</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/lcg">LCG</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          {/* Contact column: department emails */}
          <div>
            <div className="footer-heading">Contact</div>
            <ul className="footer-links">
              <li><a href="mailto:adus6806@mylaurier.ca">General Enquiries</a></li>
              <li><a href="mailto:khan0148@mylaurier.ca">LCG Enquiries</a></li>
              <li><a href="mailto:lanc8836@mylaurier.ca">Sponsorship</a></li>
              <li><a href="mailto:barb5313@mylaurier.ca">Media &amp; Press</a></li>
            </ul>
          </div>

          {/* Socials column */}
          <div>
            <div className="footer-heading">Follow</div>
            <ul className="footer-links">
              <li>
                <a
                  href="https://www.instagram.com/laurierconsultingclub/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/laurier-consulting-club/posts/?feedView=all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </li>
              <li><a href="mailto:lcc@lazsoc.ca">lcc@lazsoc.ca</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar: copyright + address */}
        <div className="footer-bottom">
          <p className="footer-copy">© 2026 Laurier Consulting Club</p>
          <p className="footer-address">64 University Ave W, Waterloo, ON N2L 3C7</p>
        </div>

      </div>
    </footer>
  )
}
