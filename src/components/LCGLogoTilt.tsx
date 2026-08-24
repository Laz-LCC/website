'use client'

import { useEffect, useRef } from 'react'

const LOGO_SRC = '/LCC Brand Kit/Laurier Consulting Group (LCG) (Image Only).png'

/** Maximum rotation in degrees. Small on purpose: this should read as the mark
 *  turning to face you, not as an animation. */
const MAX_TILT = 6

/**
 * The LCG mark turns to face the pointer.
 *
 * Tracking is bound to the document rather than the teaser section, so the
 * mark keeps facing the cursor wherever it is on the page instead of only
 * responding once the pointer is nearby. The angle is normalised against the
 * viewport, so the mark leans further as the pointer gets further away but
 * never past MAX_TILT.
 *
 * Smoothing comes from a CSS transition, which means one property write per
 * mouse event and no permanent animation frame loop.
 */
export default function LCGLogoTilt() {
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!imgRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Explicitly typed rather than relying on the null check above: TypeScript
    // does not carry that narrowing into the hoisted functions below, since it
    // cannot prove they are only called after it.
    const img: HTMLImageElement = imgRef.current

    let inView = false
    let rafId = 0
    let lastX = 0
    let lastY = 0

    function apply() {
      rafId = 0
      const r = img.getBoundingClientRect()
      if (r.width === 0) return

      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2

      // -1..1 across the viewport, so the mark keeps facing the pointer no
      // matter where on the page it is.
      const dx = Math.max(-1, Math.min(1, (lastX - cx) / (window.innerWidth / 2)))
      const dy = Math.max(-1, Math.min(1, (lastY - cy) / (window.innerHeight / 2)))

      img.style.transform =
        `perspective(1000px) rotateX(${(-dy * MAX_TILT).toFixed(2)}deg) rotateY(${(dx * MAX_TILT).toFixed(2)}deg)`
    }

    // Two changes from the naive version: the work is coalesced into one
    // animation frame rather than running a layout read per mouse event, and it
    // is gated on visibility. The teaser sits near the bottom of a long page,
    // so without the gate every mouse move anywhere on the site was measuring
    // an element nobody could see. The sponsor grid in page.tsx already gates
    // this way; this now matches it.
    function onMove(e: MouseEvent) {
      if (!inView) return
      lastX = e.clientX
      lastY = e.clientY
      if (!rafId) rafId = requestAnimationFrame(apply)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        // Settle back to neutral on the way out, so the mark is not frozen
        // mid-tilt the next time it scrolls into view.
        if (!inView) img.style.transform = ''
      },
      { threshold: 0 },
    )
    observer.observe(img)

    document.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      observer.disconnect()
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div className="lcg-teaser-logo">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={imgRef} src={LOGO_SRC} alt="Laurier Consulting Group" />
    </div>
  )
}
