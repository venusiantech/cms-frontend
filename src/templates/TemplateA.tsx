'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { TemplateAArticle, TemplateABlogData } from '@/templates/templateA/types';
import Layout from '@/templates/templateA/components/layout/Layout';
import HomeSection1 from '@/templates/templateA/components/sections/home/Section1';
import HomeSection2 from '@/templates/templateA/components/sections/home/Section2';
import HomeSection3 from '@/templates/templateA/components/sections/home/Section3';
import HomeSection4 from '@/templates/templateA/components/sections/home/Section4';
import SingleSection1 from '@/templates/templateA/components/sections/single/Section1';
import ContactSection from '@/templates/templateA/components/sections/contact/ContactSection';

// TemplateA styles will be loaded dynamically to avoid affecting other templates

interface Section {
  id: string;
  type: string;
  order: number;
  blocks: Array<{ id: string; type: string; content: any }>;
}

interface PageData {
  id: string;
  slug: string;
  seo: { title: string | null; description: string | null };
  sections: Section[];
}

interface TemplateAProps {
  page: PageData;
  website: {
    id: string;
    templateKey: string;
    adsEnabled: boolean;
    adsApproved: boolean;
    contactFormEnabled: boolean;
    instagramUrl?: string | null;
    facebookUrl?: string | null;
    twitterUrl?: string | null;
  };
  domain: { name: string };
  articleId?: string; // For direct article page rendering
  pageType?: 'home' | 'contact' | 'article'; // Type of page to render
}

const PLACEHOLDER_IMAGE = 'https://placehold.co/800x400/e5e5e5/737373?text=Article';
const ASSETS = '/templateA/assets';

function blogsFromPage(
  page: PageData,
  domainName: string
): Array<{ sectionId: string; title: string; content: string; preview: string; image: string; dateStr: string; readTime: string; domainName: string }> {
  const contentSections = page.sections.filter((s) => s.type === 'content');
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return contentSections.map((section) => {
    let titleBlock = section.blocks.find((b) => b.type === 'text' && b.content?.isTitle);
    let contentBlock = section.blocks.find((b) => b.type === 'text' && b.content?.isFullContent);
    let previewBlock = section.blocks.find((b) => b.type === 'text' && b.content?.isPreview);
    const imageBlock = section.blocks.find((b) => b.type === 'image');
    const textBlocks = section.blocks.filter((b) => b.type === 'text');
    if (!titleBlock || !contentBlock || !previewBlock) {
      if (textBlocks.length === 1) titleBlock = contentBlock = previewBlock = textBlocks[0];
      else if (textBlocks.length >= 2) {
        titleBlock = titleBlock || textBlocks[0];
        contentBlock = contentBlock || textBlocks[1];
        previewBlock = previewBlock || textBlocks[1];
      }
      if (textBlocks.length >= 3 && !contentBlock) {
        titleBlock = titleBlock || textBlocks[0];
        contentBlock = contentBlock || textBlocks[1];
        previewBlock = previewBlock || textBlocks[2];
      }
    }
    let title = titleBlock?.content?.text || 'Untitled';
    // Remove quotes from title
    title = title.replace(/^["']|["']$/g, '').trim();
    
    const content = contentBlock?.content?.text || previewBlock?.content?.text || '';
    const preview = previewBlock?.content?.text || content?.substring(0, 300) + '...' || '';
    const image = imageBlock?.content?.url || PLACEHOLDER_IMAGE;
    const readTime = `${Math.max(1, Math.ceil(content.length / 1000))} min read`;
    return { sectionId: section.id, title, content, preview, image, dateStr, readTime, domainName };
  });
}

function toTemplateAArticle(
  b: { sectionId: string; title: string; content: string; preview: string; image: string; dateStr: string; readTime: string; domainName: string },
  index: number,
  opts?: { tag?: string; number?: string }
): TemplateAArticle {
  return {
    id: b.sectionId,
    title: b.title,
    excerpt: b.preview,
    author: b.domainName,
    category: 'Article',
    date: b.dateStr,
    readTime: b.readTime,
    image: b.image,
    tag: opts?.tag,
    number: (opts && opts.number !== undefined ? opts.number : String(index + 1).padStart(2, '0')),
  };
}

function mapPageToTemplateAData(page: PageData, domain: { name: string }): TemplateABlogData {
  const domainName = domain.name.split('.')[0];
  const domainDisplay = domainName.charAt(0).toUpperCase() + domainName.slice(1);
  const raw = blogsFromPage(page, domainDisplay);
  const articles = raw.map((b, i) => toTemplateAArticle(b, i));
  const withContent = raw.map((b, i) => ({
    ...toTemplateAArticle(b, i),
    content: b.content,
  }));

  const main = articles[0];
  const side = articles.slice(1, 4);
  const trendingList = articles.slice(0, 5).map((a, i) => ({ ...a, number: String(i + 1).padStart(2, '0') }));
  const sliderList = articles.slice(0, 5);
  const todayList = articles.slice(0, 4);
  const mostRecentMain = articles.slice(0, 3).map((a, i) => ({ ...a, tag: i === 0 ? "Editors' Pick" : 'Article' }));
  const mostRecentSide = articles.slice(3, 7);
  const popularList = articles.slice(0, 5).map((a, i) => ({ ...a, number: String(i + 1).padStart(2, '0') }));

  const defaultAd = { image: `${ASSETS}/images/ads/ads-1.png`, link: '#' };

  return {
    featured: {
      title: "Editor's Picks",
      mainArticle: main != null ? main : toTemplateAArticle(
        { sectionId: '', title: 'No posts yet', content: '', preview: '', image: PLACEHOLDER_IMAGE, dateStr: '', readTime: '0 min read', domainName: domainDisplay },
        0
      ),
      sideArticles: side.length ? side : [],
    },
    trending: { title: 'Trending', articles: trendingList },
    featuredSlider: { title: 'Readers vote', articles: sliderList },
    todayHighlights: {
      articles: todayList,
      // ad: defaultAd,
    },
    mostRecent: {
      title: 'Most Recent',
      mainArticles: mostRecentMain,
      sideArticles: mostRecentSide,
      popular: { title: 'Popular', articles: popularList },
      // ad: defaultAd,
    },
  };
}

export default function TemplateA({ page, website, domain, articleId, pageType = 'home' }: TemplateAProps) {
  const router = useRouter();
  const blogData = useMemo(() => mapPageToTemplateAData(page, domain), [page, domain]);
  const blogsWithContent = useMemo(() => {
    const domainName = domain.name.split('.')[0];
    const raw = blogsFromPage(page, domainName.charAt(0).toUpperCase() + domainName.slice(1));
    return raw.map((b, i) => ({ ...toTemplateAArticle(b, i), content: b.content }));
  }, [page, domain.name]);

  const [selectedId, setSelectedId] = useState<string | null>(articleId || null);
  const [cssLoaded, setCssLoaded] = useState(false);
  const [showContactForm, setShowContactForm] = useState(pageType === 'contact');

  // Dynamically load TemplateA CSS files with loading state
  useEffect(() => {
    const cssFiles = [
      '/templateA/assets/css/bootstrap.css',
      '/templateA/assets/css/widgets.css',
      '/templateA/assets/css/color-default.css',
      '/templateA/assets/css/fontello.css',
      '/templateA/assets/css/style.css',
      '/templateA/assets/css/responsive.css',
    ];

    const linkElements: HTMLLinkElement[] = [];
    const preloadElements: HTMLLinkElement[] = [];
    let loadedCount = 0;

    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === cssFiles.length) {
        // Small delay to ensure styles are fully applied
        setTimeout(() => {
          setCssLoaded(true);
        }, 30);
      }
    };

    // First, add preload hints for faster loading
    cssFiles.forEach((href) => {
      const preload = document.createElement('link');
      preload.rel = 'preload';
      preload.as = 'style';
      preload.href = href;
      document.head.appendChild(preload);
      preloadElements.push(preload);
    });

    // Then add actual stylesheets
    cssFiles.forEach((href) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.setAttribute('data-template', 'templateA');
      
      // Wait for CSS to load
      link.onload = checkAllLoaded;
      link.onerror = checkAllLoaded; // Still proceed even if one fails
      
      document.head.appendChild(link);
      linkElements.push(link);
    });

    // Fallback: If CSS doesn't load in 1.5 seconds, show content anyway
    const fallbackTimer = setTimeout(() => {
      setCssLoaded(true);
    }, 1500);

    // Cleanup: Remove CSS files when component unmounts
    return () => {
      clearTimeout(fallbackTimer);
      preloadElements.forEach((link) => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
      linkElements.forEach((link) => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    };
  }, []);

  // Update document title based on selected article or contact page
  useEffect(() => {
    const name = domain.name.split('.')[0];
    const siteName = name.charAt(0).toUpperCase() + name.slice(1);
    if (showContactForm) {
      document.title = `Contact Us - ${siteName}`;
    } else if (selectedId) {
      const article = blogsWithContent.find((a) => a.id === selectedId);
      document.title = article ? `${article.title} - ${siteName}` : siteName;
    } else {
      document.title = siteName;
    }
  }, [domain.name, selectedId, blogsWithContent, showContactForm]);

  // Update selected article when articleId prop changes (from URL)
  useEffect(() => {
    if (articleId) {
      setSelectedId(articleId);
    }
  }, [articleId]);

  const selectedArticle = selectedId
    ? (blogsWithContent.find((a) => a.id === selectedId) || null)
    : null;
  const relatedArticles = blogsWithContent.filter((a) => a.id !== selectedId).slice(0, 5);
  const siteName = domain.name.split('.')[0];
  const siteDisplay = siteName.charAt(0).toUpperCase() + siteName.slice(1);

  // Handle article click - Navigate to article page (SEO-friendly)
  const onArticleClick = (id: string) => {
    router.push(`/blog/${id}`);
  };
  
  const onBack = () => {
    // Navigate back to home page
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    } else {
      router.push('/');
    }
  };

  // Handle contact form toggle - only if contactFormEnabled is true
  const handleContactClick = website.contactFormEnabled ? () => {
    setShowContactForm(true);
    // Navigate to contact page
    router.push('/contact');
  } : undefined;

  // Show loading screen while CSS is loading
  if (!cssLoaded) {
    return (
      <>
        <div className="template-loader">
          <div className="loader-content">
            <h1 className="loader-logo">{siteDisplay}</h1>
            <div className="spinner"></div>
          </div>
        </div>
        <style jsx>{`
          .template-loader {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #ffffff;
          }
          .loader-content {
            text-align: center;
          }
          .loader-logo {
            font-family: 'Playfair Display', serif;
            font-size: 2.5rem;
            font-weight: 700;
            color: #333;
            margin-bottom: 1.5rem;
            letter-spacing: 1px;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #333;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin: 0 auto;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </>
    );
  }

  // Render content with fade-in animation
  const renderContent = () => {
    // Contact Form Page
    if (showContactForm) {
      return (
        <Layout 
          classLisst="single" 
          siteName={siteDisplay} 
          assetsPath={ASSETS}
          instagramUrl={website.instagramUrl}
          facebookUrl={website.facebookUrl}
          twitterUrl={website.twitterUrl}
          onContactClick={handleContactClick}
        >
          <ContactSection
            domain={domain}
            onBack={onBack}
            assetsPath={ASSETS}
          />
        </Layout>
      );
    }

    // Single Article Page
    if (selectedArticle) {
      return (
        <Layout 
          classLisst="single" 
          siteName={siteDisplay} 
          assetsPath={ASSETS}
          instagramUrl={website.instagramUrl}
          facebookUrl={website.facebookUrl}
          twitterUrl={website.twitterUrl}
          onContactClick={handleContactClick}
        >
          <SingleSection1
            article={selectedArticle}
            relatedArticles={relatedArticles}
            onBack={onBack}
            onArticleClick={onArticleClick}
            assetsPath={ASSETS}
          />
        </Layout>
      );
    }

    // Home Page
    return (
      <Layout 
        classLisst="home" 
        siteName={siteDisplay} 
        assetsPath={ASSETS}
        instagramUrl={website.instagramUrl}
        facebookUrl={website.facebookUrl}
        twitterUrl={website.twitterUrl}
        onContactClick={handleContactClick}
      >
        <HomeSection1
          featured={blogData.featured}
          trending={blogData.trending}
          onArticleClick={onArticleClick}
        />
        <HomeSection2 featuredSlider={blogData.featuredSlider} onArticleClick={onArticleClick} />
        {/* <HomeSection3 todayHighlights={blogData.todayHighlights} onArticleClick={onArticleClick} />
        <HomeSection4 mostRecent={blogData.mostRecent} onArticleClick={onArticleClick} /> */}
      </Layout>
    );
  };

  return (
    <>
      <div className="template-content">
        {renderContent()}
      </div>
      <style jsx>{`
        .template-content {
          animation: fadeIn 0.3s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}
