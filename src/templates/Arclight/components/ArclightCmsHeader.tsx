'use client'

import { Facebook01Icon, InstagramIcon, NewTwitterIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'

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

  // Arrayfy menu items
  const menuItems: MenuItem[] = [
    {
      label: 'All Articles',
      href: '/categories',
    },
    ...(onContactClick
      ? [
          {
            label: 'Contact',
            asButton: true,
            onClick: onContactClick,
          },
        ]
      : []),
  ]

  return (
    <header
      className={clsx(
        'relative z-20 border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900 mb-8',
      )}
    >
      <div className="container h-20 flex items-center">
        {/* Left: Logo/Text */}
        <div className="flex items-center shrink-0">
          <Link href="/" className="flex items-center text-primary-600 dark:text-primary-500">
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
        </div>

        {/* Center: Nav */}
        <div className="flex-1 flex justify-center">
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

        {/* Right: Socials */}
        <div className="flex items-center gap-x-6">
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
        </div>
      </div>
    </header>
  )
}

export default ArclightCmsHeader
