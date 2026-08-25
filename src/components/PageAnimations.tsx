'use client'

// Drop this component into any inner page (About, Events, LCG, Contact).
// It runs the same heading + card stagger animations that main.js ran on the old HTML pages.

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function PageAnimations() {
  useEffect(() => {
    return // animations temporarily disabled
    gsap.registerPlugin(ScrollTrigger)

    // Page hero title — animates on load
    const heroTitle = document.querySelector('.page-hero-title, .lcg-page-hero-title')
    if (heroTitle) {
      gsap.from(heroTitle, { x: -36, opacity: 0, duration: 0.7, ease: 'power2.out', delay: 0.25 })
    }
    const heroSubtitle = document.querySelector('.page-hero-subtitle')
    if (heroSubtitle) {
      gsap.from(heroSubtitle, { x: -22, opacity: 0, duration: 0.55, ease: 'power2.out', delay: 0.42 })
    }

    // Section titles — on scroll
    gsap.utils.toArray<Element>(
      '.section-title, .lcg-teaser-title, .lcg-cta-title, .featured-title'
    ).forEach(el => {
      gsap.from(el, {
        x: -28, opacity: 0, duration: 0.65, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      })
    })

    // Section labels
    gsap.utils.toArray<Element>('.section-label, .team-tier-label').forEach(el => {
      gsap.from(el, {
        x: -18, opacity: 0, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%' },
      })
    })

    // Section subtitles
    gsap.utils.toArray<Element>('.section-subtitle').forEach(el => {
      gsap.from(el, {
        x: -14, opacity: 0, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%' },
      })
    })

    // Staggered card grids
    const grids = [
      '.offerings-grid', '.contact-cards-grid', '.values-grid', '.lcg-why-grid',
      '.lcg-steps', '.about-club-stats', '.lcg-clients-grid', '.lcg-tiles-grid',
      '.contact-list', '.sponsors-grid',
    ]
    grids.forEach(selector => {
      document.querySelectorAll(selector).forEach(grid => {
        const cards = Array.from(grid.children)
        if (!cards.length) return
        gsap.from(cards, {
          opacity: 0, y: 28, duration: 0.6, stagger: 0.07, ease: 'power2.out',
          scrollTrigger: { trigger: grid, start: 'top 88%' },
        })
      })
    })
  }, [])

  return null
}
