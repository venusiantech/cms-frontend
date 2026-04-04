import { NextRequest, NextResponse } from 'next/server'

/**
 * Routes that belong exclusively to the Fastofy platform.
 * They must never be accessible on generated user websites.
 */
const PLATFORM_ONLY_PATHS = [
  '/dashboard',
  '/login',
  '/register',
  '/landing',
  '/privacy-policy',
  '/gdpr',
  '/dpa',
  '/cookie-policy',
  '/affiliate-disclosure',
  '/refund-policy',
  '/terms-of-service',
  '/home-5',
]

/**
 * Returns true only for the main platform domains (e.g. fastofy.com, jaal.com,
 * localhost, cms.local). Subdomains like vegetarians-6gtf.fastofy.com are treated
 * as user-generated sites and will have platform routes blocked.
 */
function isMainPlatformDomain(host: string): boolean {
  const raw = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'cms.local'
  const platformDomains = raw.split(',').map((d) => d.trim())
  const cleanHost = host.split(':')[0]

  return (
    cleanHost === 'localhost' ||
    cleanHost.startsWith('127.0.0.1') ||
    cleanHost === 'cms.local' ||
    platformDomains.includes(cleanHost)
  )
}

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''
  const { pathname } = request.nextUrl

  // Platform domains have unrestricted access to all routes
  if (isMainPlatformDomain(host)) {
    return NextResponse.next()
  }

  // For generated-site domains, block any platform-only path
  const isBlocked = PLATFORM_ONLY_PATHS.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  )

  if (isBlocked) {
    // Return a plain 404 — do not reveal any platform branding
    return new NextResponse(null, { status: 404 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static  (Next.js static assets)
     * - _next/image   (Next.js image optimisation)
     * - favicon.ico
     * - logo/ (public logo assets)
     * - api/          (API routes — handled by their own auth)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|logo/|api/).*)',
  ],
}
