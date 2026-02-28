'use client'

import Avatar from '@/templates/Arclight/components/shared/Avatar'
import { Divider } from '@/templates/Arclight/components/shared/divider'
import clsx from 'clsx'
import { FC } from 'react'
import TheContent from './TheContent'

/** Post with content for single view (CMS ArclightCmsPost shape). */
export interface SingleContentPost {
  content?: string
  title: string
  author: { name: string; handle: string; avatar?: { src: string; alt: string } }
  handle: string
  commentCount?: number
  likeCount?: number
  liked?: boolean
}

interface Props {
  post: SingleContentPost
  className?: string
}

const SingleContentContainer: FC<Props> = ({ post, className }) => {
  const { content, title, author } = post

  return (
    <div className={clsx('relative single-content space-y-10', className)}>
      <div
        id="single-entry-content"
        className="mx-auto max-w-(--breakpoint-md)! lg:prose-lg"
      >
        <TheContent content={content || ''} title={title} />
      </div>

      <Divider className="mx-auto max-w-(--breakpoint-md)" />

      <div className="mx-auto flex max-w-(--breakpoint-md) items-center gap-4" id="author">
        <Avatar src={author.avatar?.src} className="size-12 sm:size-16" />
        <div>
          <p className="text-xs uppercase tracking-wider text-neutral-500">Written by</p>
          <p className="font-semibold text-neutral-900 dark:text-white">{author.name}</p>
        </div>
      </div>
    </div>
  )
}

export default SingleContentContainer
