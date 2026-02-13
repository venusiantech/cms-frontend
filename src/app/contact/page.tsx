import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { publicAPI } from '@/lib/api';
import TemplateRenderer from '@/components/TemplateRenderer';
import type { Metadata } from 'next';

/**
 * Generate metadata for contact page
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
    
    return {
      title: `Contact Us - ${siteName}`,
      description: `Get in touch with ${siteName}. We'd love to hear from you.`,
      openGraph: {
        title: `Contact Us - ${siteName}`,
        description: `Get in touch with ${siteName}. We'd love to hear from you.`,
        type: 'website',
        siteName,
      },
    };
  } catch (error) {
    return {
      title: 'Contact Us',
      description: 'Get in touch with us',
    };
  }
}

/**
 * Contact page - renders the contact form using the appropriate template
 */
export default async function ContactPage() {
  // Get domain from request headers
  const headersList = headers();
  const host = headersList.get('host') || '';
  const domain = host.split(':')[0];

  console.log('📧 Rendering contact page for domain:', domain);

  // Fetch site data from backend
  let siteData;
  try {
    const response = await publicAPI.getSiteByDomain(domain);
    siteData = response.data;
  } catch (error) {
    console.error('Failed to fetch site data:', error);
    notFound();
  }

  // Render template with contact page flag
  return <TemplateRenderer siteData={siteData} pageType="contact" />;
}

// Enable dynamic rendering (SSR) and disable all caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;
