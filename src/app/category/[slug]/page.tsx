import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { publicAPI } from '@/lib/api';
import TemplateRenderer from '@/components/TemplateRenderer';
import type { Metadata } from 'next';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const headersList = headers();
  const host = headersList.get('host') || '';
  const domain = host.split(':')[0];

  try {
    const response = await publicAPI.getSiteByDomain(domain);
    const siteData = response.data;
    const domainName = siteData.domain.name.split('.')[0];
    const siteName = domainName.charAt(0).toUpperCase() + domainName.slice(1);

    // Decode slug to a readable category name
    const categoryName = params.slug
      .split('-')
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const favicon = siteData.website.websiteLogo;
    const canonicalUrl = `https://${domain}/category/${params.slug}`;

    return {
      metadataBase: new URL(`https://${domain}`),
      title: `${categoryName} - ${siteName}`,
      description: `Browse all ${categoryName} articles on ${siteName}.`,
      alternates: {
        canonical: canonicalUrl,
      },
      ...(favicon && { icons: { icon: favicon, apple: favicon } }),
      openGraph: {
        title: `${categoryName} - ${siteName}`,
        description: `Browse all ${categoryName} articles on ${siteName}.`,
        url: canonicalUrl,
        type: 'website',
        siteName,
      },
    };
  } catch {
    return { title: 'Category' };
  }
}

export default async function CategoryPage({ params }: PageProps) {
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

  return (
    <TemplateRenderer
      siteData={siteData}
      pageType="category"
      categorySlug={params.slug}
    />
  );
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
