import { headers } from 'next/headers';

/**
 * Dynamic robots.txt generation per domain
 * Next.js will serve this at /robots.txt for each domain
 */
export default async function robots() {
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

  // If it's the main platform domain (not a user site), use default robots.txt
  if (isPlatformDomain && !isSubdomainOfPlatform) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  // For user websites, allow all crawling
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const fullUrl = `${protocol}://${host}`;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      crawlDelay: 1,
    },
    sitemap: `${fullUrl}/sitemap.xml`,
  };
}
