'use client'

import CategoryBadgeList from '@/templates/Arclight/components/PostCards/CategoryBadgeList'
import { Divider } from '@/templates/Arclight/components/shared/divider'
import clsx from 'clsx'
import Image from 'next/image'
import { FC } from 'react'
import SingleMeta from './SingleMeta'
import SingleTitle from './SingleTitle'

/** Post shape compatible with CMS (ArclightCmsPost) and legacy TPostDetail. */
export interface SinglePostHeaderPost {
  title: string
  excerpt?: string
  handle: string
  date: string
  readingTime: number
  author: { id: string; name: string; handle: string; avatar: { src: string; alt: string; width: number; height: number } }
  categories: Array<{ id: string; name: string; handle: string; color: string }>
  commentCount: number
  likeCount: number
  liked: boolean
  featuredImage: { src: string; alt: string; width: number; height: number }
  postType?: string
}

const TitleAndMeta = ({ className, post }: { className?: string; post: SinglePostHeaderPost }) => (
  <div className={clsx('single-header-meta space-y-5', className)}>
    <CategoryBadgeList categories={post.categories || []} />
    <SingleTitle title={post.title} />
    {post.excerpt && (
      <p className="text-base/relaxed text-neutral-600 md:text-lg/relaxed dark:text-neutral-400">{post.excerpt}</p>
    )}
    <Divider />
    <div className="flex flex-wrap gap-5">
      <SingleMeta author={post.author} date={post.date} readingTime={post.readingTime} />
    </div>
  </div>
)

const HeaderStyle1 = ({ className, post }: { className?: string; post: SinglePostHeaderPost }) => {
  const imgSrc = typeof post.featuredImage === 'object' && post.featuredImage?.src ? post.featuredImage.src : ''
  return (
    <>
      <header className={clsx('single-header-style-1 container mt-4 lg:mt-8', className)}>
        <div className="mx-auto max-w-4xl">
          <TitleAndMeta post={post} />
        </div>
        {imgSrc && (
          <div className="relative mt-8 w-full max-w-3xl mx-auto sm:mt-10">
            <Image
              alt={post.title}
              className="w-full h-auto rounded-2xl object-contain"
              src={imgSrc}
              width={800}
              height={450}
              sizes="(max-width: 672px) 100vw, 672px"
              priority
            />
          </div>
        )}
      </header>
    </>
  )
}

interface Props {
  className?: string
  post: SinglePostHeaderPost
  headerStyle?: 'style1' | 'style2' | 'style3'
}

const SingleHeaderContainer: FC<Props> = ({ className, post }) => {
  return <HeaderStyle1 className={className} post={post} />
}

export default SingleHeaderContainer
