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
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-10 px-6 text-center select-none">
        {/* Fastofy logo */}
        <div className="flex flex-col items-center gap-3">
          <img
            src="/logo/fastofy.png"
            alt="Fastofy"
            className="w-16 h-16 opacity-90"
          />
          <span className="text-xl font-semibold tracking-tight text-white">
            FASTOFY
          </span>
        </div>

        {/* Animated pulsing dots */}
        <div className="flex items-center gap-2.5">
          {[0, 0.2, 0.4].map((delay, i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-neutral-500"
              style={{
                animation: `pulse 1.4s ease-in-out ${delay}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Domain name + status */}
        <div className="space-y-2">
          <p className="text-lg font-medium text-neutral-200 tracking-wide">
            {siteData.domain.name}
          </p>
          <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">
            Your website is being set up and will be ready soon.
          </p>
        </div>

        {/* Footer badge */}
        <p className="text-xs text-neutral-700 tracking-wider uppercase">
          Powered by Fastofy
        </p>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.2; transform: scale(0.85); }
            50%       { opacity: 1;   transform: scale(1); }
          }
        `}</style>
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
