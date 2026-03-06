import FadeIn from './FadeIn'

const stats = [
  '25+ projects delivered',
  '2,600+ community members',
  '4 brands worked with',
]

export default function StatsBar() {
  return (
    <FadeIn delay={100}>
      <div
        className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 px-8 pb-24"
      >
        {stats.map((stat, i) => (
          <span key={i} className="flex items-center gap-8">
            <span
              className="font-sans text-xs tracking-[0.08em]"
              style={{ color: 'rgba(238,229,233,0.35)' }}
            >
              {stat}
            </span>
            {i < stats.length - 1 && (
              <span style={{ color: 'rgba(238,229,233,0.15)', fontSize: '10px' }}>·</span>
            )}
          </span>
        ))}
      </div>
    </FadeIn>
  )
}
