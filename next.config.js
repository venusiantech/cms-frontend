/** @type {import('next').NextConfig} */
/**
 * Who may embed this app in an iframe (dashboard preview, same-origin, etc.).
 * X-Frame-Options: SAMEORIGIN blocks parent fastofy.com from framing *.fastofy.com subdomains — different origins.
 * CSP frame-ancestors replaces XFO and allows listing the dashboard origin explicitly.
 * Override: NEXT_PUBLIC_FRAME_ANCESTORS="https://fastofy.com,https://app.example.com"
 */
function frameAncestorsCsp() {
  const raw = process.env.NEXT_PUBLIC_FRAME_ANCESTORS;
  const list = raw && raw.trim()
    ? ["'self'", ...raw.split(',').map((s) => s.trim()).filter(Boolean)]
    : [
        "'self'",
        'https://fastofy.com',
        'https://www.fastofy.com',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
      ];
  return `frame-ancestors ${list.join(' ')}`;
}

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/post/:path*', destination: '/blog/:path*', permanent: true },
    ]
  },
  images: {
    domains: ['placehold.co', 'localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: frameAncestorsCsp() },
          { key: 'X-Content-Type-Options',  value: 'nosniff' },
          { key: 'X-XSS-Protection',        value: '1; mode=block' },
          { key: 'Referrer-Policy',         value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',      value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

