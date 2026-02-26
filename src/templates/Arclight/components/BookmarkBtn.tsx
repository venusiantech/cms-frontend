'use client'

import { BookmarkIcon } from 'lucide-react'
import clsx from 'clsx'
import { FC, useState } from 'react'

interface Props {
  className?: string
  bookmarked?: boolean
}

const BookmarkBtn: FC<Props> = ({ className, bookmarked }) => {
  const [isBookmarked, setIsBookmarked] = useState(bookmarked)

  return (
    <button
      className={clsx(
        'relative flex size-8 items-center justify-center rounded-full bg-neutral-50 transition-colors duration-300 hover:bg-neutral-100 dark:bg-white/10 dark:hover:bg-white/20',
        className
      )}
      title="Save to reading list"
      onClick={() => setIsBookmarked(!isBookmarked)}
      type="button"
    >
      <BookmarkIcon size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
    </button>
  )
}

export default BookmarkBtn
