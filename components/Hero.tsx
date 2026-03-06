import FadeIn from './FadeIn'

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-8 text-center">
      <FadeIn delay={200}>
        <h1
          className="font-display leading-[0.95] tracking-[-0.04em]"
          style={{
            fontSize:  'clamp(3.5rem, 9vw, 8.5rem)',
            color:     '#EEE5E9',
            fontWeight: 400,
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
