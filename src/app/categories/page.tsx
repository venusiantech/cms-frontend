import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { publicAPI } from '@/lib/api';
import TemplateRenderer from '@/components/TemplateRenderer';
import type { Metadata } from 'next';

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
      title: `All Articles - ${siteName}`,
      description: `Browse all articles on ${siteName}.`,
      openGraph: {
        title: `All Articles - ${siteName}`,
        description: `Browse all articles on ${siteName}.`,
        type: 'website',
        siteName,
      },
    };
  } catch {
    return { title: 'All Articles' };
  }
}

export default async function CategoriesPage() {
  const headersList = headers();
  const host = headersList.get('host') || '';
  const domain = host.split(':')[0];

  let siteData;
  try {
    const response = await publicAPI.getSiteByDomain(domain);
    siteData = response.data;
  } catch {
    notFound();
  }

  return <TemplateRenderer siteData={siteData} pageType="categories" />;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
