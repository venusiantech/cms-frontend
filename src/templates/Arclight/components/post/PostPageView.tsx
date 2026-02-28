'use client'

import type { ArclightCmsPost } from '@/templates/Arclight/cms/types'
import { HiArrowLeft } from 'react-icons/hi'
import SingleContentContainer from './SingleContentContainer'
import SingleHeaderContainer from './SingleHeaderContainer'
import SingleRelatedPosts from './SingleRelatedPosts'

export interface PostPageViewProps {
  post: ArclightCmsPost
  relatedPosts: ArclightCmsPost[]
  onBack: () => void
  getPostUrl: (handle: string) => string
}

/** Single post view for CMS: used by ArclightTemplate when rendering an article. */
export default function PostPageView({ post, relatedPosts, onBack, getPostUrl }: PostPageViewProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); onBack() }}
        className="container mb-6 flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
      >
        <HiArrowLeft className="size-4" aria-hidden />
        Back
      </button>

      <SingleHeaderContainer post={post} headerStyle="style1" />

      <div className="container mt-10 pb-16">
        <SingleContentContainer post={post} />
      </div>

      {relatedPosts.length > 0 && (
        <SingleRelatedPosts relatedPosts={relatedPosts} getPostUrl={getPostUrl} />
      )}
    </div>
  )
}
