import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Providers } from '@/components/providers/Providers';
import NavigationProgress from '@/components/NavigationProgress';

const inter = Inter({ subsets: ['latin'] });

const GA_ID = 'G-VBK9FM3J4M';

export const metadata: Metadata = {
  metadataBase: new URL('https://fastofy.com'),
  title: {
    default: 'FASTOFY — Turn Unused Domains into AI-Powered Websites',
    template: '%s | FASTOFY',
  },
  description:
    'Transform your unused domains into professional, SEO-optimized websites with AI-generated content. Launch in minutes, not months. No coding required.',
  keywords: [
    'domain CMS', 'AI website builder', 'domain monetization',
    'SEO websites', 'AI content generation', 'website builder',
  ],
  authors: [{ name: 'FASTOFY', url: 'https://fastofy.com' }],
  creator: 'FASTOFY',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://fastofy.com',
    siteName: 'FASTOFY',
    title: 'FASTOFY — Turn Unused Domains into AI-Powered Websites',
    description:
      'Transform your unused domains into professional, SEO-optimized websites with AI-generated content. Launch in minutes, not months.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FASTOFY — Turn Unused Domains into AI-Powered Websites',
    description:
      'Transform your unused domains into professional, SEO-optimized websites with AI-generated content.',
    creator: '@fastofy',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <NavigationProgress />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

