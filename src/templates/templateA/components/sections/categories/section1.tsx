'use client';

import React from 'react';
import Image from 'next/image';
import type { TemplateAArticle } from '@/templates/templateA/types';

const PLACEHOLDER_IMAGE = 'https://placehold.co/800x400/e5e5e5/737373?text=Article';

interface CategoriesSection1Props {
  articles: TemplateAArticle[];
  siteTitle?: string;
  onArticleClick: (id: string) => void;
}

const StarIcon = () => (
  <span className="svgIcon svgIcon--star">
    <svg className="svgIcon-use" width={15} height={15}>
      <path d="M7.438 2.324c.034-.099.09-.099.123 0l1.2 3.53a.29.29 0 0 0 .26.19h3.884c.11 0 .127.049.038.111L9.8 8.327a.271.271 0 0 0-.099.291l1.2 3.53c.034.1-.011.131-.098.069l-3.142-2.18a.303.303 0 0 0-.32 0l-3.145 2.182c-.087.06-.132.03-.099-.068l1.2-3.53a.271.271 0 0 0-.098-.292L2.056 6.146c-.087-.06-.071-.112.038-.112h3.884a.29.29 0 0 0 .26-.19l1.2-3.52z" />
    </svg>
  </span>
);

export default function CategoriesSection1({
  articles,
  siteTitle = 'All Articles',
  onArticleClick,
}: CategoriesSection1Props) {
  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    onArticleClick(id);
  };

  if (articles.length === 0) {
    return (
      <div className="content-widget">
        <div className="container">
          <p className="text-center py-5">No articles yet.</p>
        </div>
      </div>
    );
  }

  // Layout distribution
  const mainArticle = articles[0];
  const listArticles = articles.slice(1);       // ALL remaining articles as list rows
  const popularArticles = articles.slice(0, 5); // sidebar top-5

  return (
    <>
      <div className="content-widget">
        <div className="container">
          <div className="row">

            {/* ── Main column ──────────────────────────────── */}
            <div className="col-md-8">
              <h4 className="spanborder">
                <span>{siteTitle}</span>
              </h4>

              {/* Featured article */}
              <article className="first mb-3">
                <figure>
                  <a href="#" onClick={(e) => handleClick(e, mainArticle.id)}>
                    <Image
                      src={mainArticle.image || PLACEHOLDER_IMAGE}
                      alt={mainArticle.title}
                      width={736}
                      height={380}
                      unoptimized={mainArticle.image?.startsWith('http')}
                      style={{ objectFit: 'cover', width: '100%', height: '380px' }}
                    />
                  </a>
                </figure>
                <h1 className="entry-title mb-3" style={{ fontSize: '1.871em', lineHeight: '1.2em' }}>
                  <a href="#" onClick={(e) => handleClick(e, mainArticle.id)}>
                    {mainArticle.title}
                  </a>
                </h1>
                {mainArticle.excerpt && (
                  <div className="entry-excerpt">
                    <p>{mainArticle.excerpt}</p>
                  </div>
                )}
                <div className="entry-meta align-items-center">
                  <span>{mainArticle.author}</span> in <span>{mainArticle.category}</span>
                  <br />
                  <span>{mainArticle.date}</span>
                  <span className="middotDivider" />
                  <span className="readingTime" title={mainArticle.readTime}>
                    {mainArticle.readTime}
                  </span>
                  <StarIcon />
                </div>
              </article>

              <div className="divider" />

              {/* List articles (text left, bg-image right) */}
              {listArticles.map((article) => (
                <article key={article.id} className="row justify-content-between mb-5 mr-0">
                  <div className="col-md-9">
                    <div className="align-self-center">
                      {article.tag && (
                        <div className="capsSubtle mb-2">{article.tag}</div>
                      )}
                      <h3 className="entry-title mb-3" style={{ fontSize: '1.4rem' }}>
                        <a href="#" onClick={(e) => handleClick(e, article.id)}>
                          {article.title}
                        </a>
                      </h3>
                      {article.excerpt && (
                        <div className="entry-excerpt">
                          <p>{article.excerpt}</p>
                        </div>
                      )}
                      <div className="entry-meta align-items-center">
                        <span>{article.author}</span> in <span>{article.category}</span>
                        <br />
                        <span>{article.date}</span>
                        <span className="middotDivider" />
                        <span className="readingTime" title={article.readTime}>
                          {article.readTime}
                        </span>
                        <StarIcon />
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-md-3 bgcover"
                    style={{
                      backgroundImage: `url(${article.image || PLACEHOLDER_IMAGE})`,
                      minHeight: '200px',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                </article>
              ))}

            </div>
            {/* ── end main column ──────────────────────────── */}

            {/* ── Sidebar ──────────────────────────────────── */}
            <div className="col-md-4 pl-md-5 sticky-sidebar">
              <div className="sidebar-widget latest-tpl-4">
                <h5 className="spanborder widget-title" style={{ fontSize: '1.118em', lineHeight: 1, marginBottom: '1.8rem' }}>
                  <span style={{ paddingBottom: '0.5rem' }}>Popular Articles</span>
                </h5>
                <ol>
                  {popularArticles.map((article, i) => (
                    <li key={article.id} className="d-flex" style={{ marginBottom: '1.2em' }}>
                      <div className="post-count" style={{ fontSize: '1.7em', lineHeight: 1 }}>
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <div className="post-content">
                        <h5 className="entry-title mb-1" style={{ fontSize: '1.118em', lineHeight: '1.35em' }}>
                          <a href="#" onClick={(e) => handleClick(e, article.id)}>
                            {article.title}
                          </a>
                        </h5>
                        <div className="entry-meta align-items-center" style={{ fontSize: '0.75rem' }}>
                          <span>{article.author}</span> in <span>{article.category}</span>
                          <br />
                          <span>{article.date}</span>
                          <span className="middotDivider" />
                          <span className="readingTime" title={article.readTime}>
                            {article.readTime}
                          </span>
                          <StarIcon />
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            {/* ── end sidebar ──────────────────────────────── */}

          </div>
        </div>
      </div>
    </>
  );
}
