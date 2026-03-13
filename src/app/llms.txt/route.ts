import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * Serves /llms.txt — the llmstxt.org standard for helping LLMs understand
 * and navigate this site. Automatically discovers content and structure.
 */
export async function GET() {
  const headersList = headers();
  const host = headersList.get('host') || 'fastofy.com';
  const forwardedProto = headersList.get('x-forwarded-proto');
  const isLocal = host.startsWith('localhost') || host.startsWith('127.0.0.1');
  const protocol = forwardedProto || (isLocal ? 'http' : 'https');
  const base = `${protocol}://${host}`;

  const content = `# FASTOFY

> FASTOFY is an AI-powered SaaS platform that transforms unused domains into professional, SEO-optimized, revenue-generating websites — in minutes, with no coding required.

FASTOFY helps domain investors, small business owners, and agencies activate idle domains at scale. The platform uses AI to auto-generate blog content, optimizes every page for search engines, and enables monetization through Google AdSense, contact forms, and lead capture — all managed from a single multi-tenant dashboard.

## Core Pages

- [Home / Landing](${base}/landing): Full product overview — features, pricing, testimonials, how it works, and CTA to start free trial.
- [Dashboard](${base}/dashboard): Authenticated user dashboard to manage domains, generate websites, edit content, and view leads.
- [Register](${base}/register): Create a free FASTOFY account. The Starter plan is always free — no credit card required.
- [Login](${base}/login): Sign in to an existing FASTOFY account.
- [Contact](${base}/contact): Reach the FASTOFY support team directly.

## Key Features

- AI-generated website design tailored to each domain name
- Automatic blog content generation using research-based AI writing
- OnPage SEO: meta tags, headings, alt text, schema markup auto-applied
- Smart backlinking: internal and strategic external links
- Lead generation: contact forms, popups, live chat (Tawk.to)
- Monetization: Google AdSense integration, Amazon Associates support
- Traffic analytics dashboard: visitors, sources, conversions
- Mobile-responsive, SSL-secured, CDN-delivered websites
- Multi-tenant: manage unlimited domains from one account
- White-label and API access on Enterprise plan

## Pricing

- **Free** — 1 website, 6 AI credits/month, forever free
- **Starter** — 8 websites, 80 AI credits/month, $20/month
- **Business** — 100 websites, 350 AI credits/month, $100/month
- All paid plans include a 14-day free trial and 30-day money-back guarantee

## Legal & Compliance

- [Privacy Policy](${base}/privacy-policy): Data collection, storage, and usage practices.
- [Terms of Service](${base}/terms-of-service): Rules and conditions for using FASTOFY.
- [Refund Policy](${base}/refund-policy): 30-day money-back guarantee terms.
- [Cookie Policy](${base}/cookie-policy): How cookies are used on this site.
- [GDPR](${base}/gdpr): GDPR compliance information for EU users.
- [Data Processing Agreement](${base}/dpa): DPA for enterprise and GDPR-regulated use cases.
- [Affiliate Disclosure](${base}/affiliate-disclosure): Disclosure of affiliate partnerships.

## Support

- Email: support@fastofy.com
- Live Chat: Available on the website via Tawk.to widget
- Response time: ~2 minutes during business hours

## Technical

- Sitemap: ${base}/sitemap.xml
- Robots: ${base}/robots.txt
- Stack: Next.js frontend, Node.js/Express backend, PostgreSQL, Prisma ORM, Stripe payments, Cloudflare CDN
`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  });
}

export const dynamic = 'force-dynamic';
