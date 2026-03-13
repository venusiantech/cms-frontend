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

  // Use x-forwarded-proto if set by reverse proxy, otherwise https for real domains
  const forwardedProto = headersList.get('x-forwarded-proto');
  const isLocalDomain =
    domain === 'localhost' ||
    domain.startsWith('127.0.0.1') ||
    domain.endsWith('.local');
  const siteProtocol = forwardedProto || (isLocalDomain ? 'http' : 'https');

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

  // If it's the main platform domain (not a user site), return all fastofy.com pages
  if (isPlatformDomain && !isSubdomainOfPlatform) {
    const base = `${siteProtocol}://${domain}`;
    const now = new Date();

    return [
      // ── Core pages ──────────────────────────────────────────────────────────
      { url: base,                              lastModified: now, changeFrequency: 'daily',   priority: 1.0 },

      // ── Auth ────────────────────────────────────────────────────────────────
      { url: `${base}/login`,                   lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
      { url: `${base}/register`,                lastModified: now, changeFrequency: 'monthly', priority: 0.8 },

      // ── Product ─────────────────────────────────────────────────────────────
      { url: `${base}/dashboard`,               lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },

      // ── Support ─────────────────────────────────────────────────────────────
      { url: `${base}/contact`,                 lastModified: now, changeFrequency: 'monthly', priority: 0.6 },

      // ── Legal ───────────────────────────────────────────────────────────────
      { url: `${base}/privacy-policy`,          lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
      { url: `${base}/terms-of-service`,        lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
      { url: `${base}/refund-policy`,           lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
      { url: `${base}/cookie-policy`,           lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
      { url: `${base}/gdpr`,                    lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
      { url: `${base}/dpa`,                     lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
      { url: `${base}/affiliate-disclosure`,    lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    ] as MetadataRoute.Sitemap;
  }

  const baseUrl = `${siteProtocol}://${domain}`;

  // Minimal fallback sitemap (always valid — ensures no "Missing XML tag" error)
  const fallbackSitemap: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  // For user websites, generate sitemap with all blog articles
  try {
    const response = await publicAPI.getSiteByDomain(domain);
    const siteData = response.data;

    // Use actual domain name (not subdomain) for sitemap URLs
    const actualDomain = siteData.domain.name; // e.g., "betcricket.com"
    const siteBaseUrl = `${siteProtocol}://${actualDomain}`;

    const sitemap: MetadataRoute.Sitemap = [];

    // Add homepage
    sitemap.push({
      url: siteBaseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    });

    // Add contact page (available on all websites)
    sitemap.push({
      url: `${siteBaseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    });

    // Add categories page
    sitemap.push({
      url: `${siteBaseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
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
            url: `${siteBaseUrl}/blog/${slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        }
      }
    }

    return sitemap;
  } catch (error) {
    // Return minimal sitemap with homepage so Google never sees an empty urlset
    return fallbackSitemap;
  }
}

// Enable dynamic rendering (SSR)
export const dynamic = 'force-dynamic';
export const revalidate = 0;
