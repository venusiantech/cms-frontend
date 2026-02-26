// Re-export dashboard API surface (domains + websites for generate/job status)
export { domainsAPI, websitesAPI } from './api';

/**
 * Get the correct site URL based on environment (production vs local).
 */
export function getSiteUrl(subdomain: string): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const isProduction = apiUrl.includes('railway.app') || apiUrl.includes('fastofy.com');

  if (isProduction) {
    return `https://${subdomain}.fastofy.com`;
  }
  return `http://${subdomain}.local:3000`;
}
