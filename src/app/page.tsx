import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { publicAPI } from '@/lib/api';
import TemplateRenderer from '@/components/TemplateRenderer';

/**
 * CRITICAL: Domain-based rendering page
 * 
 * This is the SINGLE page that renders ALL user websites
 * It reads the incoming domain from headers and fetches site data
 * 
 * How it works:
 * 1. User visits example.com
 * 2. Next.js receives request with Host: example.com
 * 3. We fetch site data from backend API
 * 4. We render the appropriate template with the data
 */
export default async function PublicSitePage() {
  // Get domain from request headers
  const headersList = headers();
  const host = headersList.get('host') || '';
  
  // Extract domain (remove port if present)
  const domain = host.split(':')[0];

  console.log('🌐 Rendering site for domain:', domain);

  // Platform domain (main dashboard URL)
  const platformDomain = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'cms.local';

  // Skip rendering for localhost and platform dashboard routes
  if (
    domain === 'localhost' || 
    domain.startsWith('127.0.0.1') ||
    domain === platformDomain ||
    domain === 'cms.local' ||
    domain === 'jaal'
  ) {
    // Redirect to dashboard
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Domain CMS Platform</h1>
          <p className="text-gray-600 mb-8">Multi-tenant website management</p>
          <a href="/dashboard" className="btn-primary">
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  // Fetch site data from backend (with cache busting)
  let siteData;
  try {
    const response = await publicAPI.getSiteByDomain(domain);
    siteData = response.data;
  } catch (error) {
    console.error('Failed to fetch site data:', error);
    notFound();
  }

  // Render template with data
  return <TemplateRenderer siteData={siteData} />;
}

// Enable dynamic rendering (SSR) and disable all caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

