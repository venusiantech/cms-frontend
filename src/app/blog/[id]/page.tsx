import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { publicAPI } from '@/lib/api';
import TemplateRenderer from '@/components/TemplateRenderer';
import type { Metadata } from 'next';
import { extractSectionIdFromSlug } from '@/lib/slugify';

interface PageProps {
  params: {
    id: string; // Can be either slug or UUID
  };
}

/**
 * Generate metadata for SEO (title, description, og tags)
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const headersList = headers();
  const host = headersList.get('host') || '';
  const domain = host.split(':')[0];

  try {
    const response = await publicAPI.getSiteByDomain(domain);
    const siteData = response.data;
    
    // Get the home page (where blogs are stored)
    const homePage = siteData.pages?.find((p: any) => p.slug === '/');
    
    if (!homePage) {
      return {
        title: 'Article Not Found',
      };
    }
    
    // Find the actual section ID from slug or UUID
    const sectionId = findSectionIdFromSlugOrId(homePage, params.id);
    
    if (!sectionId) {
      return {
        title: 'Article Not Found',
      };
    }
    
    // Find the article by section ID
    const article = findArticleById(homePage, sectionId);
    
    if (!article) {
      return {
        title: 'Article Not Found',
      };
    }

    const domainName = siteData.domain.name.split('.')[0];
    const siteName = domainName.charAt(0).toUpperCase() + domainName.slice(1);
    const favicon = siteData.website.websiteLogo;

    const rawTitle = `${article.title} - ${siteName}`;
    const metaTitle = rawTitle.length > 60 ? rawTitle.substring(0, 57) + '...' : rawTitle;
    const rawDesc = article.preview || article.content || '';
    const metaDesc = rawDesc.substring(0, 155);
    const canonicalUrl = `https://${domain}/blog/${params.id}`;

    return {
      metadataBase: new URL(`https://${domain}`),
      title: { absolute: metaTitle },
      description: metaDesc,
      alternates: {
        canonical: canonicalUrl,
      },
      ...(favicon && { icons: { icon: favicon, apple: favicon } }),
      openGraph: {
        title: article.title,
        description: metaDesc,
        url: canonicalUrl,
        images: article.image ? [article.image] : [],
        type: 'article',
        siteName: siteName,
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: metaDesc,
        images: article.image ? [article.image] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Article',
    };
  }
}

/**
 * Article page - Server-side rendered for SEO
 */
export default async function ArticlePage({ params }: PageProps) {
  const headersList = headers();
  const host = headersList.get('host') || '';
  const domain = host.split(':')[0];

  // Fetch site data
  let siteData;
  try {
    const response = await publicAPI.getSiteByDomain(domain);
    siteData = response.data;
  } catch (error) {
    console.error('Failed to fetch site data:', error);
    notFound();
  }

  // Get the home page (where blogs are stored)
  const homePage = siteData.pages?.find((p: any) => p.slug === '/');
  
  if (!homePage) {
    notFound();
  }

  // Find the actual section ID from slug or UUID
  const sectionId = findSectionIdFromSlugOrId(homePage, params.id);
  
  if (!sectionId) {
    notFound();
  }

  // Render template with article ID in context
  return <TemplateRenderer siteData={siteData} articleId={sectionId} />;
}

/**
 * Find section ID from slug or UUID
 * Supports both slug format (e.g., "top-10-recipes-abc123") and legacy UUID format
 */
function findSectionIdFromSlugOrId(page: any, slugOrId: string): string | null {
  const contentSections = page.sections.filter((s: any) => s.type === 'content');
  
  // First, try to match by full UUID (backward compatibility)
  for (const section of contentSections) {
    if (section.id === slugOrId) {
      return section.id;
    }
  }
  
  // If not a UUID, try to extract suffix from slug and match
  const slugSuffix = extractSectionIdFromSlug(slugOrId);
  
  if (slugSuffix) {
    for (const section of contentSections) {
      if (section.id.endsWith(slugSuffix)) {
        return section.id;
      }
    }
  }
  
  return null;
}

// Helper function to find article metadata by ID
function findArticleById(page: any, articleId: string) {
  const contentSections = page.sections.filter((s: any) => s.type === 'content');
  
  for (const section of contentSections) {
    if (section.id === articleId) {
      const titleBlock = section.blocks.find((b: any) => b.type === 'text' && b.content?.isTitle);
      const contentBlock = section.blocks.find((b: any) => b.type === 'text' && b.content?.isFullContent);
      const previewBlock = section.blocks.find((b: any) => b.type === 'text' && b.content?.isPreview);
      const imageBlock = section.blocks.find((b: any) => b.type === 'image');
      
      return {
        title: titleBlock?.content?.text || 'Untitled',
        content: contentBlock?.content?.text || '',
        preview: previewBlock?.content?.text || '',
        image: imageBlock?.content?.url || '',
      };
    }
  }
  
  return null;
}

// Enable dynamic rendering (SSR)
export const dynamic = 'force-dynamic';
export const revalidate = 0;
