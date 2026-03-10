'use client'

import { Facebook01Icon, InstagramIcon, NewTwitterIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { FC, useState } from 'react'

interface MenuItem {
  label: string
  href?: string
  onClick?: () => void
  asButton?: boolean
}

interface ArclightCmsHeaderProps {
  siteName: string
  logoUrl?: string | null
  logoDisplayMode?: string | null
  instagramUrl?: string | null
  facebookUrl?: string | null
  twitterUrl?: string | null
  onContactClick?: () => void
  className?: string
  bottomBorder?: boolean
}

const ArclightCmsHeader: FC<ArclightCmsHeaderProps> = ({
  siteName,
  logoUrl,
  logoDisplayMode,
  instagramUrl,
  facebookUrl,
  twitterUrl,
  onContactClick,
}) => {
  // Match TemplateA semantics:
  // - 'logo_only' (default): show only logo if present
  // - 'text_only': show only text
  // - 'both': show both logo and text
  const mode = logoDisplayMode || 'logo_only'
  const showLogo = !!logoUrl && mode !== 'text_only'
  const showText = !logoUrl || mode === 'text_only' || mode === 'both'

  // Menu items (no contact here)
  const menuItems: MenuItem[] = [
    {
      label: 'All Articles',
      href: '/categories',
    },
  ]

  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header
      className={clsx(
        'relative z-20 border-neutral-200 bg-white dark:border-neutral-700 dark:bg-[#0a0a0a] mb-8',
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-x-4 px-4 sm:h-20">
        {/* Left: Logo/Text */}
        <div className="flex items-center shrink-0">
          <Link href="/" className="flex items-center text-primary-600 dark:text-primary-500">
            {showLogo && (
              <span className="relative block h-10 w-16 shrink-0 overflow-hidden">
                <Image
                  src={logoUrl}
                  alt={siteName}
                  fill
                  className="object-contain"
                  sizes="112px"
                />
              </span>
            )}
            {showText && (
              <span className="font-medium italic text-3xl text-neutral-900 dark:text-neutral-100">{siteName}</span>
            )}
          </Link>
        </div>

        {/* Center: Nav (desktop / tablet) */}
        <div className="hidden flex-1 justify-center md:flex">
          <nav className="flex items-center gap-x-6">
            {menuItems.map((item, i) =>
              item.asButton ? (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.onClick}
                  className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.label}
                  href={item.href || '/'}
                  className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>
        </div>

        {/* Right: Socials and Contact (desktop / tablet) */}
        <div className="hidden items-center gap-x-6 md:flex">
          {/* Social Links */}
          {(facebookUrl || instagramUrl || twitterUrl) && (
            <ul className="flex items-center gap-x-3.5" aria-label="Social links">
              {facebookUrl && (
                <li>
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                    aria-label="Facebook"
                  >
                    <HugeiconsIcon icon={Facebook01Icon} size={20} />
                  </a>
                </li>
              )}
              {instagramUrl && (
                <li>
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                    aria-label="Instagram"
                  >
                    <HugeiconsIcon icon={InstagramIcon} size={20} />
                  </a>
                </li>
              )}
              {twitterUrl && (
                <li>
                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                    aria-label="Twitter"
                  >
                    <HugeiconsIcon icon={NewTwitterIcon} size={20} />
                  </a>
                </li>
              )}
            </ul>
          )}
          {/* Contact Button (as icon-like or regular button) */}
          {onContactClick && (
            <button
              type="button"
              onClick={onContactClick}
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
              style={{ minWidth: 0 }}
            >
              Contact
            </button>
          )}
        </div>

        {/* Mobile actions: only hamburger – contact & socials live inside the menu */}
        <div className="flex items-center gap-x-2 md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="inline-flex items-center justify-center rounded-md p-2 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-200 dark:hover:bg-[#262626] dark:hover:text-white"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            <span className="sr-only">Toggle navigation menu</span>
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {mobileOpen ? (
                <path
                  d="M6 18L18 6M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth={1.7}
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7H20M4 12H20M4 17H20"
                  stroke="currentColor"
                  strokeWidth={1.7}
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-neutral-200 bg-white dark:border-neutral-700 dark:bg-[#0a0a0a] md:hidden">
          <nav className="container flex flex-col space-y-1 px-4 py-3">
            {menuItems.map((item) =>
              item.asButton ? (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.onClick}
                  className="w-full rounded-md px-2 py-2 text-left text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-[#262626]"
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.label}
                  href={item.href || '/'}
                  className="w-full rounded-md px-2 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-[#262626]"
                >
                  {item.label}
                </Link>
              ),
            )}
            {(facebookUrl || instagramUrl || twitterUrl) && (
              <ul className="mt-3 flex items-center gap-x-3 border-t border-neutral-200 pt-3 dark:border-neutral-700" aria-label="Social links">
                {facebookUrl && (
                  <li>
                    <a
                      href={facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                      aria-label="Facebook"
                    >
                      <HugeiconsIcon icon={Facebook01Icon} size={20} />
                    </a>
                  </li>
                )}
                {instagramUrl && (
                  <li>
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                      aria-label="Instagram"
                    >
                      <HugeiconsIcon icon={InstagramIcon} size={20} />
                    </a>
                  </li>
                )}
                {twitterUrl && (
                  <li>
                    <a
                      href={twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                      aria-label="Twitter"
                    >
                      <HugeiconsIcon icon={NewTwitterIcon} size={20} />
                    </a>
                  </li>
                )}
              </ul>
            )}
            {onContactClick && (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false)
                  onContactClick()
                }}
                className="mt-1 w-full rounded-md px-2 py-2 text-left text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-[#262626]"
              >
                Contact
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

export default ArclightCmsHeader
