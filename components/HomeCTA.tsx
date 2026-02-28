import FadeIn from './FadeIn'

export default function HomeCTA() {
  return (
    <section className="px-8 py-28">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        <FadeIn>
          <h2
            className="font-serif text-ink tracking-[-0.025em] mb-4"
            style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}
          >
            let's talk.
          </h2>
          <a
            href="mailto:hello@befuji.com"
            className="font-sans text-sm text-ink hover:opacity-40 transition-opacity duration-200 inline-block mb-12"
          >
            hello@befuji.com
          </a>
        </FadeIn>

        <FadeIn delay={160}>
          <p
            className="font-sans text-xs tracking-widest mt-20"
            style={{ color: 'rgba(10,10,10,0.2)' }}
          >
            &copy; {new Date().getFullYear()} befuji
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
