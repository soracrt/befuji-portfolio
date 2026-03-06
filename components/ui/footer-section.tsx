'use client'

import React from 'react'
import type { ComponentProps, ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion } from 'motion/react'
import { InstagramIcon } from 'lucide-react'

interface FooterLink {
  title: string
  href: string
  external?: boolean
  icon?: React.ComponentType<{ className?: string }>
}

interface FooterSection {
  label: string
  links: FooterLink[]
}

const footerLinks: FooterSection[] = [
  {
    label: 'Navigate',
    links: [
      { title: 'Work',     href: '/work' },
      { title: 'Reviews',  href: '/reviews' },
      { title: 'FAQ',      href: '/faq' },
      { title: 'Contact',  href: '/contact' },
    ],
  },
  {
    label: 'Services',
    links: [
      { title: 'Motion Design',      href: '/contact' },
      { title: 'Brand Films',        href: '/contact' },
      { title: 'SaaS Videos',        href: '/contact' },
      { title: 'Web Development',    href: '/contact' },
    ],
  },
  {
    label: 'Connect',
    links: [
      { title: '@soracrt', href: 'https://instagram.com/soracrt', external: true, icon: InstagramIcon },
    ],
  },
]

type ViewAnimationProps = {
  delay?: number
  className?: ComponentProps<typeof motion.div>['className']
  children: ReactNode
}

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion()
  if (shouldReduceMotion) return <>{children}</>
  return (
    <motion.div
      initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.7 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function FooterSection() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center rounded-t-3xl px-10 py-12"
      style={{
        background: `radial-gradient(35% 128px at 50% 0%, rgba(207,92,54,0.06), transparent), #0a0a0a`,
        borderTop: '1px solid rgba(238,229,233,0.06)',
        borderLeft: '1px solid rgba(238,229,233,0.06)',
        borderRight: '1px solid rgba(238,229,233,0.06)',
      }}
    >
      {/* Top glow line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-px h-px w-1/3 rounded-full"
        style={{ background: 'rgba(207,92,54,0.4)', filter: 'blur(2px)' }}
      />

      <div className="grid w-full gap-10 xl:grid-cols-3 xl:gap-8">

        {/* Brand column */}
        <AnimatedContainer className="flex flex-col gap-4">
          <Image src="/logo.png" alt="kulaire" width={88} height={22} className="h-5 w-auto opacity-80" />
          <p
            className="font-sans text-xs leading-relaxed"
            style={{ color: 'rgba(238,229,233,0.25)', maxWidth: '200px' }}
          >
            Motion design, brand films, and web — built with intention.
          </p>
          <p className="font-sans text-xs" style={{ color: 'rgba(238,229,233,0.15)' }}>
            &copy; {year} Kulaire. All rights reserved.
          </p>
        </AnimatedContainer>

        {/* Link columns */}
        <div className="grid grid-cols-3 gap-8 xl:col-span-2">
          {footerLinks.map((section, index) => (
            <AnimatedContainer key={section.label} delay={0.1 + index * 0.08}>
              <h3
                className="font-sans text-[10px] tracking-[0.2em] uppercase mb-4"
                style={{ color: 'rgba(238,229,233,0.35)' }}
              >
                {section.label}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {section.links.map(link => (
                  <li key={link.title}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-sans text-xs inline-flex items-center gap-1.5 transition-opacity duration-150 hover:opacity-60"
                        style={{ color: 'rgba(238,229,233,0.5)' }}
                      >
                        {link.icon && <link.icon className="w-3 h-3" />}
                        {link.title}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="font-sans text-xs inline-flex items-center gap-1.5 transition-opacity duration-150 hover:opacity-60"
                        style={{ color: 'rgba(238,229,233,0.5)' }}
                      >
                        {link.icon && <link.icon className="w-3 h-3" />}
                        {link.title}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </AnimatedContainer>
          ))}
        </div>

      </div>
    </footer>
  )
}
