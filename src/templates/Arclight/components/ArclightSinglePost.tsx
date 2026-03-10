'use client'

import type { ArclightCmsPost } from '../cms/types'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { Fragment } from 'react'

interface ArclightSinglePostProps {
  post: ArclightCmsPost
  relatedPosts: ArclightCmsPost[]
  onBack: () => void
  getPostUrl: (handle: string) => string
}

function linkifyText(text: string): (string | JSX.Element)[] {
  const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  const parts: (string | JSX.Element)[] = []
  let lastIndex = 0
  let match
  while ((match = mdLinkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.substring(lastIndex, match.index))
    parts.push(
      <a key={match.index} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-primary-600 underline dark:text-primary-400">
        {match[1]}
      </a>
    )
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) parts.push(text.substring(lastIndex))
  if (parts.length === 0) {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    return text.split(urlRegex).map((part, i) =>
      typeof part === 'string' && urlRegex.test(part) ? (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-primary-600 underline dark:text-primary-400">{part}</a>
      ) : (
        part
      )
    )
  }
  return parts
}

function formatInline(text: string, keyPrefix: string): (string | JSX.Element)[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g)
  return parts.flatMap((part, i) => {
    if (part.match(/^\*\*.*\*\*$/)) return [<strong key={`${keyPrefix}-b-${i}`}>{part.slice(2, -2)}</strong>]
    if (part.match(/^\*.*\*$/)) return [<em key={`${keyPrefix}-i-${i}`}>{part.slice(1, -1)}</em>]
    if (part.match(/^`.*`$/)) return [<code key={`${keyPrefix}-c-${i}`} className="rounded bg-neutral-200 px-1 dark:bg-[#404040]">{part.slice(1, -1)}</code>]
    return linkifyText(part).map((p, j) => (typeof p === 'string' ? p : <Fragment key={`${keyPrefix}-l-${i}-${j}`}>{p}</Fragment>))
  })
}

function renderMarkdown(content: string, articleTitle: string): (JSX.Element | null)[] {
  const clean = content.replace(/```markdown\n?/g, '').replace(/```\n?/g, '').trim()
  const lines = clean.split('\n')
  let startIndex = 0
  if (lines[0]?.startsWith('# ')) {
    const firstH = lines[0].substring(2).trim()
    if (
      firstH.toLowerCase().includes(articleTitle.toLowerCase().substring(0, 20)) ||
      articleTitle.toLowerCase().includes(firstH.toLowerCase().substring(0, 20))
    ) {
      startIndex = 1
    }
  }
  const result: (JSX.Element | null)[] = []
  let keyIdx = 0
  const slice = lines.slice(startIndex)
  for (let i = 0; i < slice.length; i++) {
    const line = slice[i]
    if (line.trim() === '```' || line.trim() === '```markdown') continue
    if (line.trim() === '') {
      result.push(<div key={keyIdx++} className="h-3" />)
      continue
    }
    if (line.startsWith('# ')) {
      result.push(<h1 key={keyIdx++} className="mb-4 mt-6 text-2xl font-bold">{formatInline(line.substring(2), `h1-${keyIdx}`)}</h1>)
      continue
    }
    if (line.startsWith('## ')) {
      result.push(<h2 key={keyIdx++} className="mb-3 mt-5 text-xl font-semibold">{formatInline(line.substring(3), `h2-${keyIdx}`)}</h2>)
      continue
    }
    if (line.startsWith('### ')) {
      result.push(<h3 key={keyIdx++} className="mb-2 mt-4 text-lg font-semibold">{formatInline(line.substring(4), `h3-${keyIdx}`)}</h3>)
      continue
    }
    if (line.startsWith('> ')) {
      result.push(<blockquote key={keyIdx++} className="border-primary-500 border-s-4 ps-4 italic">{formatInline(line.substring(2), `bq-${keyIdx}`)}</blockquote>)
      continue
    }
    if (/^[-*_]{3,}\s*$/.test(line.trim())) {
      result.push(<hr key={keyIdx++} className="my-6 border-neutral-200 dark:border-neutral-700" />)
      continue
    }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      result.push(<li key={keyIdx++} className="ml-4 list-disc">{formatInline(line.substring(2), `ul-${keyIdx}`)}</li>)
      continue
    }
    if (/^\d+\.\s/.test(line)) {
      result.push(<li key={keyIdx++} className="ml-4 list-decimal">{formatInline(line.replace(/^\d+\.\s/, ''), `ol-${keyIdx}`)}</li>)
      continue
    }
    result.push(<p key={keyIdx++} className="mb-4">{formatInline(line, `p-${keyIdx}`)}</p>)
  }
  return result.filter(Boolean)
}

export default function ArclightSinglePost({ post, relatedPosts, onBack, getPostUrl }: ArclightSinglePostProps) {
  const imgSrc = typeof post.featuredImage === 'object' && post.featuredImage !== null ? post.featuredImage.src : String(post.featuredImage ?? '')
  const bodyContent = post.content
    ? renderMarkdown(post.content, post.title)
    : post.excerpt
      ? [<p key="excerpt" className="mb-4">{post.excerpt}</p>]
      : []

  return (
    <div className="relative container space-y-10 pb-20 lg:space-y-14">
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); onBack() }}
        className="inline-flex items-center gap-x-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
      >
        <ArrowLeft className="size-4" />
        Back
      </button>

      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold leading-tight text-neutral-900 dark:text-neutral-100 sm:text-4xl">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500 dark:text-neutral-400">
            <span>{post.author?.name ?? 'Editor'}</span>
            <span>·</span>
            <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
            <span>·</span>
            <span>{post.readingTime} min read</span>
          </div>
        </header>

        {imgSrc && (
          <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-2xl">
            <Image
              src={imgSrc}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 900px"
              priority
            />
          </div>
        )}

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          {bodyContent}
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section>
          <h2 className="mb-6 text-xl font-semibold text-neutral-900 dark:text-neutral-100">Related articles</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.slice(0, 6).map((p) => {
              const relatedImg = typeof p.featuredImage === 'object' && p.featuredImage !== null ? p.featuredImage.src : String(p.featuredImage ?? '')
              return (
                <li key={p.id}>
                  <Link href={getPostUrl(p.handle)} className="group block overflow-hidden rounded-xl">
                    {relatedImg && (
                      <div className="relative aspect-video overflow-hidden rounded-t-xl">
                        <Image
                          src={relatedImg}
                          alt={p.title}
                          fill
                          className="object-cover transition duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="rounded-b-xl border border-t-0 border-neutral-200 p-4 dark:border-neutral-700">
                      <h3 className="font-semibold text-neutral-900 group-hover:text-primary-600 dark:text-neutral-100 dark:group-hover:text-primary-400">
                        {p.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">{p.excerpt}</p>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </div>
  )
}
