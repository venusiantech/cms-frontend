'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import ThemeProvider from '@/templates/Arclight/theme-provider'
import { AsideProvider } from '@/templates/Arclight/components/aside/aside'
import Footer from '@/templates/Arclight/components/Footer/Footer'
import ArclightCmsHeader from '@/templates/Arclight/components/ArclightCmsHeader'
import PostPageView from '@/templates/Arclight/components/post/PostPageView'
import SectionMagazine10 from '@/templates/Arclight/components/SectionMagazine10'
import SectionMagazine9 from '@/templates/Arclight/components/SectionMagazine9'
import SectionMagazine2 from '@/templates/Arclight/components/SectionMagazine2'
import SectionPostsWithWidgets from '@/templates/Arclight/components/SectionPostsWithWidgets'
import ContactSection from '@/templates/templateA/components/sections/contact/ContactSection'
import { mapPageToArclightPosts, mapPageToArclightPostsWithContent } from '@/templates/Arclight/cms/mapPageToPosts'
import type { ArclightCmsPost } from '@/templates/Arclight/cms/types'
import { asTPost } from '@/templates/Arclight/cms/types'
import Card9 from '@/templates/Arclight/components/PostCards/Card9'
import { Divider } from '@/templates/Arclight/components/shared/divider'
import ArclightCategoriesView from '@/templates/Arclight/components/ArclightCategoriesView'
import NavigationProgress, { signalNavigationStart } from '@/components/NavigationProgress'

import '@/templates/Arclight/styles/tailwind.css'

interface Section {
  id: string
  type: string
  order: number
  createdAt?: string
  category?: { id: string; name: string; slug: string } | null
  blocks: Array<{ id: string; type: string; content: any; createdAt?: string }>
}

interface PageData {
  id: string
  slug: string
  seo: { title: string | null; description: string | null }
  sections: Section[]
}

interface ArclightTemplateProps {
  page: PageData
  website: {
    id: string
    templateKey: string
    adsEnabled: boolean
    adsApproved: boolean
    contactFormEnabled: boolean
    instagramUrl?: string | null
    facebookUrl?: string | null
    twitterUrl?: string | null
    contactEmail?: string | null
    contactPhone?: string | null
    googleAnalyticsId?: string | null
    websiteLogo?: string | null
    logoDisplayMode?: string | null
  }
  domain: { name: string }
  articleId?: string
  pageType?: 'home' | 'contact' | 'article' | 'categories' | 'latest-articles' | 'category'
  /** Category slug for /category/[slug] pages */
  categorySlug?: string
}

export default function ArclightTemplate({
  page,
  website,
  domain,
  articleId,
  pageType = 'home',
  categorySlug,
}: ArclightTemplateProps) {
  const router = useRouter()
  const posts = useMemo(() => mapPageToArclightPosts(page, domain), [page, domain])
  const postsWithContent = useMemo(() => mapPageToArclightPostsWithContent(page, domain), [page, domain])

  const [selectedId, setSelectedId] = useState<string | null>(articleId ?? null)
  const [showContactForm, setShowContactForm] = useState(pageType === 'contact')

  const siteName = domain.name.split('.')[0]
  const siteDisplay = siteName.charAt(0).toUpperCase() + siteName.slice(1)

  useEffect(() => {
    if (articleId) setSelectedId(articleId)
  }, [articleId])

  useEffect(() => {
    if (showContactForm) {
      document.title = `Contact Us - ${siteDisplay}`
    } else if (selectedId) {
      const article = postsWithContent.find((a) => a.sectionId === selectedId)
      document.title = article ? `${article.title} - ${siteDisplay}` : siteDisplay
    } else {
      document.title = pageType === 'categories' ? `All Articles - ${siteDisplay}` : pageType === 'latest-articles' ? `Latest Articles - ${siteDisplay}` : siteDisplay
    }
  }, [domain.name, selectedId, postsWithContent, showContactForm, siteDisplay, pageType])

  const selectedArticle = selectedId
    ? (postsWithContent.find((a) => a.sectionId === selectedId) ?? null)
    : null
  const relatedPosts = postsWithContent.filter((a) => a.sectionId !== selectedId).slice(0, 6)

  const computedCategories = useMemo(() => {
    const map = new Map<string, any>()
    postsWithContent.forEach((post) => {
      const cats = post.categories ?? []
      cats.forEach((c) => {
        const existing = map.get(c.name)
        map.set(c.name, {
          id: c.id,
          name: c.name,
          handle: c.handle,
          count: (existing?.count ?? 0) + 1,
          thumbnail: existing?.thumbnail ?? post.featuredImage,
          color: c.color,
          date: post.date,
        })
      })
    })
    return Array.from(map.values()).sort((a, b) => b.count - a.count)
  }, [postsWithContent])

  const onArticleClick = (id: string) => {
    signalNavigationStart()
    router.push(`/blog/${id}`)
  }

  const onBack = () => {
    signalNavigationStart()
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    } else {
      router.push('/')
    }
  }

  const handleContactClick = website.contactFormEnabled
    ? () => {
        signalNavigationStart()
        setShowContactForm(true)
        router.push('/contact')
      }
    : undefined

  const getPostUrl = (handle: string) => `/blog/${handle}`

  const renderContent = () => {
    if (pageType === 'category') {
      // Resolve category name from slug by matching against posts
      const matchedCategory = (() => {
        if (!categorySlug) return null
        // Try exact handle match first
        for (const post of postsWithContent) {
          const cat = post.categories?.find(
            (c) => c.handle === categorySlug ||
            c.name.toLowerCase().replace(/\s+/g, '-') === categorySlug
          )
          if (cat) return cat.name
        }
        // Fallback: humanise the slug
        return categorySlug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      })()

      return (
        <ArclightCategoriesView
          posts={postsWithContent}
          onArticleClick={onArticleClick}
          getPostUrl={getPostUrl}
          initialCategory={matchedCategory}
        />
      )
    }

    if (pageType === 'categories') {
      return (
        <ArclightCategoriesView
          posts={postsWithContent}
          onArticleClick={onArticleClick}
          getPostUrl={getPostUrl}
        />
      )
    }

    if (showContactForm) {
      return (
        <div className="relative container pb-20">
          <ContactSection
            domain={domain}
            website={website}
            onBack={onBack}
            assetsPath="/templateA/assets"
          />
        </div>
      )
    }

    if (selectedArticle) {
      return (
        <PostPageView
          post={selectedArticle}
          relatedPosts={relatedPosts}
          actualCategories={computedCategories}
          onBack={onBack}
          getPostUrl={getPostUrl}
        />
      )
    }

    return (
      <div className="relative container space-y-28 pb-28 lg:space-y-32 lg:pb-32">
        {/* <SectionMagazine10 posts={posts.slice(0, 8).map(asTPost)} /> */}

        <SectionMagazine2
          heading="Latest articles"
          subHeading="Explore the newest articles"
          posts={posts.map(asTPost)}
        />
        <SectionMagazine9
          heading="Latest articles"
          subHeading="Explore the most popular categories"
          posts={posts.slice(0, 18).map(asTPost)}
        />
        {/* <Divider /> */}
        {/* <SectionPostsWithWidgets
          heading="Latest articles"
          subHeading="Explore the most popular categories"
          posts={posts.slice(0, 8).map(asTPost)}
          postCardName="card4"
          gridClass="sm:grid-cols-2"
        /> */}
      </div>
    )
  }

  return (
    <ThemeProvider>
      <AsideProvider>
        <NavigationProgress />
        <ArclightCmsHeader
          siteName={siteDisplay}
          logoUrl={website.websiteLogo}
          logoDisplayMode={website.logoDisplayMode}
          instagramUrl={website.instagramUrl}
          facebookUrl={website.facebookUrl}
          twitterUrl={website.twitterUrl}
          onContactClick={handleContactClick}
        />
        {renderContent()}
        <Footer
          siteName={siteDisplay}
          subHeading={page.seo?.description ?? null}
          logoUrl={website.websiteLogo}
          logoDisplayMode={website.logoDisplayMode}
          instagramUrl={website.instagramUrl}
          facebookUrl={website.facebookUrl}
          twitterUrl={website.twitterUrl}
        />
      </AsideProvider>
    </ThemeProvider>
  )
}
