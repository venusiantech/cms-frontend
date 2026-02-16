import { headers } from 'next/headers';
import { MetadataRoute } from 'next';
import { publicAPI } from '@/lib/api';
import { createUniqueSlug } from '@/lib/slugify';

/**
 * Dynamic sitemap generation per domain
 * Next.js will serve this at /sitemap.xml for each domain
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = headers();
  const host = headersList.get('host') || '';
  const domain = host.split(':')[0]; // Remove port if present

  // Determine if this is the platform domain
  const platformDomainsEnv = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'cms.local';
  const platformDomains = platformDomainsEnv.split(',').map((d) => d.trim());

  const isPlatformDomain =
    domain === 'localhost' ||
    domain.startsWith('127.0.0.1') ||
    platformDomains.includes(domain) ||
    domain === 'cms.local';

  // Check if it's a subdomain of platform
  const isSubdomainOfPlatform = platformDomains.some(
    (pd) => domain !== pd && domain.endsWith('.' + pd)
  );

  // If it's the main platform domain (not a user site), return empty sitemap
  if (isPlatformDomain && !isSubdomainOfPlatform) {
    return [];
  }

  // For user websites, generate sitemap with all blog articles
  try {
    const response = await publicAPI.getSiteByDomain(domain);
    const siteData = response.data;

    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;

    const sitemap: MetadataRoute.Sitemap = [];

    // Add homepage
    sitemap.push({
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    });

    // Add contact page (available on all websites)
    sitemap.push({
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    });

    // Add all blog articles with SEO-friendly slugs
    const homePage = siteData.pages?.find((p: any) => p.slug === '/');
    if (homePage) {
      const contentSections = homePage.sections.filter((s: any) => s.type === 'content');
      
      for (const section of contentSections) {
        const titleBlock = section.blocks.find((b: any) => b.type === 'text' && b.content?.isTitle);
        
        if (titleBlock && titleBlock.content?.text) {
          // Create SEO-friendly slug from title
          const slug = createUniqueSlug(titleBlock.content.text, section.id);
          
          sitemap.push({
            url: `${baseUrl}/blog/${slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        }
      }
    }

    return sitemap;
  } catch (error) {
    // Return empty sitemap on error
    return [];
  }
}

// Enable dynamic rendering (SSR)
export const dynamic = 'force-dynamic';
export const revalidate = 0;
