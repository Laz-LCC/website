'use client'

import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
  /** The final number to count to. */
  value: number
  /** Rendered straight after the number, e.g. the "+" in "10+". */
  suffix?: string
  /** Milliseconds the count takes. */
  duration?: number
}

/** Ease-out cubic: fast at the start, settling gently onto the final number. */
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

/**
 * Counts from 0 up to `value` the first time it scrolls into view.
 *
 * Uses IntersectionObserver + requestAnimationFrame to match how the sponsor
 * flashlight in page.tsx already works, rather than pulling in an animation
 * library for a single number tween.
 *
 * The displayed number is React state, and it starts at the FINAL value so the
 * server-rendered HTML is correct with JavaScript disabled. The client drops it
 * to 0 on mount, well before this section is scrolled to, so the reset is never
 * visible. Users with reduced motion enabled keep the final value throughout.
 */
export default function CountUp({ value, suffix = '', duration = 1600 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // If the stats are already on screen at mount, there is no honest way to
    // animate from zero: the server has already painted the real number, so
    // counting up would show a flick from "10+" to "0+" and back. That happens
    // on a tall monitor, or on a refresh that restores scroll position. Keep
    // the real value and skip the animation for those loads.
    if (el.getBoundingClientRect().top < window.innerHeight) return

    setDisplay(0)

    let frame = 0
    let start = 0

    function tick(now: number) {
      if (!start) start = now
      const progress = Math.min((now - start) / duration, 1)
      setDisplay(Math.round(easeOut(progress) * value))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    let backstop: ReturnType<typeof setTimeout>

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect() // count once, not on every pass
        frame = requestAnimationFrame(tick)
        // Some environments throttle requestAnimationFrame to almost nothing
        // (an occluded or backgrounded window). Without this the number would
        // simply sit at 0, which is worse than never having animated. Landing
        // on the real value late is always better than showing a wrong one.
        backstop = setTimeout(() => setDisplay(value), duration + 600)
      },
      { threshold: 0.5 },
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      clearTimeout(backstop)
    }
  }, [value, duration])

  return <span ref={ref}>{display}{suffix}</span>
}
