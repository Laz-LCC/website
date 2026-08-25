'use client'

import { useEffect } from 'react'

/**
 * Everything whose desktop reveal is driven by the cursor, and therefore has no
 * trigger at all on a phone: the sponsor logos crossfade to colour, the How It
 * Works steps highlight, and the LCG Advantage cards flip to their back face.
 *
 * Kept as one list so the touch behaviour cannot quietly drift away from the
 * hover behaviour it stands in for.
 */
const TARGETS = ['.sponsor-card', '.lcg-step', '.lcg-why-card'].join(', ')

/**
 * How far from the middle of the screen an element still counts as "the one
 * being looked at", in pixels. Elements sitting in the same grid row share a
 * vertical centre, so a whole row activates together and sweeps as you scroll,
 * which is the behaviour a band gives and a strict nearest-element search does
 * not.
 */
const BAND = 90

/**
 * Stands in for :hover on touch screens by marking whatever is currently in the
 * middle of the viewport with .touch-active. The CSS decides what that means
 * for each kind of element.
 *
 * Does nothing at all where a real cursor exists, so desktop behaviour is
 * untouched, and nothing where the visitor has asked for reduced motion.
 */
export default function TouchSpotlight() {
  useEffect(() => {
    if (window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let els: HTMLElement[] = []
    let rafId = 0

    function collect() {
      els = Array.from(document.querySelectorAll<HTMLElement>(TARGETS))
    }

    function apply() {
      rafId = 0
      const middle = window.innerHeight / 2
      for (const el of els) {
        const r = el.getBoundingClientRect()
        const centre = r.top + r.height / 2
        el.classList.toggle('touch-active', Math.abs(centre - middle) < BAND)
      }
    }

    // Coalesced into one frame: scroll fires far more often than the screen
    // repaints, and each pass reads the box of every target.
    function schedule() {
      if (!rafId) rafId = requestAnimationFrame(apply)
    }

    function onResize() {
      collect()
      schedule()
    }

    collect()
    schedule()

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(rafId)
      for (const el of els) el.classList.remove('touch-active')
    }
  }, [])

  return null
}
