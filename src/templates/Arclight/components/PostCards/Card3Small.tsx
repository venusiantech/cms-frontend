import { TPost } from '../../data/posts'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import { Badge } from '../shared/Badge'
import LocalDate from '../LocalDate'

interface Props {
  className?: string
  post: TPost
}

const Card3Small: FC<Props> = ({ className, post }) => {
  const { title, handle, featuredImage } = post

  return (
    <div className={clsx('post-card-3-small group relative flex items-center justify-between gap-4', className)}>
      <div className="relative grow space-y-1">
        <div className="flex items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400">
          {post.categories?.[0] ? (
            <Badge color={post.categories[0].color as any} className="!px-2 !py-0.5 !text-[10px]">
              {post.categories[0].name}
            </Badge>
          ) : null}
          <LocalDate date={post.date} />
        </div>
        <h3 className="!px-1.5 nc-card-title block text-sm font-medium text-neutral-900 sm:text-base sm:font-semibold dark:text-neutral-100">
          <p className="line-clamp-2" title={title}>
            {title}
          </p>
        </h3>
      </div>

      <div className="relative aspect-square w-16 shrink-0">
        <Image
          alt={title}
          sizes="100px"
          className="rounded-lg object-cover brightness-100 transition-[filter] duration-300 group-hover:brightness-75"
          src={featuredImage}
          fill
          title={title}
        />
      </div>

      <Link href={`/blog/${handle}`} className="absolute inset-0" title={title}></Link>
    </div>
  )
}

export default Card3Small
