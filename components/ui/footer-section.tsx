'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion } from 'motion/react'
import { InstagramIcon } from 'lucide-react'

function FadeIn({ delay = 0, children, className }: { delay?: number; children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>
  return (
    <motion.div
      initial={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.7 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function LinkGroup({ label, links, delay }: {
  label: string
  delay: number
  links: { title: string; href: string; external?: boolean; icon?: React.ComponentType<{ className?: string }> }[]
}) {
  return (
    <FadeIn delay={delay}>
      <h3
        className="font-sans text-[10px] tracking-[0.2em] uppercase mb-4"
        style={{ color: 'rgba(238,229,233,0.3)' }}
      >
        {label}
      </h3>
      <ul className="flex flex-col gap-2.5">
        {links.map(link => {
          const inner = (
            <span className="inline-flex items-center gap-1.5">
              {link.icon && <link.icon className="w-3 h-3" />}
              {link.title}
            </span>
          )
          const cls = "font-sans text-xs transition-opacity duration-150 hover:opacity-60"
          const style = { color: 'rgba(238,229,233,0.5)' }
          return (
            <li key={link.title}>
              {link.external
                ? <a href={link.href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>{inner}</a>
                : <Link href={link.href} className={cls} style={style}>{inner}</Link>
              }
            </li>
          )
        })}
      </ul>
    </FadeIn>
  )
}

export function FooterSection() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="relative w-full rounded-t-3xl px-10 py-12"
      style={{
        background: `radial-gradient(40% 120px at 50% 0%, rgba(207,92,54,0.07), transparent), #0a0a0a`,
        border: '1px solid rgba(238,229,233,0.06)',
        borderBottom: 'none',
      }}
    >
      {/* Top glow line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-px h-px w-1/3 rounded-full"
        style={{ background: 'rgba(207,92,54,0.5)', filter: 'blur(3px)' }}
      />

      {/* Single flat grid: brand + 3 link columns */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">

        {/* Brand */}
        <FadeIn delay={0} className="flex flex-col gap-4 col-span-2 sm:col-span-1">
          <Image src="/logo.png" alt="kulaire" width={88} height={22} className="h-5 w-auto opacity-80" />
          <p
            className="font-sans text-xs leading-relaxed"
            style={{ color: 'rgba(238,229,233,0.25)', maxWidth: '180px' }}
          >
            Motion design, brand films, and web — built with intention.
          </p>
          <p className="font-sans text-xs" style={{ color: 'rgba(238,229,233,0.15)' }}>
            &copy; {year} Kulaire.
          </p>
        </FadeIn>

        {/* Navigate */}
        <LinkGroup
          label="Navigate"
          delay={0.08}
          links={[
            { title: 'Work',    href: '/work' },
            { title: 'Reviews', href: '/reviews' },
            { title: 'FAQ',     href: '/faq' },
            { title: 'Contact', href: '/contact' },
          ]}
        />

        {/* Services */}
        <LinkGroup
          label="Services"
          delay={0.14}
          links={[
            { title: 'Motion Design',   href: '/contact' },
            { title: 'Brand Films',     href: '/contact' },
            { title: 'SaaS Videos',     href: '/contact' },
            { title: 'Web Development', href: '/contact' },
          ]}
        />

        {/* Connect */}
        <LinkGroup
          label="Connect"
          delay={0.2}
          links={[
            { title: '@soracrt', href: 'https://instagram.com/soracrt', external: true, icon: InstagramIcon },
          ]}
        />

      </div>
    </footer>
  )
}
