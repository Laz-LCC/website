'use client'

import { useEffect, useRef, useState } from 'react'

/** Everything the cursor should lock onto. */
const TARGETS = [
  // Big surfaces only. Buttons and the small LCG tiles keep their own hover
  // styling, and the sponsor cards keep their flashlight effect, so the frame
  // never competes with an effect that is already doing the job.
  '.stat-card',
  '.offering-card',
  '.contact-card',
  '.contact-item',
  '.value-card',
  '.event-card',
  '.lcg-step',
].join(', ')

/**
 * Anything here suppresses the frame even when it sits inside a target card.
 * Several buttons live inside event cards, and locking the whole card while
 * the pointer is on its button looked wrong. Buttons keep their own lift and
 * glow instead.
 */
const EXCLUDED = '.btn, .lcg-client-cta-btn, .lcg-tab'

/** Diameter of the pointer dot. */
const DOT_SIZE = 14

/**
 * Two separate elements, on purpose:
 *
 * - the dot always follows the pointer, including while over a card, so the
 *   pointer never disappears;
 * - the frame snaps to a hovered card at exactly its bounding box, borrowing
 *   the card's own border radius, so it sits one-to-one on the card's border
 *   rather than floating around it.
 *
 * While locked the frame is pinned to the card and ignores pointer movement,
 * so moving around inside a card leaves it perfectly still. Movement between
 * cards is a CSS transition, which is what produces the glide and avoids a
 * permanent animation frame loop.
 */
export default function SiteCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setEnabled(finePointer && !reduced)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const dot = dotRef.current
    const frame = frameRef.current
    if (!dot || !frame) return

    let locked: Element | null = null

    function lockTo(el: Element) {
      if (!frame) return
      const r = el.getBoundingClientRect()
      // Exactly the card's box. The 1px border is drawn inside via box-sizing,
      // so the frame lands on the card's own edge rather than outside it.
      frame.style.width = `${r.width}px`
      frame.style.height = `${r.height}px`
      frame.style.borderRadius = getComputedStyle(el).borderRadius
      frame.style.transform = `translate3d(${r.left}px, ${r.top}px, 0)`
      frame.style.opacity = '1'
    }

    function unlock() {
      if (!frame) return
      frame.style.opacity = '0'
    }

    function onMove(e: MouseEvent) {
      // The dot tracks the pointer at all times.
      if (dot) {
        dot.style.transform = `translate3d(${e.clientX - DOT_SIZE / 2}px, ${e.clientY - DOT_SIZE / 2}px, 0)`
      }

      const el = e.target as Element | null
      // A button inside a card wins: the frame stays off so the button's own
      // hover styling is the only feedback.
      const onExcluded = !!el?.closest?.(EXCLUDED)
      const hit = onExcluded ? null : (el?.closest?.(TARGETS) ?? null)

      if (hit) {
        // Re-pin only when moving to a DIFFERENT card. Staying inside the same
        // one must not move the frame, otherwise it drifts with the pointer.
        if (hit !== locked) {
          locked = hit
          lockTo(hit)
        }
        return
      }

      if (locked) {
        locked = null
        unlock()
      }
    }

    function onLeave() {
      if (dot) dot.style.opacity = '0'
      unlock()
      locked = null
    }
    function onEnter() {
      if (dot) dot.style.opacity = '1'
    }

    // A pinned frame is tied to a viewport position, so it has to be refreshed
    // when the page moves underneath it. Coalesced into an animation frame:
    // lockTo reads getBoundingClientRect and getComputedStyle, and running that
    // on every scroll event forces a layout per event rather than per frame.
    let rafId = 0
    function onScrollOrResize() {
      if (!locked || rafId) return
      rafId = requestAnimationFrame(() => {
        rafId = 0
        if (!locked) return
        if (locked.isConnected) lockTo(locked)
        else { locked = null; unlock() }
      })
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
      cancelAnimationFrame(rafId)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div className="site-cursor-frame" ref={frameRef} aria-hidden="true" />
      <div className="site-cursor-dot" ref={dotRef} aria-hidden="true" />
    </>
  )
}
