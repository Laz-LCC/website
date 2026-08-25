'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CountUp from '@/components/CountUp'
import LCGLogoTilt from '@/components/LCGLogoTilt'

const SHEET_URL = 'https://script.google.com/macros/s/AKfycbytYshp8TtCXi-fM9o_yBMAC4CkmjVQHfG2TSVex28XqraEgb6j3R9RD-rL-FhZg1JTSw/exec'

// Anyone can POST to the Apps Script endpoint above, so the form carries two
// cheap bot traps. Neither is a hard guarantee, they just make the sheet an
// unrewarding target for the drive-by spam bots that submit every form they
// find. Real abuse protection has to live in the Apps Script itself.
const MIN_FILL_MS = 1500

/** Must match the .modal-closing fade in styles.css. */
const MODAL_FADE_MS = 380

/**
 * Structural checks on what gets typed into the signup fields, mirroring
 * docs/apps-script.gs. Structural rather than a keyword blocklist: "a name
 * should not contain a URL" stays true, whereas keyword lists go stale and
 * reject real people.
 *
 * These are for feedback only. The Apps Script re-runs them, because anyone can
 * POST to that endpoint directly and skip everything here.
 */
function isPlausibleName(name: string): boolean {
  if (name.length < 2 || name.length > 100) return false
  if (!/\p{L}/u.test(name)) return false              // must contain a letter
  if (/[<>{}[\]|\\^~`=]/.test(name)) return false     // symbols no name has
  if (/https?:\/\/|www\./i.test(name)) return false   // links
  if (/(.)\1{6,}/.test(name)) return false            // "aaaaaaaa"
  if ((name.match(/\d/g) || []).length > 4) return false
  return true
}

/**
 * Mirrors rejectionReason_() in docs/apps-script.gs: the checks that apply to
 * the submission as a whole rather than to one field. Same checks, same order,
 * against the same combined string, so the two can be compared line by line.
 *
 * Without these the client accepted things the server rejects, and because the
 * form always shows success, the person was told they had joined the list while
 * the Apps Script quietly dropped them. A name pasted with a line break in it
 * was the easy way to hit that.
 */
function isStructurallyClean(name: string, email: string): boolean {
  const both = `${name} ${email}`
  if (/<[a-z/!]/i.test(both)) return false                          // markup
  if (/\{\{|\}\}|\$\{/.test(both)) return false                     // templating
  if (/https?:\/\/|www\.|\[url|\[link|<a\s/i.test(both)) return false // links
  // Bidi overrides, written as escapes because the literal characters are
  // invisible in an editor and look like a typo in the source.
  if (/[\u202A-\u202E\u2066-\u2069]/.test(both)) return false
  if (/[\r\n]/.test(both)) return false                             // would split the Sheet row
  return true
}

function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false
  if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) return false
  if (email.includes('..')) return false
  if (/^[.@]|[.@]$/.test(email)) return false
  const parts = email.split('@')
  if (parts.length !== 2 || parts[0].length > 64) return false
  // A dot may not start or end either side of the @.
  const dotEdge = /^\.|\.$/
  return !dotEdge.test(parts[0]) && !dotEdge.test(parts[1])
}

export default function Home() {

  // ── State ──────────────────────────────────────────────
  const [modalVisible, setModalVisible]   = useState(false)
  const [modalClosing, setModalClosing]   = useState(false)
  const [formDone,    setFormDone]        = useState(false)
  const [nameVal,     setNameVal]         = useState('')
  const [emailVal,    setEmailVal]        = useState('')
  const [nameErr,     setNameErr]         = useState(false)
  const [emailErr,    setEmailErr]        = useState(false)
  const [errMsg,      setErrMsg]          = useState('')
  // Honeypot: hidden from sighted users and screen readers, so anything that
  // fills it in is automated.
  const [botField,    setBotField]        = useState('')
  const formShownAt   = useRef(0)
  /**
   * Gates everything that moves in the hero until the modal is out of the way,
   * so nothing is animating behind it on first load. True immediately when the
   * modal has already been seen this session.
   */
  const [heroReady,   setHeroReady]       = useState(false)
  /** Guards the modal-init effect against StrictMode's double invocation. */
  const didInitModal  = useRef(false)

  /** Modal focus management: the card to trap within, the field to open on,
   *  and where focus came from so it can be handed back on dismiss. */
  const modalCardRef  = useRef<HTMLDivElement>(null)
  const nameInputRef  = useRef<HTMLInputElement>(null)
  const lastFocusedRef = useRef<HTMLElement | null>(null)

  const canvasRef        = useRef<HTMLCanvasElement>(null)
  const animStarted      = useRef(false)
  const sponsorSection   = useRef<HTMLElement>(null)
  const sponsorGridWrap  = useRef<HTMLDivElement>(null)
  const sponsorCards     = useRef<(HTMLDivElement | null)[]>([])

  // ── Modal init ─────────────────────────────────────────
  useEffect(() => {
    // React StrictMode runs effects twice in development. Without this guard the
    // second pass reads the `lcc_modal_seen` flag the FIRST pass just wrote,
    // takes the already-seen branch, and starts the hero animation while the
    // modal is still on screen.
    if (didInitModal.current) return
    didInitModal.current = true

    if (sessionStorage.getItem('lcc_modal_seen')) {
      setHeroReady(true)
      runAnimations()
    } else {
      sessionStorage.setItem('lcc_modal_seen', '1')
      setModalVisible(true)
      formShownAt.current = Date.now()
      document.body.style.overflow = 'hidden'
      // Pre-hide hero elements so nothing flashes behind the modal
      gsap.set('.hero-eyebrow',    { opacity: 0, x: -40 })
      gsap.set('.hero-title-line', { opacity: 0, x: -56 })
      gsap.set('.hero-divider',    { opacity: 0, scaleX: 0 })
      gsap.set('.hero-tagline',    { opacity: 0, x: -30 })
      // The scroll arrow has an infinite CSS bob, which was looping away behind
      // the modal. Hidden here and revealed by initHeroEntrance.
      gsap.set('.hero-scroll',     { opacity: 0 })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  // ── Particle canvas ────────────────────────────────────
  // Deliberately gated on heroReady: this used to start drawing on mount, so
  // the particle field was visibly moving behind the signup modal on first load.
  useEffect(() => {
    if (!heroReady) return
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')!
    const COUNT = 72, RADIUS = 1.4, LINK = 140, SPEED = 0.28, MOUSE_STRENGTH = 60
    let W = 0, H = 0, animId = 0
    const mouse = { x: -9999, y: -9999 }

    interface P { x: number; y: number; vx: number; vy: number; opacity: number; r: number }

    function makeParticle(): P {
      return {
        x:       Math.random() * W,
        y:       Math.random() * H,
        vx:      (Math.random() - 0.5) * SPEED,
        vy:      (Math.random() - 0.5) * SPEED,
        opacity: 0.25 + Math.random() * 0.45,
        r:       RADIUS + Math.random() * 0.8,
      }
    }

    let particles: P[] = []

    function resize() {
      if (!canvas) return
      const w = canvas.offsetWidth
      const widthChanged = w !== W

      W = canvas.width  = w
      H = canvas.height = canvas.offsetHeight

      // Only a real width change re-seeds the field. Mobile browsers fire
      // `resize` every time the URL bar slides away during a scroll, which
      // changes the height and nothing else. Re-seeding there threw away every
      // particle mid-scroll and dropped in a fresh set, which is what made the
      // background look like it was glitching or racing on a phone.
      if (widthChanged || particles.length === 0) {
        particles = Array.from({ length: COUNT }, makeParticle)
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const dx = p.x - mouse.x, dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MOUSE_STRENGTH && dist > 0) {
          const force = (MOUSE_STRENGTH - dist) / MOUSE_STRENGTH
          p.x += (dx / dist) * force * 1.6
          p.y += (dy / dist) * force * 1.6
        }
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(207,221,255,${p.opacity})`
        ctx.fill()
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const d = Math.sqrt((p.x - q.x) ** 2 + (p.y - q.y) ** 2)
          if (d < LINK) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(207,221,255,${(1 - d / LINK) * 0.18})`
            ctx.lineWidth = 0.7; ctx.stroke()
          }
        }
      }
      animId = requestAnimationFrame(draw)
    }

    const heroEl = canvas.closest('.hero') as HTMLElement | null
    if (heroEl) {
      heroEl.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect()
        mouse.x = e.clientX - rect.left
        mouse.y = e.clientY - rect.top
      }, { passive: true })
      heroEl.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999 })
    }

    window.addEventListener('resize', resize)
    resize()
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [heroReady])

  // ── Sponsor flashlight (grayscale → colour) ──────────
  useEffect(() => {
    const wrap  = sponsorGridWrap.current
    if (!wrap) return

    // On a touch screen this effect has no input and would sit writing inline
    // opacity 0 onto every logo forever, which would also beat the .touch-active
    // CSS rules on specificity. TouchSpotlight drives the reveal there instead.
    if (!window.matchMedia('(pointer: fine)').matches) return

    const RADIUS = 480
    let lastX = -9999
    let lastY = -9999
    let inView = false

    // Cross-fades the white silhouette layer out and the full-colour layer in.
    // A cross-fade rather than an interpolated filter: animating invert() and
    // brightness() through their mid-range turns the logo to grey mush on the
    // way past, whereas two opacities pass cleanly through each other.
    function paintCard(card: HTMLDivElement, t: number) {
      const ghost = card.querySelector<HTMLImageElement>('.sponsor-logo-ghost')
      const full  = card.querySelector<HTMLImageElement>('.sponsor-logo-full')
      if (ghost) ghost.style.opacity = (0.72 * (1 - t) + 0.12 * t).toFixed(3)
      if (full)  full.style.opacity  = t.toFixed(3)
      card.style.transform  = t > 0 ? `translateY(${-(t * 8).toFixed(2)}px)` : ''
      card.style.boxShadow  = t > 0 ? `0 ${(t * 20).toFixed(0)}px ${(t * 40).toFixed(0)}px rgba(0,0,0,${(t * 0.28).toFixed(2)})` : ''
      card.style.borderColor = t > 0 ? `rgba(207,221,255,${(0.10 + t * 0.38).toFixed(2)})` : ''
      card.style.background  = t > 0 ? `rgba(33,65,98,${(0.22 + t * 0.30).toFixed(2)})` : ''
    }

    function resetCards() {
      // paintCard at t=0 already clears transform, shadow, border and
      // background, so there is nothing to undo afterwards.
      sponsorCards.current.forEach(card => { if (card) paintCard(card, 0) })
    }

    function paintCards() {
      sponsorCards.current.forEach(card => {
        if (!card) return
        const r    = card.getBoundingClientRect()
        const cx   = r.left + r.width  / 2
        const cy   = r.top  + r.height / 2
        const dist = Math.sqrt((lastX - cx) ** 2 + (lastY - cy) ** 2)
        const t    = Math.max(0, 1 - dist / RADIUS) // 0 = far, 1 = dead-centre
        paintCard(card, t)
      })
    }

    // paintCards reads the bounding box of all ten cards and then writes five
    // style properties to each. Running that straight off mousemove meant ten
    // forced layouts per mouse event; coalescing into one animation frame does
    // the same work at most once per frame no matter how fast the pointer moves.
    let rafId = 0
    function schedulePaint() {
      if (rafId) return
      rafId = requestAnimationFrame(() => { rafId = 0; paintCards() })
    }

    function onMouseMove(e: MouseEvent) {
      lastX = e.clientX
      lastY = e.clientY
      if (inView) schedulePaint()
    }

    function onScroll() {
      if (inView) schedulePaint()
    }

    // Grey out cards the moment the grid scrolls into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          inView = entry.isIntersecting
          if (inView) schedulePaint()
          else resetCards()
        })
      },
      { threshold: 0.15 }
    )
    observer.observe(wrap)

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('scroll',    onScroll,    { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll',    onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  // ── Modal focus management ─────────────────────────────
  // A dialog that does not trap focus is only a dialog for mouse users: the
  // hero behind it stays in the tab order, so Tab walks straight out of the
  // modal and into a page the user cannot see. Escape also has to close it,
  // because that is what every other dialog on the web does.
  useEffect(() => {
    if (!modalVisible) return

    lastFocusedRef.current = document.activeElement as HTMLElement | null
    nameInputRef.current?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') { dismissModal(); return }
      if (e.key !== 'Tab') return

      const card = modalCardRef.current
      if (!card) return

      // Re-read on every Tab rather than caching on open: the form is replaced
      // by the success message after submitting, so a list captured once would
      // be pointing at elements that no longer exist.
      const focusable = card.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last  = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalVisible])

  // ── Modal helpers ──────────────────────────────────────
  function dismissModal() {
    setModalClosing(true)
    setTimeout(() => {
      setModalVisible(false)
      setModalClosing(false)
      document.body.style.overflow = ''
      // Hand focus back to whatever had it before the modal opened. On a fresh
      // page load that is <body>, where focus() is a harmless no-op.
      lastFocusedRef.current?.focus()
      setHeroReady(true)
      runAnimations()
    }, MODAL_FADE_MS)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Strip leading formula characters (= + - @) before the values reach the
    // Google Sheet: a name like '=IMPORTXML(...)' would otherwise be evaluated
    // as a live formula when an exec opens the Sheet (spreadsheet formula
    // injection). The Apps Script side should also prefix values with a quote.
    const name  = nameVal.trim().replace(/^[=+\-@]+/, '')
    const email = emailVal.trim().replace(/^[=+\-@]+/, '')
    setNameErr(false); setEmailErr(false); setErrMsg('')

    // Bot traps. Both show the normal success state rather than an error, so a
    // bot gets no feedback telling it what tripped, and nothing is posted.
    const filledHoneypot = botField !== ''
    const submittedTooFast = Date.now() - formShownAt.current < MIN_FILL_MS
    if (filledHoneypot || submittedTooFast) {
      setFormDone(true)
      setTimeout(dismissModal, 2000)
      return
    }

    if (!name)  { setNameErr(true);  setErrMsg('Please enter your full name.');         return }

    // Mirrors the checks in docs/apps-script.gs so a real person gets an inline
    // error instead of being silently dropped server-side. The Apps Script is
    // what actually enforces this, since anyone can post straight to it.
    if (!isPlausibleName(name)) {
      setNameErr(true); setErrMsg('Please enter your name as it would appear on a class list.'); return
    }
    if (!isValidEmail(email)) {
      setEmailErr(true); setErrMsg('Please enter a valid email address.'); return
    }
    if (!isStructurallyClean(name, email)) {
      setNameErr(true); setErrMsg('Please remove any links or line breaks.'); return
    }

    // Guard: only post when a real Apps Script URL is configured.
    if (SHEET_URL.startsWith('https://script.google.com/')) {
      fetch(SHEET_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ name, email }),
      }).catch(() => {})
    }

    setFormDone(true)
    setTimeout(dismissModal, 2000)
  }

  // ── GSAP animations ────────────────────────────────────
  function runAnimations() {
    if (animStarted.current) return
    animStarted.current = true
    gsap.registerPlugin(ScrollTrigger)
    // (Heading + card-stagger scroll animations were disabled and have been
    //  removed; see git history if they're ever wanted back.)
    initHeroEntrance()
    initMouseParallax()
  }

  function initHeroEntrance() {
    const eyebrow = document.querySelector('.hero-eyebrow')
    const lines   = gsap.utils.toArray<Element>('.hero-title-line')
    const divider = document.querySelector('.hero-divider')
    const tagline = document.querySelector('.hero-tagline')

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
    if (eyebrow) tl.fromTo(eyebrow, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55 }, 0)
    lines.forEach((l, i) => tl.fromTo(l, { x: -56, opacity: 0 }, { x: 0, opacity: 1, duration: 0.65 }, 0.08 + i * 0.09))
    if (divider) tl.fromTo(divider, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.45, transformOrigin: 'left center' }, 0.36)
    if (tagline) tl.fromTo(tagline, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 }, 0.43)

    // Brought back last, once the rest of the hero has settled.
    const scroll = document.querySelector('.hero-scroll')
    if (scroll) tl.fromTo(scroll, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.7)
  }

  function initMouseParallax() {
    const heroBg = document.querySelector('.hero-bg-pattern') as HTMLElement | null
    const hero   = document.querySelector('.hero') as HTMLElement | null
    if (!heroBg || !hero) return
    hero.addEventListener('mousemove', (e: MouseEvent) => {
      const r  = hero.getBoundingClientRect()
      const dx = (e.clientX - r.left  - r.width  / 2) / (r.width  / 2)
      const dy = (e.clientY - r.top   - r.height / 2) / (r.height / 2)
      gsap.to(heroBg, { x: dx * 20, y: dy * 14, duration: 1.2, ease: 'power2.out' })
    }, { passive: true })
    hero.addEventListener('mouseleave', () => {
      gsap.to(heroBg, { x: 0, y: 0, duration: 1.5, ease: 'power2.out' })
    })
  }

  // ── Render ─────────────────────────────────────────────
  return (
    <>

      {/* ================================================
          MAILING LIST MODAL
      ================================================= */}
      {modalVisible && (
        <div
          className={`modal-overlay${modalClosing ? ' modal-closing' : ''}`}
          id="signupModal"
          role="dialog"
          aria-modal={true}
          aria-labelledby="modalHeading"
        >
          <div className="modal-card" ref={modalCardRef}>
            <div className="modal-eyebrow">LCC Insider List</div>
            <h2 className="modal-title" id="modalHeading">
              Be the First<br /><span className="accent">to Know.</span>
            </h2>
            <p className="modal-desc">
              Get early access to LCC events, LCG application openings, workshops,
              and exclusive networking opportunities, delivered straight to your inbox.
            </p>

            {!formDone ? (
              <form className="modal-form" onSubmit={handleSubmit} noValidate>
                <input
                  ref={nameInputRef}
                  className={`modal-input${nameErr ? ' input-error' : ''}`}
                  type="text"
                  value={nameVal}
                  onChange={e => setNameVal(e.target.value)}
                  placeholder="Full Name"
                  autoComplete="name"
                />
                <input
                  className={`modal-input${emailErr ? ' input-error' : ''}`}
                  type="email"
                  value={emailVal}
                  onChange={e => setEmailVal(e.target.value)}
                  placeholder="Email Address"
                  autoComplete="email"
                />
                {/* Honeypot. Positioned off-screen rather than display:none,
                    which naive bots check for, and hidden from assistive tech
                    so no real user is ever asked to fill it. */}
                <input
                  className="modal-hp"
                  type="text"
                  name="company"
                  value={botField}
                  onChange={e => setBotField(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />
                <p className="modal-error">{errMsg}</p>
                <button type="submit" className="btn btn-primary modal-submit-btn">
                  Join the List →
                </button>
              </form>
            ) : (
              <p className="modal-success" style={{ display: 'block' }}>
                You&apos;re in! 🎉 Welcome to the LCC community.
              </p>
            )}

            <button className="modal-skip" onClick={dismissModal} type="button">
              Not now
            </button>
          </div>
        </div>
      )}


      {/* ================================================
          NAVBAR
      ================================================= */}
      <Navbar active="home" />


      {/* ================================================
          HERO
      ================================================= */}
      <section className="hero" id="home">
        <div className="hero-bg-pattern"></div>
        <canvas className="hero-canvas" ref={canvasRef}></canvas>
        <div className="hero-content">
          <p className="hero-eyebrow">
            Wilfrid Laurier University &nbsp;·&nbsp; Waterloo, Ontario
          </p>
          <h1 className="hero-title">
            <span className="hero-title-line">Laurier</span>
            <span className="hero-title-line accent">Consulting</span>
            <span className="hero-title-line">Club</span>
          </h1>
          <div className="hero-divider"></div>
          <p className="hero-tagline">
            Your consulting journey starts here.
          </p>
        </div>
        <div className="hero-scroll">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path
              d="M7 11l7 7 7-7"
              stroke="rgba(207,221,255,0.7)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </section>


      {/* ================================================
          WHO WE ARE
      ================================================= */}
      <section className="about-club-section" id="about-club">
        <div className="container">
          <div className="about-club-grid">

            <div className="about-club-text">
              <div className="section-label">Who We Are</div>
              <h2 className="section-title">More Than a Club.<br /><em>A Community.</em></h2>
              <p className="body-text">
                Laurier Consulting Club runs networking mixers, workshops, and case competitions for
                Wilfrid Laurier students, alongside the Laurier Consulting Group&apos;s pro-bono work
                with real companies.
              </p>
              <p className="body-text">
                Every event is open to any Laurier student, whether it is your first networking night
                or you are competing for a spot on an LCG team.
              </p>
              <a href="/about" className="btn btn-ghost" style={{ marginTop: '16px' }}>Learn More →</a>
            </div>

            <div className="about-club-stats">
              {[
                { value: 10, suffix: '+', label: 'Years Running' },
                { value: 35, suffix: '+', label: 'Executive Team' },
                { value: 7,  suffix: '+', label: 'Events Per Year' },
                { value: 12, suffix: '+', label: 'Yearly LCG Engagements' },
              ].map(({ value, suffix, label }) => (
                <div className="stat-card" key={label}>
                  <div className="stat-number">
                    <CountUp value={value} suffix={suffix} />
                  </div>
                  <div className="stat-label">{label}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>


      {/* ================================================
          OUR SPONSORS — spotlight grid
      ================================================= */}
      <section className="sponsors-section" id="sponsors" ref={sponsorSection}>
        <div className="container">
          <div className="section-label">Thank You</div>
          <h2 className="section-title">Our Sponsors</h2>

          <div className="sponsors-grid-wrap" ref={sponsorGridWrap}>
            <div className="sponsors-grid">
            {[
              /* McKinsey, Bain and IBM were cropped to their marks (they shipped with
                 28-61% of the canvas as empty padding, which capped how large the
                 visible logo could ever render). Their heights are correspondingly
                 smaller now and describe the mark itself, not a mark plus margin.
                 The rendered size on this desktop wall is unchanged. */
              { src: '/Event Sponsorships/mckinsey.png',         alt: 'McKinsey & Company', h: '46px'  },
              { src: '/Event Sponsorships/bain.png',             alt: 'Bain & Company',     h: '68px'  },
              { src: '/Event Sponsorships/bcg.png',              alt: 'BCG',                h: '68px'  },
              { src: '/Event Sponsorships/monitor deloitte.png', alt: 'Monitor Deloitte',   h: '68px'  },
              { src: '/Event Sponsorships/ey.png',               alt: 'EY',                 h: '100px' },
              { src: '/Event Sponsorships/ibm.png',              alt: 'IBM',                h: '59px'  },
              { src: '/Event Sponsorships/kpmg.png',             alt: 'KPMG',               h: '76px'  },
              { src: '/Event Sponsorships/mastercard.png',       alt: 'Mastercard',         h: '104px' },
              { src: '/Event Sponsorships/accenture.png',        alt: 'Accenture',          h: '65px'  },
              { src: '/Event Sponsorships/mercer.png',           alt: 'Mercer',             h: '50px'  },
            ].map(({ src, alt, h }, i) => (
              <div
                key={alt}
                className="sponsor-card"
                ref={el => { sponsorCards.current[i] = el }}
              >
                {/* Two stacked copies: a white silhouette at rest, the real
                    colours faded in by cursor proximity. Only the colour layer
                    carries the alt text so the logo is announced once. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="sponsor-logo-ghost" src={src} alt="" aria-hidden="true" style={{ height: h }} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="sponsor-logo-full" src={src} alt={alt} style={{ height: h }} />
              </div>
            ))}
          </div>
          </div>{/* end sponsors-grid-wrap */}
        </div>
      </section>


      {/* ================================================
          WHAT WE OFFER
      ================================================= */}
      <section className="offerings-section" id="offerings">
        <div className="container">
          <div className="section-label">Get Involved</div>
          <h2 className="section-title">What We Offer</h2>
          <div className="offerings-grid">

            <div className="offering-card">
              <div className="offering-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="10" r="5" stroke="#cfddff" strokeWidth="1.5"/>
                  <path d="M6 28c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="#cfddff" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="offering-title">Networking Mixers</h3>
              <p className="offering-desc">
                Connect with industry professionals, alumni, and fellow students at curated networking
                events designed to build lasting relationships.
              </p>
            </div>

            <div className="offering-card">
              <div className="offering-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="6" y="2" width="20" height="28" rx="2" stroke="#cfddff" strokeWidth="1.5"/>
                  <path d="M10 9 h12"  stroke="#cfddff" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M10 14 h12" stroke="#cfddff" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M10 19 h12" stroke="#cfddff" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M10 24 h7"  stroke="#cfddff" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="offering-title">Workshops</h3>
              <p className="offering-desc">
                Hands-on sessions covering case frameworks, slide building, client relations, financial
                modelling, and more, led by upper-years and industry professionals.
              </p>
            </div>

            <div className="offering-card">
              <div className="offering-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M16 4l2.5 7.5H26l-6 4.5 2 7.5-6-4-6 4 2-7.5-6-4.5h7.5L16 4z"
                    stroke="#cfddff" strokeWidth="1.5" strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="offering-title">Case Competitions</h3>
              <p className="offering-desc">
                Test your strategic thinking against the best. LCC hosts its own case competitions
                throughout the year, with cash prizes awarded to winning teams.
              </p>
            </div>

            <div className="offering-card">
              <div className="offering-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="4" y="12" width="24" height="16" rx="2" stroke="#cfddff" strokeWidth="1.5"/>
                  <path d="M11 12V9a5 5 0 0 1 10 0v3" stroke="#cfddff" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M10 20h12" stroke="#cfddff" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M10 24h8"  stroke="#cfddff" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="offering-title">Pro-Bono Consulting</h3>
              <p className="offering-desc">
                Through our consulting arm, student teams take on real engagements with local and
                national companies, delivering strategic recommendations at no cost to the client.
              </p>
              <div className="offering-see-below">↓ &nbsp;See below&nbsp; ↓</div>
            </div>

          </div>
        </div>
      </section>


      {/* ================================================
          LCG TEASER
      ================================================= */}
      <section className="lcg-teaser-section" id="lcg-teaser">
        <div className="container">
          <div className="lcg-teaser-grid">

            <div className="lcg-teaser-text">
              <div className="section-label">Pro‑Bono Consulting Arm</div>
              <h2 className="lcg-teaser-title">
                Laurier<br />
                <span className="accent">Consulting</span><br />
                Group
              </h2>
              <p className="body-text">
                LCG connects Laurier students with real companies. Teams of six student consultants take on
                live engagements, guided by mentors from top consulting firms. This is résumé‑defining
                experience, before graduation.
              </p>
              <a href="/lcg" className="btn btn-primary" style={{ marginTop: '8px' }}>Discover LCG →</a>
            </div>

            <LCGLogoTilt />

          </div>
        </div>
      </section>


      {/* ================================================
          CONTACT & SOCIALS
      ================================================= */}
      <section className="home-contact-section" id="contact">
        <div className="container">
          <div className="section-label">Get in Touch</div>
          <h2 className="section-title">Connect With LCC</h2>
          <p className="section-subtitle">Follow us, reach out, or just say hello.</p>
          <div className="contact-cards-grid">

            <a
              href="https://www.instagram.com/laurierconsultingclub/"
              className="contact-card"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="contact-card-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="3" y="3" width="26" height="26" rx="6" stroke="#cfddff" strokeWidth="1.5"/>
                  <circle cx="16" cy="16" r="6" stroke="#cfddff" strokeWidth="1.5"/>
                  <circle cx="23.5" cy="8.5" r="1.5" fill="#cfddff"/>
                </svg>
              </div>
              <h3 className="contact-card-label">Instagram</h3>
              <p className="contact-card-handle">@laurierconsultingclub</p>
            </a>

            <a
              href="https://www.linkedin.com/company/laurier-consulting-club/posts/?feedView=all"
              className="contact-card"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="contact-card-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="3" y="3" width="26" height="26" rx="4" stroke="#cfddff" strokeWidth="1.5"/>
                  <circle cx="10" cy="10" r="1.5" fill="#cfddff"/>
                  <path d="M10 14v9"    stroke="#cfddff" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M15 23v-5c0-2.2 1.8-4 4-4s4 1.8 4 4v5" stroke="#cfddff" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M15 14v9"    stroke="#cfddff" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="contact-card-label">LinkedIn</h3>
              <p className="contact-card-handle">Laurier Consulting Club</p>
            </a>

            <a href="mailto:lcc@lazsoc.ca" className="contact-card">
              <div className="contact-card-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="3" y="7" width="26" height="18" rx="3" stroke="#cfddff" strokeWidth="1.5"/>
                  <path d="M3 11l13 8 13-8" stroke="#cfddff" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="contact-card-label">Email</h3>
              <p className="contact-card-handle">lcc@lazsoc.ca</p>
            </a>

          </div>
        </div>
      </section>


      {/* ================================================
          FOOTER
      ================================================= */}
      <Footer />

    </>
  )
}
