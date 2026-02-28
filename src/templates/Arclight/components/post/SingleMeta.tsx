'use client'

import LocalDate from '@/templates/Arclight/components/LocalDate'
import Avatar from '@/templates/Arclight/components/shared/Avatar'
import clsx from 'clsx'
import { FC } from 'react'

interface Author {
  name: string
  handle: string
  avatar: { src: string; alt: string; width: number; height: number }
}

interface Props {
  className?: string
  date: string
  author: Author
  readingTime: number
}

const SingleMeta: FC<Props> = ({ className, date, author, readingTime }) => {
  return (
    <div className={clsx('single-meta relative flex shrink-0 flex-wrap items-center text-sm', className)}>
      <Avatar className="size-10 sm:size-11" src={author.avatar?.src} sizes="44px" />

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
