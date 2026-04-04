'use client'

import { Facebook01Icon, InstagramIcon, NewTwitterIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export interface FooterProps {
  siteName: string
  subHeading?: string | null
  logoUrl?: string | null
  logoDisplayMode?: string | null
  instagramUrl?: string | null
  facebookUrl?: string | null
  twitterUrl?: string | null
}

const Footer: React.FC<FooterProps> = ({
  siteName,
  subHeading,
  logoUrl,
  logoDisplayMode,
  instagramUrl,
  facebookUrl,
  twitterUrl,
}) => {
  const mode = logoDisplayMode || 'logo_only'
  const showLogo = !!logoUrl && mode !== 'text_only'
  const showText = !logoUrl || mode === 'text_only' || mode === 'both'

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/contact', label: 'Contact' },
  ]

  const hasSocials = !!(facebookUrl || instagramUrl || twitterUrl)

  return (
    <div className="nc-Footer relative border-t border-neutral-200 py-16 lg:py-24 dark:border-neutral-700">
      <div className="container flex flex-col gap-y-10">
        {/* Top: centered logo + subheading */}
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="inline-flex items-center text-primary-600 dark:text-primary-500">
            {showLogo && (
              <span className="relative block h-10 w-10 shrink-0 overflow-hidden">
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
              <span className="ml-2 font-medium italic text-3xl text-neutral-900 dark:text-neutral-100">
                {siteName}
              </span>
            )}
          </Link>
          {subHeading && (
            <p className="mt-2 max-w-xl text-sm text-neutral-500 dark:text-neutral-400">
              {subHeading}
            </p>
          )}
        </div>

        {/* Bottom row: quick links left, socials right */}
        <div className="flex flex-col items-stretch gap-y-8 border-t border-neutral-200 pt-8 text-sm dark:border-neutral-700 sm:flex-row sm:items-start sm:justify-between">
          <nav className="sm:w-1/2 md:w-2/5">
            <h2 className="mb-4 font-semibold text-neutral-700 dark:text-neutral-200">
              Quick Links
            </h2>
            <ul className="space-y-3">
              {navLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-neutral-600 hover:text-black dark:text-neutral-300 dark:hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {hasSocials && (
            <div className="sm:w-1/2 md:w-2/5 sm:text-right">
              <h2 className="mb-4 font-semibold text-neutral-700 dark:text-neutral-200">
                Follow
              </h2>
              <ul
                className="flex items-center gap-x-4 sm:justify-end"
                aria-label="Social links"
              >
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
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Footer
