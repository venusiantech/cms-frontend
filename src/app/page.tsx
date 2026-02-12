import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { publicAPI } from '@/lib/api';
import TemplateRenderer from '@/components/TemplateRenderer';
import type { Metadata } from 'next';

/**
 * Generate metadata for SEO and social sharing
 */
export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const host = headersList.get('host') || '';
  const domain = host.split(':')[0];

  try {
    const response = await publicAPI.getSiteByDomain(domain);
    const siteData = response.data;
    
    const domainName = siteData.domain.name.split('.')[0];
    const siteName = domainName.charAt(0).toUpperCase() + domainName.slice(1);
    
    // Use custom metadata if available, otherwise use defaults
    const title = siteData.website.metaTitle || `${siteName} - Your Source for Quality Content`;
    const description = siteData.website.metaDescription || `Discover amazing content on ${siteName}. Your trusted source for news, insights, and updates.`;
    const image = siteData.website.metaImage || 'https://placehold.co/1200x630/6366f1/white?text=' + encodeURIComponent(siteName);

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [image],
        type: 'website',
        siteName,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
    };
  } catch (error) {
    return {
      title: 'Website',
      description: 'Discover amazing content',
    };
  }
}

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

  // Platform domains (main dashboard URLs) - supports comma-separated list
  const platformDomainsEnv = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'cms.local';
  const platformDomains = platformDomainsEnv.split(',').map(d => d.trim());

  // Check if this is the main platform domain (not a subdomain)
  // Example: jaal.com is platform, but music-byi6.jaal.com is a user site
  const isPlatformDomain = 
    domain === 'localhost' || 
    domain.startsWith('127.0.0.1') ||
    platformDomains.includes(domain) || // Exact match only
    domain === 'cms.local';

  // Special check: if domain is a subdomain of platform domain, it's a user site
  const isSubdomainOfPlatform = platformDomains.some(pd => 
    domain !== pd && domain.endsWith('.' + pd)
  );

  if (isPlatformDomain && !isSubdomainOfPlatform) {
    // Redirect to dashboard
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Jaal CMS</h1>
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
    
    // Show professional "Host Your Site" page instead of 404
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-12 text-center">
            {/* Icon */}
            <div className="mx-auto w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <svg 
                className="w-10 h-10 text-slate-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" 
                />
              </svg>
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              This Domain Is Available
            </h1>
            
            {/* Description */}
            <p className="text-lg text-slate-600 mb-8">
              Turn your unused domain into a professional website in minutes.
              No coding required.
            </p>

            {/* Domain Badge */}
            <div className="bg-slate-50 rounded-lg px-6 py-3 mb-8 inline-block">
              <code className="text-slate-700 font-mono text-sm">{domain}</code>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="px-8 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors duration-200 shadow-lg"
              >
                Get Started
              </a>
              <a
                href="/login"
                className="px-8 py-3 bg-white text-slate-900 font-semibold rounded-lg border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200"
              >
                Sign In
              </a>
            </div>

            {/* Features */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
                <div>
                  <div className="font-semibold text-slate-900 mb-1">AI-Powered</div>
                  <div className="text-sm text-slate-600">Content generated automatically</div>
                </div>
                <div>
                  <div className="font-semibold text-slate-900 mb-1">Instant Setup</div>
                  <div className="text-sm text-slate-600">Live in under 5 minutes</div>
                </div>
                <div>
                  <div className="font-semibold text-slate-900 mb-1">Easy Management</div>
                  <div className="text-sm text-slate-600">Update content anytime</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-slate-500 text-sm">
              Powered by <span className="font-semibold">JAAL</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render template with data
  return <TemplateRenderer siteData={siteData} />;
}

// Enable dynamic rendering (SSR) and disable all caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

