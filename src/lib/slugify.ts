/**
 * Convert text to URL-friendly slug
 * 
 * @param text - The text to convert to a slug
 * @returns A URL-safe slug string
 * 
 * @example
 * slugify("Top 10 Vegetarian Recipes!") // "top-10-vegetarian-recipes"
 * slugify("Hello World!!!") // "hello-world"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '') // Remove quotes
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, '') // Remove non-word characters except hyphens
    .replace(/\-\-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '') // Remove leading hyphens
    .replace(/-+$/, ''); // Remove trailing hyphens
}

/**
 * Create a unique SEO-friendly slug by combining title and section ID
 * 
 * @param title - The blog post title
 * @param sectionId - The UUID of the section
 * @returns A unique slug with 6-character suffix for uniqueness
 * 
 * @example
 * createUniqueSlug("Top 10 Recipes", "6131119f-f567-4bc4-825f-9411969e50c6")
 * // Returns: "top-10-recipes-9e50c6"
 */
export function createUniqueSlug(title: string, sectionId: string): string {
  const baseSlug = slugify(title);
  const suffix = sectionId.slice(-6); // Last 6 chars of UUID for uniqueness
  return `${baseSlug}-${suffix}`;
}

/**
 * Extract the section ID suffix from a slug
 * 
 * @param slug - The full slug string
 * @returns The 6-character suffix, or null if not found
 * 
 * @example
 * extractSectionIdFromSlug("top-10-recipes-9e50c6") // "9e50c6"
 * extractSectionIdFromSlug("invalid-slug") // null
 */
export function extractSectionIdFromSlug(slug: string): string | null {
  const parts = slug.split('-');
  const lastPart = parts[parts.length - 1];
  
  // Valid suffix must be exactly 6 characters (last 6 of UUID)
  if (lastPart && lastPart.length === 6) {
    return lastPart;
  }
  
  return null;
}
