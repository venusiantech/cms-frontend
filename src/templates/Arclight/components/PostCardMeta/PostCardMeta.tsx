import { TPost } from '../../data/posts'
import clsx from 'clsx'
import Link from 'next/link'
import { FC } from 'react'
import LocalDate from '../LocalDate'

/** Fallback when post does not provide author.avatar (e.g. non-CMS usage). */
const FALLBACK_AVATAR_URL = 'https://api.dicebear.com/7.x/avataaars/png?seed=Emma'

interface Props {
  className?: string
  meta: Pick<TPost, 'date' | 'author'>
  hiddenAvatar?: boolean
  avatarSize?: string
}

const PostCardMeta: FC<Props> = ({ className, meta, hiddenAvatar = false, avatarSize = 'size-7' }) => {
  const { date, author } = meta
  const avatarUrl = typeof author?.avatar === 'object' && author?.avatar?.src
    ? author.avatar.src
    : typeof author?.avatar === 'string'
      ? author.avatar
      : FALLBACK_AVATAR_URL

  return (
    <div className={clsx('post-card-meta flex flex-wrap items-center text-xs/6', className)}>
      <div className="relative flex items-center gap-x-2.5">
        {!hiddenAvatar && (
          <img
            className={clsx('rounded-full object-cover', avatarSize)}
            src={avatarUrl}
            alt={author?.avatar && typeof author.avatar === 'object' ? author.avatar.alt : 'Avatar'}
          />
        )}
        <span className="block font-semibold text-neutral-900 dark:text-neutral-300">{author.name}</span>
      </div>
      <>
        <span className="mx-1.5 font-medium text-neutral-500 dark:text-neutral-400">·</span>
        <span className="font-normal text-neutral-500 dark:text-neutral-400">
          <LocalDate date={date} />
        </span>
      </>
    </div>
  )
}

export default PostCardMeta
