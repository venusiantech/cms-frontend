'use client';

import ModernNews from '@/templates/ModernNews';
import TemplateA from '@/templates/TemplateA';

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
}

/**
 * Template Renderer - Routes to correct template based on templateKey
 * 
 * This component:
 * 1. Receives site data
 * 2. Selects appropriate template
 * 3. Passes structured data to template
 */
export default function TemplateRenderer({ siteData }: TemplateRendererProps) {
  const { website, pages } = siteData;

  // Find home page
  const homePage = pages.find((p) => p.slug === '/') || pages[0];

  if (!homePage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No content available</p>
      </div>
    );
  }

  const templateProps = { page: homePage, website, domain: siteData.domain };

  if (website.templateKey === 'modernNews') {
    return <ModernNews {...templateProps} />;
  }

  return <TemplateA {...templateProps} />;
}

