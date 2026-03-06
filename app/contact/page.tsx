import Footer from '@/components/Footer'

export default function ContactPage() {
  return (
    <main>
      <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center">
        <h1
          className="font-display"
          style={{
            fontSize:     'clamp(3.5rem, 9vw, 8.5rem)',
            color:        '#EEE5E9',
            fontWeight:   400,
            letterSpacing: '-0.04em',
            lineHeight:   0.95,
          }}
        >
          Contact<span style={{ color: '#CF5C36' }}>.</span>
        </h1>
        <p
          className="font-sans mt-6"
          style={{ fontSize: '14px', color: 'rgba(238,229,233,0.3)', letterSpacing: '0.01em' }}
        >
          This page is coming soon.
        </p>
      </div>

      <Footer />
    </main>
  )
}
