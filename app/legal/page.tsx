import Link from 'next/link'

export const metadata = {
  title: 'Legal — Kulaire Studio Terms',
  description: 'Kulaire Studio Terms of Service covering payments, revisions, pause fees, and portfolio rights.',
}

export default function LegalPage() {
  return (
    <main
      className="min-h-screen w-full px-6 py-16"
      style={{ background: '#000000', color: '#EEE5E9' }}
    >
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.1em] uppercase mb-16 transition-opacity duration-150 hover:opacity-60"
          style={{ color: 'rgba(238,229,233,0.4)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-16">
          <p
            className="font-sans text-xs tracking-[0.15em] uppercase mb-4"
            style={{ color: '#CF5C36' }}
          >
            Kulaire Studio
          </p>
          <h1
            className="font-display font-bold leading-[1.05] mb-6"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.03em', color: '#EEE5E9' }}
          >
            Studio Terms
          </h1>
          <p
            className="font-sans text-sm leading-relaxed"
            style={{ color: 'rgba(238,229,233,0.4)', maxWidth: '52ch' }}
          >
            These terms apply to all projects undertaken by Kulaire Studio. By proceeding with any project, you confirm that you have read and understood the following.
          </p>
          <div className="mt-8" style={{ borderTop: '1px solid rgba(238,229,233,0.08)' }} />
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-14">

          {/* 01 Payments */}
          <section>
            <p className="font-sans text-xs tracking-[0.15em] uppercase mb-3" style={{ color: 'rgba(238,229,233,0.25)' }}>
              01
            </p>
            <h2
              className="font-display font-bold mb-6"
              style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', letterSpacing: '-0.02em', color: '#EEE5E9' }}
            >
              Payments
            </h2>
            <div className="flex flex-col gap-4 font-sans text-sm leading-relaxed" style={{ color: 'rgba(238,229,233,0.55)' }}>
              <p>
                All projects are billed on a three-part payment schedule designed to protect both parties and keep the project moving forward without friction.
              </p>
              <ul className="flex flex-col gap-3 pl-1">
                {[
                  ['50% upfront', 'Required to begin any project. No work starts before this payment clears.'],
                  ['25% at midpoint', 'Due upon delivery of the first draft or midpoint milestone, whichever comes first.'],
                  ['25% on completion', 'Final payment is due before final files, source assets, or live deployment are handed over.'],
                ].map(([label, desc]) => (
                  <li key={label} className="flex gap-3">
                    <span style={{ color: '#CF5C36', flexShrink: 0 }}>&gt;</span>
                    <span>
                      <span style={{ color: '#EEE5E9', fontWeight: 600 }}>{label}.</span>{' '}{desc}
                    </span>
                  </li>
                ))}
              </ul>
              <p>
                Invoices left unpaid beyond 7 days of the due date may result in work being paused or project cancellation, with deposits non-refundable.
              </p>
            </div>
          </section>

          <div style={{ borderTop: '1px solid rgba(238,229,233,0.06)' }} />

          {/* 02 Revisions */}
          <section>
            <p className="font-sans text-xs tracking-[0.15em] uppercase mb-3" style={{ color: 'rgba(238,229,233,0.25)' }}>
              02
            </p>
            <h2
              className="font-display font-bold mb-6"
              style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', letterSpacing: '-0.02em', color: '#EEE5E9' }}
            >
              Revisions
            </h2>
            <div className="flex flex-col gap-4 font-sans text-sm leading-relaxed" style={{ color: 'rgba(238,229,233,0.55)' }}>
              <p>
                Each project includes two rounds of revisions per deliverable. A revision round is defined as a single consolidated set of feedback submitted at one time.
              </p>
              <ul className="flex flex-col gap-3 pl-1">
                {[
                  'Revisions must be submitted as a single, organized list. Piecemeal feedback sent across multiple messages does not reset or extend the revision count.',
                  'Feedback that constitutes a change in direction, a new concept, or a scope expansion is not considered a revision and will be quoted separately.',
                  'Additional revision rounds beyond the two included are available at a flat rate agreed upon before work resumes.',
                ].map((text, i) => (
                  <li key={i} className="flex gap-3">
                    <span style={{ color: '#CF5C36', flexShrink: 0 }}>&gt;</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <div style={{ borderTop: '1px solid rgba(238,229,233,0.06)' }} />

          {/* 03 Pause Fee */}
          <section>
            <p className="font-sans text-xs tracking-[0.15em] uppercase mb-3" style={{ color: 'rgba(238,229,233,0.25)' }}>
              03
            </p>
            <h2
              className="font-display font-bold mb-6"
              style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', letterSpacing: '-0.02em', color: '#EEE5E9' }}
            >
              Pause Fee
            </h2>
            <div className="flex flex-col gap-4 font-sans text-sm leading-relaxed" style={{ color: 'rgba(238,229,233,0.55)' }}>
              <p>
                When a client requests to pause or delay an active project, a pause fee of <span style={{ color: '#EEE5E9', fontWeight: 600 }}>$50</span> applies. This fee covers the cost of rescheduling, holding the project slot, and re-onboarding when the project resumes.
              </p>
              <ul className="flex flex-col gap-3 pl-1">
                {[
                  'A pause is defined as any client-initiated delay of more than 5 business days during an active project.',
                  'The pause fee is due before the project is placed back into the active queue.',
                  'Projects paused for more than 30 days without communication may be considered abandoned, with all payments made retained.',
                ].map((text, i) => (
                  <li key={i} className="flex gap-3">
                    <span style={{ color: '#CF5C36', flexShrink: 0 }}>&gt;</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <div style={{ borderTop: '1px solid rgba(238,229,233,0.06)' }} />

          {/* 04 Portfolio Rights */}
          <section>
            <p className="font-sans text-xs tracking-[0.15em] uppercase mb-3" style={{ color: 'rgba(238,229,233,0.25)' }}>
              04
            </p>
            <h2
              className="font-display font-bold mb-6"
              style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', letterSpacing: '-0.02em', color: '#EEE5E9' }}
            >
              Portfolio Rights
            </h2>
            <div className="flex flex-col gap-4 font-sans text-sm leading-relaxed" style={{ color: 'rgba(238,229,233,0.55)' }}>
              <p>
                Kulaire Studio retains the right to display all completed work in its portfolio, case studies, social media, and promotional materials unless a written NDA or confidentiality agreement is in place prior to the project start.
              </p>
              <ul className="flex flex-col gap-3 pl-1">
                {[
                  'Client owns full rights to the final deliverables upon completion of all payments.',
                  'Kulaire retains the right to showcase the work publicly unless explicitly restricted by a signed agreement.',
                  'Work-in-progress assets, raw files, and unused concepts remain the property of Kulaire Studio.',
                ].map((text, i) => (
                  <li key={i} className="flex gap-3">
                    <span style={{ color: '#CF5C36', flexShrink: 0 }}>&gt;</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

        </div>

        {/* Footer note */}
        <div className="mt-20 pt-8" style={{ borderTop: '1px solid rgba(238,229,233,0.08)' }}>
          <p className="font-sans text-xs leading-relaxed" style={{ color: 'rgba(238,229,233,0.2)' }}>
            Last updated March 2026. These terms are subject to change. Continued engagement with Kulaire Studio constitutes acceptance of the current version.
          </p>
        </div>

      </div>
    </main>
  )
}
