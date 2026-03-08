import Link from 'next/link'

interface BackButtonProps {
  href: string
  label?: string
}

export default function BackButton({ href, label = 'Back' }: BackButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.1em] uppercase transition-all duration-200 hover:border-[rgba(238,229,233,0.22)] hover:bg-[rgba(238,229,233,0.08)] hover:text-[rgba(238,229,233,1)]"
      style={{
        height:               '34px',
        paddingLeft:          '14px',
        paddingRight:         '16px',
        borderRadius:         '9999px',
        background:           'rgba(238,229,233,0.05)',
        border:               '1px solid rgba(238,229,233,0.12)',
        color:                'rgba(238,229,233,0.72)',
        backdropFilter:       'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
      {label}
    </Link>
  )
}
