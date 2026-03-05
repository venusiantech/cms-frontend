'use client'

import LocalDate from '@/templates/Arclight/components/LocalDate'
import Avatar from '@/templates/Arclight/components/shared/Avatar'
import clsx from 'clsx'
import { FC } from 'react'

/** Same fallback as PostCardMeta when author.avatar is missing (e.g. non-CMS). */
const FALLBACK_AVATAR_URL = 'https://api.dicebear.com/7.x/avataaars/png?seed=Emma'

interface Author {
  name: string
  handle: string
  avatar?: { src: string; alt: string; width?: number; height?: number }
}

interface Props {
  className?: string
  date: string
  author: Author
  readingTime: number
}

const SingleMeta: FC<Props> = ({ className, date, author, readingTime }) => {
  const avatarSrc = typeof author?.avatar === 'object' && author?.avatar?.src
    ? author.avatar.src
    : FALLBACK_AVATAR_URL

  return (
    <div className={clsx('single-meta relative flex shrink-0 flex-wrap items-center text-sm', className)}>
      <Avatar className="size-10 sm:size-11" src={avatarSrc} sizes="44px" />

      <div className="ms-3">
        <p className="block font-semibold">{author.name}</p>
        <div className="mt-1.5 flex items-center gap-x-2 text-xs">
          <span>
            <LocalDate date={date} options={{ year: 'numeric', month: 'long', day: 'numeric' }} />
          </span>
          <span>•</span>
          <span>{readingTime} min read</span>
        </div>
      </div>
    </div>
  )
}

export default SingleMeta
