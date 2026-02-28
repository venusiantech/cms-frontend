'use client'

import type { ArclightCmsPost } from '@/templates/Arclight/cms/types'
import { asTPost } from '@/templates/Arclight/cms/types'
import Card4 from '@/templates/Arclight/components/PostCards/Card4'
import { FC } from 'react'

interface Props {
  relatedPosts: ArclightCmsPost[]
  getPostUrl: (handle: string) => string
}

const SingleRelatedPosts: FC<Props> = ({ relatedPosts, getPostUrl }) => {
  if (relatedPosts.length === 0) return null

  return (
    <div className="relative mt-16 bg-neutral-50 py-16 dark:bg-neutral-800 lg:mt-28 lg:py-24">
      <div className="container space-y-10">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Don&apos;t miss these</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {relatedPosts.slice(0, 6).map((post) => (
            <Card4 key={post.id} post={asTPost(post)} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SingleRelatedPosts
