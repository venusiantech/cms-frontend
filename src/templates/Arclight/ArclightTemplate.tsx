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

import '@/templates/Arclight/styles/tailwind.css'

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
  pageType?: 'home' | 'contact' | 'article' | 'categories' | 'latest-articles'
}

export default function ArclightTemplate({
  page,
  website,
  domain,
  articleId,
  pageType = 'home',
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

  const onArticleClick = (id: string) => {
    router.push(`/blog/${id}`)
  }

  const onBack = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    } else {
      router.push('/')
    }
  }

  const handleContactClick = website.contactFormEnabled
    ? () => {
        setShowContactForm(true)
        router.push('/contact')
      }
    : undefined

  const getPostUrl = (handle: string) => `/blog/${handle}`

  const renderContent = () => {
    if (pageType === 'categories') {
      return (
        <div className="relative container space-y-10 pb-20">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">All Articles</h1>
          {posts.length === 0 ? (
            <p className="py-12 text-neutral-500">No articles yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Card9 key={post.id} post={asTPost(post)} ratio="aspect-4/3" />
              ))}
            </div>
          )}
        </div>
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
          posts={posts.slice(0, 7).map(asTPost)}
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
