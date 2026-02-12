import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { publicAPI } from '@/lib/api';
import TemplateRenderer from '@/components/TemplateRenderer';
import type { Metadata } from 'next';

interface PageProps {
  params: {
    id: string;
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
    
    // Find the article by section ID
    const article = findArticleById(siteData.page, params.id);
    
    if (!article) {
      return {
        title: 'Article Not Found',
      };
    }

    const domainName = siteData.domain.name.split('.')[0];
    const siteName = domainName.charAt(0).toUpperCase() + domainName.slice(1);

    return {
      title: `${article.title} - ${siteName}`,
      description: article.preview || article.content?.substring(0, 160),
      openGraph: {
        title: article.title,
        description: article.preview || article.content?.substring(0, 160),
        images: article.image ? [article.image] : [],
        type: 'article',
        siteName: siteName,
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.preview || article.content?.substring(0, 160),
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

  console.log('📄 Rendering article page for:', domain, 'article:', params.id);

  // Fetch site data
  let siteData;
  try {
    const response = await publicAPI.getSiteByDomain(domain);
    siteData = response.data;
  } catch (error) {
    console.error('Failed to fetch site data:', error);
    notFound();
  }

  // Render template with article ID in context
  return <TemplateRenderer siteData={siteData} articleId={params.id} />;
}

// Helper function to find article
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
