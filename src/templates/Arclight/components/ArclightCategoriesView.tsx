'use client'

import { FC, useState, useMemo } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { Search, X, ArrowLeft, Layers } from 'lucide-react'
import { type ArclightCmsPost, asTPost } from '../cms/types'
import Card9 from './PostCards/Card9'

interface Props {
  posts: ArclightCmsPost[]
  onArticleClick: (id: string) => void
  getPostUrl: (handle: string) => string
}

interface Category {
  name: string
  count: number
  /** pick cover image from first post in this category */
  coverImage?: string
}

// ── Framer variants ────────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4 },
  }),
  exit: { opacity: 0, y: -14, transition: { duration: 0.2 } },
}

const searchBarVariants: Variants = {
  hidden: { opacity: 0, scaleX: 0.85, y: -8 },
  visible: { opacity: 1, scaleX: 1, y: 0, transition: { duration: 0.4, type: 'spring', stiffness: 280, damping: 24 } },
}

const blogGridVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, staggerChildren: 0.06 } as any,
  },
  exit: { opacity: 0, y: -16, transition: { duration: 0.2 } },
}

const blogCardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildCategories(posts: ArclightCmsPost[]): Category[] {
  const map = new Map<string, { count: number; coverImage?: string }>()
  posts.forEach((post) => {
    const cats = post.categories ?? []
    cats.forEach((c) => {
      const existing = map.get(c.name)
      map.set(c.name, {
        count: (existing?.count ?? 0) + 1,
        coverImage: existing?.coverImage ?? post.featuredImage?.src,
      })
    })
  })
  return Array.from(map.entries())
    .map(([name, { count, coverImage }]) => ({ name, count, coverImage }))
    .sort((a, b) => b.count - a.count)
}

// Pastel gradient pairs (light + dark aware) — one per category slot
const GRADIENTS = [
  'from-violet-100 to-indigo-50 dark:from-violet-950/60 dark:to-indigo-950/40',
  'from-emerald-100 to-teal-50 dark:from-emerald-950/60 dark:to-teal-950/40',
  'from-amber-100 to-orange-50 dark:from-amber-950/60 dark:to-orange-950/40',
  'from-sky-100 to-cyan-50 dark:from-sky-950/60 dark:to-cyan-950/40',
  'from-rose-100 to-pink-50 dark:from-rose-950/60 dark:to-pink-950/40',
  'from-lime-100 to-green-50 dark:from-lime-950/60 dark:to-green-950/40',
]

// ── Component ─────────────────────────────────────────────────────────────────

const ArclightCategoriesView: FC<Props> = ({ posts, onArticleClick, getPostUrl }) => {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const allCategories = useMemo(() => buildCategories(posts), [posts])

  const filteredCategories = useMemo(
    () =>
      search.trim()
        ? allCategories.filter((c) =>
            c.name.toLowerCase().includes(search.toLowerCase()),
          )
        : allCategories,
    [allCategories, search],
  )

  const categoryPosts = useMemo(
    () =>
      selectedCategory
        ? posts.filter((p) =>
            p.categories?.some((c) => c.name === selectedCategory),
          )
        : [],
    [posts, selectedCategory],
  )

  return (
    <div className="relative container pb-24 ">

      {/* ── Header row ────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {selectedCategory ? (
          <motion.div
            key="back-header"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, x: -16, transition: { duration: 0.2 } }}
            className="mb-8 flex items-center gap-4"
          >
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
            >
              <ArrowLeft className="h-4 w-4" />
              All Categories
            </button>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {selectedCategory}
              <span className="ml-2 text-base font-normal text-neutral-400">
                ({categoryPosts.length} article{categoryPosts.length !== 1 ? 's' : ''})
              </span>
            </h1>
          </motion.div>
        ) : (
          <motion.div
            key="main-header"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
            exit={{ opacity: 0 }}
            className="mb-8 space-y-6"
          >
            {/* Title */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  All Categories
                </h1>
                <p className="text-sm text-neutral-500">{allCategories.length} categories · {posts.length} articles</p>
              </div>
            </div>

            {/* Animated search bar */}
            <motion.div
              variants={searchBarVariants}
              initial="hidden"
              animate="visible"
              className="relative max-w-lg origin-left"
            >
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search categories…"
                className="w-full rounded-full border border-neutral-200 bg-white py-3 pl-11 pr-10 text-sm text-neutral-800 shadow-sm outline-none ring-0 transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:placeholder-neutral-500 dark:focus:border-neutral-500 dark:focus:ring-neutral-700"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Category cards ─────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {!selectedCategory && (
          <motion.div
            key="category-grid"
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
          >
            {filteredCategories.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 text-center text-neutral-400"
              >
                No categories match "{search}"
              </motion.p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCategories.map((cat, i) => (
                  <motion.button
                    key={cat.name}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`group relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-left shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-lg dark:ring-white/5 ${GRADIENTS[i % GRADIENTS.length]}`}
                  >
                    {/* Cover thumbnail */}
                    {cat.coverImage && (
                      <div className="absolute inset-0 opacity-10 transition-opacity group-hover:opacity-15">
                        <img
                          src={cat.coverImage}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}

                    {/* Floating blob accent */}
                    <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/30 blur-2xl dark:bg-white/10" />

                    <div className="relative z-10 flex items-start justify-between">
                      <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                        {cat.name}
                      </h3>
                      <span className="ml-3 shrink-0 rounded-full bg-white/60 px-2.5 py-0.5 text-xs font-semibold text-neutral-700 shadow-sm backdrop-blur-sm dark:bg-neutral-900/60 dark:text-neutral-300">
                        {cat.count}
                      </span>
                    </div>
                    <p className="relative z-10 mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                      {cat.count} article{cat.count !== 1 ? 's' : ''}
                    </p>
                    <div className="relative z-10 mt-4 flex items-center gap-1 text-xs font-semibold text-neutral-600 transition-colors group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-neutral-100">
                      Browse articles
                      <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ── Filtered blog grid ─────────────────────────────────────── */}
        {selectedCategory && (
          <motion.div
            key={`blogs-${selectedCategory}`}
            variants={blogGridVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {categoryPosts.length === 0 ? (
              <p className="py-16 text-center text-neutral-400">No articles in this category yet.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {categoryPosts.map((post) => (
                  <motion.div key={post.id} variants={blogCardVariants}>
                    <Card9 post={asTPost(post)} ratio="aspect-4/3" />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ArclightCategoriesView
