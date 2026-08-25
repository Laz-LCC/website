import type { Metadata } from 'next'
import './globals.css'
import SiteCursor from '@/components/SiteCursor'
import TouchSpotlight from '@/components/TouchSpotlight'
import { SpeedInsights } from '@vercel/speed-insights/next'

const SITE_DESCRIPTION =
  'Laurier Consulting Club runs networking mixers, workshops, and case competitions ' +
  'open to every Wilfrid Laurier University student, alongside the pro-bono ' +
  'consulting engagements of the Laurier Consulting Group.'

// Absolute URLs for social preview cards are built from this. Set
// NEXT_PUBLIC_SITE_URL in the Vercel project to the real domain once it is
// known; the Vercel-provided URL is used as a fallback for preview builds.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Laurier Consulting Club',
  description: SITE_DESCRIPTION,
  // opengraph-image.png sits next to this file, so Next fills in the image
  // tags (url, type, dimensions) automatically.
  openGraph: {
    title: 'Laurier Consulting Club',
    description: SITE_DESCRIPTION,
    siteName: 'Laurier Consulting Club',
    url: SITE_URL,
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Laurier Consulting Club',
    description: SITE_DESCRIPTION,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Poppins:wght@300;400;600;700;800&family=Playfair+Display:ital,wght@0,700;1,700&display=swap"
          rel="stylesheet"
        />
        {/* Subresource integrity: the browser refuses this stylesheet if its
            bytes do not hash to the value below, so a compromised cdnjs cannot
            silently serve something else. The hash is of Font Awesome 6.5.1
            specifically, so it MUST be recomputed if the version in the URL
            changes, or the icons stop loading entirely.
            Recompute with: curl -s <url> | openssl dgst -sha384 -binary | openssl base64 -A
            The Google Fonts link above deliberately has no integrity hash: that
            endpoint serves different CSS per browser, so a fixed hash would
            break the fonts for some visitors. */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha384-t1nt8BQoYMLFN5p42tRAtuAAFQaCQODekUVeKKZrEnEyp4H2R0RHFz0KWpmj7i8g"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {/* Custom cursor, mounted site-wide. Self-disables on touch devices
            and for reduced-motion users. */}
        <SiteCursor />
        {/* The other half of the pair: on touch screens, where SiteCursor
            disables itself, this drives the same reveals from scroll position. */}
        <TouchSpotlight />
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
