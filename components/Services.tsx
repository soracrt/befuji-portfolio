import FadeIn from './FadeIn'

const services = [
  {
    title: 'Motion Design',
    description: 'From concept to final frame — movement that means something.',
  },
  {
    title: 'Video Editing',
    description: 'Tight cuts, clean pacing, story first.',
  },
  {
    title: 'Creative Direction',
    description: 'Visual strategy that guides every decision.',
  },
]

export default function Services() {
  return (
    <section id="services" className="px-8 py-24 border-t border-divider">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <h2
            className="font-serif text-white tracking-[-0.02em] mb-14"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            Services
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-divider">
          {services.map((service, i) => (
            <FadeIn key={service.title} delay={i * 80} className="border-r border-b border-divider">
              <div className="px-8 py-10 md:px-10 md:py-14 h-full">
                <h3
                  className="font-serif text-white tracking-tight mb-4"
                  style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)' }}
                >
                  {service.title}
                </h3>
                <p
                  className="font-sans text-sm leading-relaxed"
                  style={{ color: 'rgba(245,245,240,0.42)' }}
                >
                  {service.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
