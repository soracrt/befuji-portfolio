import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import FadeIn from '@/components/FadeIn'

// ─── Project data — keep in sync with app/work/page.tsx ──────────────────────
const projects = [
  {
    id: 'nsx-campaign',
    title: 'NSX Campaign',
    category: 'Ads',
    video: '/NSX.mp4',
    year: '2024',
    description:
      'A cinematic campaign for the Honda NSX, blending motion design with automotive storytelling.',
  },
  {
    id: 'saas-launch',
    title: 'SaaS Launch Film',
    category: 'SaaS',
    video: '/NSX.mp4',
    year: '2024',
    description:
      'Product launch video for a SaaS platform, focusing on clean UI animation and narrative flow.',
  },
  {
    id: 'brand-film',
    title: 'Brand Film',
    category: 'Ads',
    video: '/NSX.mp4',
    year: '2024',
    description:
      'Brand identity film communicating core values through motion and sound design.',
  },
  {
    id: 'product-demo',
    title: 'Product Demo',
    category: 'SaaS',
    video: '/NSX.mp4',
    year: '2024',
    description:
      'High-energy product demo built for conversion, featuring UI walkthroughs and feature highlights.',
  },
  {
    id: 'social-campaign',
    title: 'Social Campaign',
    category: 'Ads',
    video: '/NSX.mp4',
    year: '2023',
    description:
      'Short-form social content designed to stop the scroll and drive engagement.',
  },
  {
    id: 'app-promo',
    title: 'App Promo',
    category: 'SaaS',
    video: '/NSX.mp4',
    year: '2023',
    description:
      'App store promo video showcasing key features with minimal, modern aesthetics.',
  },
]
// ─────────────────────────────────────────────────────────────────────────────

// Placeholder reviews — replace with real data / a CMS later
const reviews = [
  {
    author: 'A. Reyes',
    company: 'Studio Co.',
    text: 'Incredibly smooth process. The final cut was exactly what we envisioned — clean, sharp, on brand.',
  },
  {
    author: 'M. Tanaka',
    company: 'Label Records',
    text: 'Fast turnaround, zero headaches. The motion work elevated the entire campaign.',
  },
]

export async function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }))
}

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const project = projects.find((p) => p.id === params.id)
  return {
    title: project ? `${project.title} — Befuji` : 'Work — Befuji',
  }
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const project = projects.find((p) => p.id === params.id)
  if (!project) notFound()

  return (
    <main>
      <Nav />

      <div className="pt-28 pb-24 px-8">
        <div className="max-w-7xl mx-auto">

          {/* Back link */}
          <FadeIn>
            <Link
              href="/work"
              className="font-sans text-xs tracking-[0.15em] uppercase text-ink border-b border-ink pb-0.5 hover:opacity-40 transition-opacity duration-200 inline-block mb-14"
            >
              ← Work
            </Link>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">

            {/* ── Video player (left, 3 cols) ─────────────────────────────── */}
            <div className="lg:col-span-3">
              <FadeIn>
                <div className="rounded-2xl overflow-hidden bg-[#111]">
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <video
                      className="absolute inset-0 w-full h-full object-cover"
                      src={project.video}
                      autoPlay
                      muted
                      loop
                      playsInline
                      controls
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <h1
                    className="font-sans font-medium text-ink tracking-[-0.02em]"
                    style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
                  >
                    {project.title}
                  </h1>
                  <p className="font-sans text-xs text-ink/40 mt-1.5 tracking-[0.12em] uppercase">
                    {project.category} · {project.year}
                  </p>
                  <p className="font-sans text-sm text-ink/60 leading-[1.9] mt-5 max-w-prose">
                    {project.description}
                  </p>
                </div>
              </FadeIn>
            </div>

            {/* ── Reviews (right, 2 cols) ──────────────────────────────────── */}
            <div className="lg:col-span-2">
              <FadeIn delay={120}>
                <div className="lg:border-l lg:border-divider lg:pl-10 pt-1">
                  <p className="font-sans text-xs tracking-[0.15em] uppercase text-ink/40 mb-7">
                    Reviews
                  </p>

                  <div className="flex flex-col gap-7">
                    {reviews.map((review, i) => (
                      <div key={i} className="pb-7 border-b border-divider">
                        <p className="font-sans text-sm text-ink/70 leading-[1.85] mb-4">
                          &ldquo;{review.text}&rdquo;
                        </p>
                        <p className="font-sans text-xs font-medium text-ink">{review.author}</p>
                        <p className="font-sans text-xs text-ink/40">{review.company}</p>
                      </div>
                    ))}
                  </div>

                  {/* Empty-state placeholder */}
                  <p className="font-sans text-xs text-ink/25 mt-4">
                    More reviews coming soon.
                  </p>
                </div>
              </FadeIn>
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}
