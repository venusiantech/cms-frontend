'use client';

import ModernNews from '@/templates/ModernNews';
import TemplateA from '@/templates/TemplateA';
import ArclightTemplate from '@/templates/Arclight/ArclightTemplate';

interface SiteData {
  domain: {
    id: string;
    name: string;
    status: string;
  };
  website: {
    id: string;
    templateKey: string;
    adsEnabled: boolean;
    adsApproved: boolean;
    contactFormEnabled: boolean;
    instagramUrl?: string | null;
    facebookUrl?: string | null;
    twitterUrl?: string | null;
    websiteLogo?: string | null;
    logoDisplayMode?: string | null;
  };
  pages: Array<{
    id: string;
    slug: string;
    seo: {
      title: string | null;
      description: string | null;
    };
    sections: Array<{
      id: string;
      type: string;
      order: number;
      blocks: Array<{
        id: string;
        type: string;
        content: any;
      }>;
    }>;
  }>;
}

interface TemplateRendererProps {
  siteData: SiteData;
  /** Optional article ID for individual article pages */
  articleId?: string;
  /** Type of page to render */
  pageType?: 'home' | 'contact' | 'article' | 'categories' | 'category';
  /** Category slug for /category/[slug] pages */
  categorySlug?: string;
}

export default function TemplateRenderer({
  siteData,
  articleId,
  pageType = 'home',
  categorySlug,
}: TemplateRendererProps) {
  const { website, pages } = siteData;

  const homePage = pages.find((p) => p.slug === '/') || pages[0];

  if (!homePage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No content available</p>
      </div>
    );
  }

  if (website.templateKey === 'modernNews') {
    // ModernNews only supports subset of pageTypes — map 'category' → 'categories'
    const mnPageType = pageType === 'category' ? 'categories' : pageType;
    return (
      <ModernNews
        page={homePage}
        website={website}
        domain={siteData.domain}
        articleId={articleId}
        pageType={mnPageType as any}
      />
    );
  }

  if (website.templateKey === 'arclight') {
    return (
      <ArclightTemplate
        page={homePage}
        website={website}
        domain={siteData.domain}
        articleId={articleId}
        pageType={pageType === 'category' ? 'category' : (pageType as any)}
        categorySlug={categorySlug}
      />
    );
  }

  // TemplateA — map 'category' → 'categories'
  const taPageType = pageType === 'category' ? 'categories' : pageType;
  return (
    <TemplateA
      page={homePage}
      website={website}
      domain={siteData.domain}
      articleId={articleId}
      pageType={taPageType as any}
    />
  );
}
