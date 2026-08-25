'use client'

// Shared hero background: animated particle canvas + diagonal line pattern + mouse parallax.
// Drop this as the first child inside any hero <section>.

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
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
      // Kept identical to the copy in src/app/page.tsx.
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

    // Attach mouse tracking + parallax to the parent hero section
    const heroEl  = canvas.closest('section') as HTMLElement | null
    const heroBg  = canvas.previousElementSibling as HTMLElement | null

    if (heroEl) {
      heroEl.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect()
        mouse.x = e.clientX - rect.left
        mouse.y = e.clientY - rect.top

        if (heroBg) {
          const r  = heroEl.getBoundingClientRect()
          const dx = (e.clientX - r.left  - r.width  / 2) / (r.width  / 2)
          const dy = (e.clientY - r.top   - r.height / 2) / (r.height / 2)
          gsap.to(heroBg, { x: dx * 20, y: dy * 14, duration: 1.2, ease: 'power2.out' })
        }
      }, { passive: true })

      heroEl.addEventListener('mouseleave', () => {
        mouse.x = -9999; mouse.y = -9999
        if (heroBg) gsap.to(heroBg, { x: 0, y: 0, duration: 1.5, ease: 'power2.out' })
      })
    }

    window.addEventListener('resize', resize)
    resize()
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <>
      <div className="hero-bg-pattern"></div>
      <canvas className="hero-canvas" ref={canvasRef}></canvas>
    </>
  )
}
