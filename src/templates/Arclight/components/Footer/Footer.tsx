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
    { href: '/privacy-policy', label: 'Privacy Policy' },
  ]

  const hasSocials = !!(facebookUrl || instagramUrl || twitterUrl)

  return (
    <div className="nc-Footer relative border-t border-neutral-200 py-16 lg:py-28 dark:border-neutral-700">
      <div className="container grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-10">
        <div className="col-span-2 md:col-span-4 lg:col-span-2">
          <Link href="/" className="inline-block text-primary-600 dark:text-primary-500">
            {showLogo && (
              <span className="relative block h-10 w-28 shrink-0 overflow-hidden">
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
          {subHeading && (
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{subHeading}</p>
          )}
        </div>
        <div className="col-span-2 flex flex-col items-center justify-start md:col-span-4 lg:col-span-2">
          <nav className="text-sm">
            <h2 className="font-semibold mb-4 text-neutral-700 dark:text-neutral-200">Quick Links</h2>
            <ul className="mt-5 space-y-4 sm:mt-6 lg:mt-0">
              {navLinks.map((item) => (
                <li key={item.label} className="">
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
        </div>
        {hasSocials && (
          <div className="text-sm col-span-2 md:col-span-4 lg:col-span-1">
            <h2 className="font-semibold text-neutral-700 dark:text-neutral-200">Follow</h2>
            <ul className="mt-5 flex items-center gap-x-3.5 lg:mt-5" aria-label="Social links">
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
  )
}

export default Footer
