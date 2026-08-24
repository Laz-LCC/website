'use client'

import { useEffect, useState } from 'react'

const links = [
  { href: '/',        label: 'Home',     key: 'home'    },
  { href: '/events',  label: 'Events',   key: 'events'  },
  { href: '/about',   label: 'About Us', key: 'about'   },
  { href: '/lcg',     label: 'LCG',      key: 'lcg'     },
  { href: '/contact', label: 'Contact',  key: 'contact' },
]

export default function Navbar({ active }: { active: string }) {
  const [scrolled, setScrolled] = useState(false)
  const [open,     setOpen]     = useState(false)

  useEffect(() => {
    // The scrollbar-gutter measurement that used to live here has been removed:
    // `scrollbar-gutter: stable` on <html> already reserves the space, so the
    // fixed navbar is sized to the same width as page content. Padding it again
    // shifted the navbar 4px left of everything else.
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    if (window.scrollY > 20) setScrolled(true)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">
      <div className="nav-container">
        <a href="/" className="nav-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/LCC Brand Kit/Laurier Consulting Club (Image Only - White).png"
            alt="Laurier Consulting Club"
          />
        </a>

        <ul className={`nav-links${open ? ' open' : ''}`} id="navLinks">
          {links.map(link => (
            <li key={link.key}>
              <a
                href={link.href}
                className={`nav-link${active === link.key ? ' active' : ''}`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className={`nav-toggle${open ? ' open' : ''}`}
          aria-label="Toggle navigation"
          onClick={() => setOpen(o => !o)}
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  )
}
