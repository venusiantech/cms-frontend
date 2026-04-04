import { TPost } from '../../data/posts'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import CategoryBadgeList from './CategoryBadgeList'
import LocalDate from '../LocalDate'

interface Props {
  className?: string
  ratio?: string
  post: TPost
}

const Card9: FC<Props> = ({ className, ratio = 'aspect-3/4', post }) => {
  const {
    title,
    handle,
    featuredImage,
    categories,
    author,
    date,
    readingTime,
  } = post

  const renderMeta = () => {
    return (
      <div className="mt-3.5 text-neutral-300">
        <h2 className="block text-lg/6 font-semibold text-white">
          <Link href={`/blog/${handle}`} title={title}>
            {title}
          </Link>
        </h2>
        <div className="relative mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs">
          <Link href={`/author/${author.handle}`} className="absolute inset-0" />
          <span className="font-medium text-neutral-200 hover:text-white">{author.name}</span>
          <span className="font-medium">·</span>
          <LocalDate date={date} />
          <span>/</span>
          <span>{readingTime} min read</span>
        </div>
      </div>
    )
  }

  return (
    <div className={clsx('group post-card-9 relative flex flex-col overflow-hidden rounded-3xl', className)}>
      <div className={`relative flex w-full items-start ${ratio}`}></div>

      <Link href={`/blog/${handle}`} className="absolute inset-0">
        <Image
          fill
          alt={title}
          className="size-full rounded-3xl object-cover brightness-75 transition-[filter] group-hover:brightness-[65%]"
          src={featuredImage}
          sizes="(max-width: 600px) 480px, 500px"
        />
      </Link>

      <div className="absolute inset-x-0 bottom-0 flex grow flex-col p-4">
        {renderMeta()}
      </div>
    </div>
  )
}

export default Card9
