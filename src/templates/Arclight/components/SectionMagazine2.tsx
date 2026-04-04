'use client'

import { TPost } from '../data/posts'
import { HeadingWithSubProps } from '../components/shared/Heading'
import clsx from 'clsx'
import { FC, useState } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { Button } from './shared/Button'
import Card11 from './PostCards/Card11'
import Card2 from './PostCards/Card2'

interface Props extends Pick<HeadingWithSubProps, 'subHeading' | 'dimHeading'> {
  posts: TPost[]
  heading?: string
  className?: string
}

interface CategoryTab {
  name: string
  count: number
}

/** Derive unique categories and their post counts from the full posts array */
function buildCategoryTabs(posts: TPost[]): CategoryTab[] {
  const countMap = new Map<string, number>()
  posts.forEach((post) => {
    const cats = (post as any).categories as { name: string }[] | undefined
    cats?.forEach((c) => {
      if (c.name) countMap.set(c.name, (countMap.get(c.name) ?? 0) + 1)
    })
  })
  return Array.from(countMap.entries()).map(([name, count]) => ({ name, count }))
}

const gridVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, staggerChildren: 0.06 } as any,
  },
  exit: { opacity: 0, y: -12 },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
}

const ALL_TAB = '__all__'

const SectionMagazine2: FC<Props> = ({ posts, className }) => {
  const tabs = buildCategoryTabs(posts)
  // '' means "All" — show every post
  const [activeTab, setActiveTab] = useState<string>(ALL_TAB)

  const filteredPosts =
    activeTab === ALL_TAB
      ? posts
      : posts.filter((post) => {
          const cats = (post as any).categories as { name: string }[] | undefined
          return cats?.some((c) => c.name === activeTab)
        })

  // Fall back to all posts for old blogs without a category assigned
  const displayPosts = filteredPosts.length > 0 ? filteredPosts : posts

  // Helper — renders one tab button (active or outline)
  const renderTab = (name: string, count: number | null, key: string) => {
    const isActive = activeTab === key
    const badge = count !== null ? (
      <span className={clsx(
        'ml-1 rounded-full px-1 py-0.5 text-[10px] font-semibold tabular-nums sm:ml-1.5 sm:px-1.5 sm:text-xs',
        isActive
          ? 'bg-white/20 dark:bg-black/20'
          : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400',
      )}>
        {count}
      </span>
    ) : null

    return isActive ? (
      <Button color="dark/white" className="text-xs sm:text-sm" onClick={() => setActiveTab(key)}>
        {name}{badge}
      </Button>
    ) : (
      <Button outline className="text-xs sm:text-sm" onClick={() => setActiveTab(key)}>
        {name}{badge}
      </Button>
    )
  }

  return (
    <div className={clsx('section-magazine-2 relative', className)}>

      {/* ── Category Tabs ────────────────────────────────────────────────────
           Slot 0  : "All"  — always visible on every breakpoint
           Slots 1-4: category tabs, hidden responsively
             mobile  (< sm)  : slot 0 only  (1 tab)
             sm–md           : slots 0-1    (2 tabs)
             md+             : slots 0-4    (5 tabs)
           Remaining count surfaces in the "+N more" dashed pill.
      ─────────────────────────────────────────────────────────────────── */}
      {tabs.length > 0 && (
        <div className="mb-9 flex flex-wrap items-center gap-1.5 sm:gap-2">

          {/* "All" tab — always visible */}
          <div>{renderTab('All', posts.length, ALL_TAB)}</div>

          {/* Category tabs — hidden responsively */}
          {tabs.slice(0, 4).map((tab, index) => {
            const wrapClass =
              index === 0 ? 'hidden sm:block' :
              index === 1 ? 'hidden sm:block' :
              'hidden md:block'

            return (
              <div key={tab.name} className={wrapClass}>
                {renderTab(tab.name, tab.count, tab.name)}
              </div>
            )
          })}

          {/* "+N more" pill — links to /categories, count adjusts per breakpoint
               mobile  : All shown + tabs hidden → show "+N" for all categories
               sm–md   : All + 2 tabs shown     → show "+N" for remaining
               md+     : All + 4 tabs shown     → only show if > 4 categories
          */}
          {tabs.length > 0 && (
            <a
              href="/categories"
              aria-label="Browse all article categories"
              className="flex items-center gap-1 rounded-full border border-dashed border-neutral-400 px-3 py-1.5 text-xs font-medium text-neutral-500 transition-colors hover:border-neutral-600 hover:text-neutral-700 sm:px-4 sm:py-2 sm:text-sm dark:border-neutral-600 dark:text-neutral-400 dark:hover:border-neutral-400 dark:hover:text-neutral-200"
            >
              {/* mobile: show count of all categories (All tab visible, 0 category tabs) */}
              <span className="sm:hidden">+{tabs.length} more</span>
              {/* sm–md: All + 2 category tabs visible */}
              {tabs.length > 2 ? (
                <span className="hidden sm:inline md:hidden">+{tabs.length - 2} more</span>
              ) : (
                <span className="hidden sm:inline md:hidden">All categories</span>
              )}
              {/* md+: All + 4 category tabs visible */}
              {tabs.length > 4 ? (
                <span className="hidden md:inline">+{tabs.length - 4} more</span>
              ) : (
                <span className="hidden md:inline">All categories</span>
              )}
              <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          )}
        </div>
      )}

      {/* ── Animated Posts Grid ────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={gridVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <motion.div variants={cardVariants} className="grid gap-6">
            {displayPosts.slice(1, 3).map((post) => (
              <Card11 ratio="aspect-5/3" key={post.id} post={post} />
            ))}
          </motion.div>

          <motion.div variants={cardVariants} className="lg:col-span-2">
            {displayPosts[0] && (
              <Card2 className="h-full" size="large" post={displayPosts[0]} />
            )}
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="grid grid-cols-1 content-start gap-6 md:col-span-3 md:grid-cols-2 xl:col-span-1 xl:grid-cols-1"
          >
            {displayPosts.slice(3, 5).map((post) => (
              <Card11 className="self-start bg-neutral-50" ratio="aspect-5/3" key={post.id} post={post} />
            ))}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default SectionMagazine2
