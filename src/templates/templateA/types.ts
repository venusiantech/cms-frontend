/**
 * TemplateA article shape used by home sections and single-article view.
 * id = sectionId from CMS.
 */
export interface TemplateAArticle {
  id: string;
  title: string;
  excerpt?: string;
  author: string;
  category: string;
  date: string;
  readTime: string;
  image?: string;
  tag?: string;
  number?: string;
  /** Full markdown body for single-article view */
  content?: string;
}

export interface TemplateAFeatured {
  title: string;
  mainArticle: TemplateAArticle;
  sideArticles: TemplateAArticle[];
}

export interface TemplateATrending {
  title: string;
  articles: TemplateAArticle[];
}

export interface TemplateAFeaturedSlider {
  title: string;
  articles: TemplateAArticle[];
}

export interface TemplateATodayHighlights {
  articles: TemplateAArticle[];
  ad?: { image: string; link: string };
}

export interface TemplateAMostRecent {
  title: string;
  mainArticles: TemplateAArticle[];
  sideArticles: TemplateAArticle[];
  popular: { title: string; articles: TemplateAArticle[] };
  ad?: { image: string; link: string };
}

export interface TemplateABlogData {
  featured: TemplateAFeatured;
  trending: TemplateATrending;
  featuredSlider: TemplateAFeaturedSlider;
  todayHighlights: TemplateATodayHighlights;
  mostRecent: TemplateAMostRecent;
}
