'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import './StaggeredMenu.css'

interface NavItem {
  label: string
  ariaLabel: string
  link: string
}

interface SocialItem {
  label: string
  link: string
}

interface StaggeredMenuProps {
  position?: 'left' | 'right'
  items: NavItem[]
  socialItems?: SocialItem[]
  displaySocials?: boolean
  displayItemNumbering?: boolean
  menuButtonColor?: string
  openMenuButtonColor?: string
  changeMenuColorOnOpen?: boolean
  colors?: string[]
  logoUrl?: string
  accentColor?: string
  isFixed?: boolean
}

export default function StaggeredMenu({
  items,
  socialItems = [],
  displaySocials = false,
  displayItemNumbering = false,
  menuButtonColor = '#000000',
  openMenuButtonColor = '#ffffff',
  changeMenuColorOnOpen = true,
  logoUrl,
}: StaggeredMenuProps) {
  const [open, setOpen] = useState(false)

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const triggerColor = open && changeMenuColorOnOpen ? openMenuButtonColor : menuButtonColor

  return (
    <>
      <button
        className={`staggered-menu-trigger${open ? ' open' : ''}`}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen(prev => !prev)}
        style={{ color: triggerColor }}
      >
        <span />
        <span />
        <span />
      </button>

      <div className={`staggered-menu-panel${open ? ' open' : ''}`} aria-hidden={!open}>
        <nav className="sm-panel-nav">
          {items.map((item, i) => {
            const isExternal = item.link.startsWith('http')
            const content = (
              <span className="sm-panel-item" onClick={() => setOpen(false)}>
                {displayItemNumbering && (
                  <span className="sm-item-number">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                )}
                {item.label}
              </span>
            )

            return (
              <div key={item.label} className="sm-panel-item-wrap">
                {isExternal ? (
                  <a
                    href={item.link}
                    aria-label={item.ariaLabel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sm-panel-item"
                    onClick={() => setOpen(false)}
                  >
                    {displayItemNumbering && (
                      <span className="sm-item-number">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    )}
                    {item.label}
                  </a>
                ) : (
                  <Link
                    href={item.link}
                    aria-label={item.ariaLabel}
                    className="sm-panel-item"
                    onClick={() => setOpen(false)}
                  >
                    {displayItemNumbering && (
                      <span className="sm-item-number">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    )}
                    {item.label}
                  </Link>
                )}
              </div>
            )
          })}
        </nav>

        <div className="sm-panel-bottom">
          {displaySocials && socialItems.length > 0 && (
            <div className="sm-socials">
              <p className="sm-socials-title">Find me on</p>
              <div className="sm-socials-links">
                {socialItems.map(social => (
                  <a
                    key={social.label}
                    href={social.link}
                    className="sm-socials-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          {logoUrl && (
            <img src={logoUrl} alt="logo" className="sm-panel-logo" />
          )}
        </div>
      </div>
    </>
  )
}
