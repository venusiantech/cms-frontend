import type { TPost } from '../data/posts'

/**
 * CMS-driven post for Arclight template.
 * Explicit shape used in mapping; cast to TPost when passing to Arclight card components.
 */
export interface ArclightCmsPost {
  id: string
  sectionId?: string
  featuredImage: { src: string; alt: string; width: number; height: number }
  title: string
  handle: string
  excerpt: string
  date: string
  readingTime: number
  commentCount: number
  viewCount: number
  bookmarkCount: number
  bookmarked: boolean
  likeCount: number
  liked: boolean
  postType: 'standard' | 'audio' | 'video' | 'gallery'
  status: string
  author: {
    id: string
    name: string
    handle: string
    avatar: { src: string; alt: string; width: number; height: number }
  }
  categories: Array<{ id: string; name: string; handle: string; color: string }>
  content?: string
}

/** Type assertion: our CMS posts are compatible with TPost for card components */
export function asTPost(post: ArclightCmsPost): TPost {
  return post as unknown as TPost
}
