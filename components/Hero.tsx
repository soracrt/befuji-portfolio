import FadeIn from './FadeIn'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-8 text-center overflow-hidden">

      {/* Lamp fixture — thin bar at top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2"
        style={{ width: '240px', height: '1px', background: 'rgba(238,229,233,0.15)' }}
      />

      {/* Lamp cone — wide radial beam downward */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: '900px',
          height: '75vh',
          background: 'conic-gradient(from 270deg at 50% 0%, transparent 30%, rgba(207,92,54,0.055) 43%, rgba(238,229,233,0.09) 50%, rgba(207,92,54,0.055) 57%, transparent 70%)',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
        }}
      />

      {/* Soft white pool of light at top center */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: '500px',
          height: '280px',
          background: 'radial-gradient(ellipse 50% 60% at 50% 0%, rgba(238,229,233,0.07) 0%, transparent 100%)',
        }}
      />

      {/* Text lit by the lamp */}
      <FadeIn delay={200}>
        <h1
          className="font-display leading-[0.95] tracking-[-0.04em] relative z-10"
          style={{
            fontSize:   'clamp(3.5rem, 9vw, 8.5rem)',
            color:      '#EEE5E9',
            fontWeight: 400,
            textShadow: '0 0 80px rgba(238,229,233,0.08)',
          }}
        >
          <span className="block">
            motion<span style={{ color: '#CF5C36' }}>.</span>
          </span>
          <span className="block">
            web<span style={{ color: '#CF5C36' }}>.</span>
          </span>
          <span className="block">
            community<span style={{ color: '#CF5C36' }}>.</span>
          </span>
        </h1>
      </FadeIn>

    </section>
  )
}
