interface EventCoverGraphicProps {
  logoSrc?: string
}

export default function EventCoverGraphic({
  logoSrc = '/LCC Brand Kit/Laurier Consulting Group (LCG) (Full Logo).png',
}: EventCoverGraphicProps) {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      background: 'radial-gradient(at 50% 50%, #214162 0%, #0b2337 45%, #081b2b 80%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>

      {/* Diagonal line pattern — matches .hero-bg-pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'repeating-linear-gradient(-55deg, transparent, transparent 52px, rgba(207,221,255,0.07) 52px, rgba(207,221,255,0.07) 53px)',
        pointerEvents: 'none',
      }} />

      {/* LCG logo — centered */}
      {logoSrc && (
        <img
          src={logoSrc}
          alt="LCG logo"
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            maxWidth: '200px',
            height: 'auto',
            opacity: 0.85,
            filter: 'drop-shadow(0 0 40px rgba(207,221,255,0.18))',
            display: 'block',
          }}
        />
      )}

    </div>
  )
}
