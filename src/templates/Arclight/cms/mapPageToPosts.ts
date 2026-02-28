import { createUniqueSlug } from '@/lib/slugify'
import type { ArclightCmsPost } from './types'

const PLACEHOLDER_IMAGE = 'https://placehold.co/800x400/e5e5e5/737373?text=Article'

interface Section {
  id: string
  type: string
  order: number
  createdAt?: string
  blocks: Array<{ id: string; type: string; content: any; createdAt?: string }>
}

interface PageData {
  id: string
  slug: string
  seo: { title: string | null; description: string | null }
  sections: Section[]
}

/** Strip markdown syntax and return clean plain text capped at maxLen chars */
function stripMarkdown(text: string, maxLen = 220): string {
  return text
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/~~(.+?)~~/g, '$1')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[(.+?)\]\(.*?\)/g, '$1')
    .replace(/^[-*_]{3,}\s*$/gm, '')
    .replace(/^>\s+/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/\n{2,}/g, ' ')
    .replace(/\n/g, ' ')
    .trim()
    .substring(0, maxLen)
    .replace(/\s+\S*$/, '') + '…'
}

function blogsFromPage(
  page: PageData,
  domainName: string
): Array<{
  sectionId: string
  slug: string
  title: string
  content: string
  preview: string
  image: string
  dateStr: string
  dateIso: string
  readTimeMin: number
  domainName: string
}> {
  const contentSections = page.sections.filter((s) => s.type === 'content')
  return contentSections.map((section) => {
    const sectionDate = section.createdAt ? new Date(section.createdAt) : new Date()
    const dateStr = sectionDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    const dateIso = sectionDate.toISOString()
    let titleBlock = section.blocks.find((b) => b.type === 'text' && b.content?.isTitle)
    let contentBlock = section.blocks.find((b) => b.type === 'text' && b.content?.isFullContent)
    let previewBlock = section.blocks.find((b) => b.type === 'text' && b.content?.isPreview)
    const imageBlock = section.blocks.find((b) => b.type === 'image')
    const textBlocks = section.blocks.filter((b) => b.type === 'text')
    if (!titleBlock || !contentBlock || !previewBlock) {
      if (textBlocks.length === 1) titleBlock = contentBlock = previewBlock = textBlocks[0]
      else if (textBlocks.length >= 2) {
        titleBlock = titleBlock || textBlocks[0]
        contentBlock = contentBlock || textBlocks[1]
        previewBlock = previewBlock || textBlocks[1]
      }
      if (textBlocks.length >= 3 && !contentBlock) {
        titleBlock = titleBlock || textBlocks[0]
        contentBlock = contentBlock || textBlocks[1]
        previewBlock = previewBlock || textBlocks[2]
      }
    }
    let title = titleBlock?.content?.text || 'Untitled'
    title = title.replace(/^["']|["']$/g, '').trim()

    const content = contentBlock?.content?.text || previewBlock?.content?.text || ''
    const rawPreview = previewBlock?.content?.text || content?.substring(0, 400) || ''
    const preview = stripMarkdown(rawPreview)
    const image = imageBlock?.content?.url || PLACEHOLDER_IMAGE
    const readTimeMin = Math.max(1, Math.ceil(content.length / 1000))
    const slug = createUniqueSlug(title, section.id)
    return {
      sectionId: section.id,
      slug,
      title,
      content,
      preview,
      image,
      dateStr,
      dateIso,
      readTimeMin,
      domainName,
    }
  })
}

const DEFAULT_AUTHOR = {
  id: 'cms-author',
  name: 'Editor',
  handle: 'editor',
  avatar: {
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=128&auto=format&fit=crop',
    alt: 'Editor',
    width: 1920,
    height: 1080,
  },
}

const DEFAULT_CATEGORY = {
  id: 'category-article',
  name: 'Article',
  handle: 'article',
  color: 'blue' as const,
}

/** Map raw blog row to Arclight TPost shape (with sectionId and optional content for single view) */
export function toArclightPost(
  b: {
    sectionId: string
    slug: string
    title: string
    content: string
    preview: string
    image: string
    dateStr: string
    dateIso: string
    readTimeMin: number
    domainName: string
  },
  index: number,
  opts?: { content?: string }
): ArclightCmsPost {
  const author = {
    ...DEFAULT_AUTHOR,
    name: b.domainName,
    handle: b.domainName.toLowerCase().replace(/\s+/g, '-'),
  }
  return {
    id: b.slug,
    sectionId: b.sectionId,
    featuredImage: {
      src: b.image,
      alt: b.title,
      width: 1920,
      height: 1080,
    },
    title: b.title,
    handle: b.slug,
    excerpt: b.preview,
    date: b.dateIso,
    readingTime: b.readTimeMin,
    commentCount: 0,
    viewCount: 0,
    bookmarkCount: 0,
    bookmarked: false,
    likeCount: 0,
    liked: false,
    postType: 'standard',
    status: 'published',
    author,
    categories: [DEFAULT_CATEGORY],
    ...(opts?.content !== undefined && { content: opts.content }),
  }
}

/** Build list of Arclight posts from CMS page (for home/categories). */
export function mapPageToArclightPosts(page: PageData, domain: { name: string }): ArclightCmsPost[] {
  const domainName = domain.name.split('.')[0]
  const domainDisplay = domainName.charAt(0).toUpperCase() + domainName.slice(1)
  const raw = blogsFromPage(page, domainDisplay)
  return raw.map((b, i) => toArclightPost(b, i))
}

/** Build list of Arclight posts with full content (for single-article resolution). */
export function mapPageToArclightPostsWithContent(
  page: PageData,
  domain: { name: string }
): ArclightCmsPost[] {
  const domainName = domain.name.split('.')[0]
  const domainDisplay = domainName.charAt(0).toUpperCase() + domainName.slice(1)
  const raw = blogsFromPage(page, domainDisplay)
  return raw.map((b, i) => toArclightPost(b, i, { content: b.content }))
}
