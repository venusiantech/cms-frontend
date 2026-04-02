'use client'

import type { ArclightCmsPost } from '@/templates/Arclight/cms/types'
import { asTPost } from '@/templates/Arclight/cms/types'
import WidgetCategories from '@/templates/Arclight/components/WidgetCategories'
import WidgetPosts from '@/templates/Arclight/components/WidgetPosts'
import type { TCategory } from '@/templates/Arclight/data/categories'
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

const dummyWidgetCategories: TCategory[] = [
  {
    id: 'dummy-category-1',
    name: 'Technology',
    handle: 'technology',
    description: 'Dummy category for post sidebar.',
    color: 'blue',
    count: 24,
    date: '2026-04-02',
    thumbnail: {
      src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
      alt: 'Technology',
      width: 1200,
      height: 800,
    },
  },
  {
    id: 'dummy-category-2',
    name: 'Travel',
    handle: 'travel',
    description: 'Dummy category for post sidebar.',
    color: 'yellow',
    count: 18,
    date: '2026-04-02',
    thumbnail: {
      src: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop',
      alt: 'Travel',
      width: 1200,
      height: 800,
    },
  },
  {
    id: 'dummy-category-3',
    name: 'Health',
    handle: 'health',
    description: 'Dummy category for post sidebar.',
    color: 'green',
    count: 15,
    date: '2026-04-02',
    thumbnail: {
      src: 'https://images.unsplash.com/photo-1477332552946-cfb384aeaf1c?q=80&w=1200&auto=format&fit=crop',
      alt: 'Health',
      width: 1200,
      height: 800,
    },
  },
  {
    id: 'dummy-category-4',
    name: 'Finance',
    handle: 'finance',
    description: 'Dummy category for post sidebar.',
    color: 'indigo',
    count: 12,
    date: '2026-04-02',
    thumbnail: {
      src: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1200&auto=format&fit=crop',
      alt: 'Finance',
      width: 1200,
      height: 800,
    },
  },
]

/** Single post view for CMS: used by ArclightTemplate when rendering an article. */
export default function PostPageView({ post, relatedPosts, onBack, getPostUrl }: PostPageViewProps) {
  const popularPosts = relatedPosts.map(asTPost)

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
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12 xl:gap-16">
          <div className="w-full lg:w-3/5 xl:w-2/3">
            <SingleContentContainer post={post} />
          </div>
          <aside className="w-full lg:w-2/5 xl:w-1/3">
            <div className="space-y-7 lg:sticky lg:top-24">
              {popularPosts.length > 0 && <WidgetPosts posts={popularPosts} />}
              <WidgetCategories categories={dummyWidgetCategories} />
            </div>
          </aside>
        </div>
      </div>

      {relatedPosts.length > 0 && (
        <SingleRelatedPosts relatedPosts={relatedPosts} getPostUrl={getPostUrl} />
      )}
    </div>
  )
}
