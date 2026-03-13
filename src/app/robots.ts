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

  const forwardedProto = headersList.get('x-forwarded-proto');
  const isLocalDomain =
    domain === 'localhost' ||
    domain.startsWith('127.0.0.1') ||
    domain.endsWith('.local');
  const protocol = forwardedProto || (isLocalDomain ? 'http' : 'https');
  const fullUrl = `${protocol}://${domain}`;

  // If it's the main platform domain (not a user site)
  if (isPlatformDomain && !isSubdomainOfPlatform) {
    return {
      rules: [
        // All crawlers: allow everything except private routes
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/dashboard', '/api/'],
        },
        // Explicitly allow ChatGPT / OpenAI crawlers
        {
          userAgent: 'GPTBot',
          allow: '/',
          disallow: ['/dashboard', '/api/'],
        },
        {
          userAgent: 'OAI-SearchBot',
          allow: '/',
          disallow: ['/dashboard', '/api/'],
        },
        {
          userAgent: 'ChatGPT-User',
          allow: '/',
          disallow: ['/dashboard', '/api/'],
        },
        // Explicitly allow Google
        {
          userAgent: 'Googlebot',
          allow: '/',
          disallow: ['/dashboard', '/api/'],
        },
        // Explicitly allow Bing
        {
          userAgent: 'Bingbot',
          allow: '/',
          disallow: ['/dashboard', '/api/'],
        },
      ],
      sitemap: `${fullUrl}/sitemap.xml`,
    };
  }

  // For user websites, allow all crawling
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
    ],
    sitemap: `${fullUrl}/sitemap.xml`,
  };
}
