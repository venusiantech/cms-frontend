'use client';

import { useState, useEffect, useMemo } from 'react';
import type { TemplateAArticle, TemplateABlogData } from '@/templates/templateA/types';
import Layout from '@/templates/templateA/components/layout/Layout';
import HomeSection1 from '@/templates/templateA/components/sections/home/Section1';
import HomeSection2 from '@/templates/templateA/components/sections/home/Section2';
import HomeSection3 from '@/templates/templateA/components/sections/home/Section3';
import HomeSection4 from '@/templates/templateA/components/sections/home/Section4';
import SingleSection1 from '@/templates/templateA/components/sections/single/Section1';

// TemplateA styles (loaded only when this template is used)
import '@/templates/templateA/public/assets/css/bootstrap.css';
import '@/templates/templateA/public/assets/css/widgets.css';
import '@/templates/templateA/public/assets/css/color-default.css';
import '@/templates/templateA/public/assets/css/fontello.css';
import '@/templates/templateA/public/assets/css/style.css';
import '@/templates/templateA/public/assets/css/responsive.css';

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
  };
  domain: { name: string };
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
    const title = titleBlock?.content?.text || 'Untitled';
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

export default function TemplateA({ page, website, domain }: TemplateAProps) {
  const blogData = useMemo(() => mapPageToTemplateAData(page, domain), [page, domain]);
  const blogsWithContent = useMemo(() => {
    const domainName = domain.name.split('.')[0];
    const raw = blogsFromPage(page, domainName.charAt(0).toUpperCase() + domainName.slice(1));
    return raw.map((b, i) => ({ ...toTemplateAArticle(b, i), content: b.content }));
  }, [page, domain.name]);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const name = domain.name.split('.')[0];
    document.title = `${name.charAt(0).toUpperCase() + name.slice(1)}`;
  }, [domain.name]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get('article');
    if (id) setSelectedId(id);
  }, []);

  useEffect(() => {
    if (selectedId && typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('article', selectedId);
      window.history.replaceState({}, '', url.toString());
    }
  }, [selectedId]);

  const selectedArticle = selectedId
    ? (blogsWithContent.find((a) => a.id === selectedId) || null)
    : null;
  const relatedArticles = blogsWithContent.filter((a) => a.id !== selectedId).slice(0, 5);
  const siteName = domain.name.split('.')[0];
  const siteDisplay = siteName.charAt(0).toUpperCase() + siteName.slice(1);

  const onArticleClick = (id: string) => setSelectedId(id);
  const onBack = () => setSelectedId(null);

  if (selectedArticle) {
    return (
      <Layout classLisst="single" siteName={siteDisplay} assetsPath={ASSETS}>
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

  return (
    <Layout classLisst="home" siteName={siteDisplay} assetsPath={ASSETS}>
      <HomeSection2 featuredSlider={blogData.featuredSlider} onArticleClick={onArticleClick} />
      <HomeSection1
        featured={blogData.featured}
        trending={blogData.trending}
        onArticleClick={onArticleClick}
      />
      {/* <HomeSection3 todayHighlights={blogData.todayHighlights} onArticleClick={onArticleClick} />
      <HomeSection4 mostRecent={blogData.mostRecent} onArticleClick={onArticleClick} /> */}
    </Layout>
  );
}
