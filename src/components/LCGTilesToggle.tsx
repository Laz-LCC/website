'use client'

import { useState } from 'react'

const TABS = [
  {
    key: 'industries',
    label: 'Industries',
    tiles: ['Healthcare', 'AI / Technology', 'Venture Capital', 'Non-Profit', 'Education', 'Consumer Goods'],
    columns: 3,
  },
  {
    key: 'engagements',
    label: 'Engagement Types',
    tiles: ['Growth Strategy', 'Go-to-Market Strategy', 'Pricing Strategy', 'Brand Strategy', 'Product Strategy', 'Operations Improvement'],
    columns: 3,
  },
]

export default function LCGTilesToggle() {
  const [active, setActive] = useState(0)

  const current = TABS[active]

  return (
    <section className="lcg-tiles-section">
      <div className="container">
        <div className="section-label">Our Work</div>
        <h2 className="section-title">Where We&apos;ve<br /><em>Operated.</em></h2>

        {/* Tab toggle */}
        <div className="lcg-tab-row">
          {TABS.map((tab, i) => (
            <button
              key={tab.key}
              className={`lcg-tab${active === i ? ' lcg-tab--active' : ''}`}
              onClick={() => setActive(i)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tiles — keyed to active so React remounts on switch, triggering CSS animation */}
        {/* Column count travels as a custom property rather than as an inline
            grid-template-columns: an inline value cannot be overridden by a
            media query, which locked this at three columns on a phone and
            squeezed labels like "AI / Technology" into unreadable slivers. */}
        <div
          key={current.key}
          className="lcg-tiles-grid lcg-tiles-animate"
          style={{ '--tile-cols': current.columns } as React.CSSProperties}
        >
          {current.tiles.map((tile, i) => (
            <div
              key={tile}
              className="lcg-tile"
              style={{ animationDelay: `${i * 0.055}s` }}
            >
              {tile}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
