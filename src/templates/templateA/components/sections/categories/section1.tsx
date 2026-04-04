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
                      className="object-cover w-full h-[380px]"
                    />
                  </a>
                </figure>
                <h1
                  className="entry-title mb-3 cursor-pointer text-[1.871em] leading-[1.2em]"
                  onClick={(e) => handleClick(e, mainArticle.id)}
                >
                  {mainArticle.title}
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
                      <h3
                        className="entry-title mb-3 cursor-pointer text-[1.4rem]"
                        onClick={(e) => handleClick(e, article.id)}
                      >
                        {article.title}
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
                    className="col-md-3 bgcover min-h-[200px] bg-cover bg-center"
                    style={{ backgroundImage: `url(${article.image || PLACEHOLDER_IMAGE})` }}
                  />
                </article>
              ))}

            </div>
            {/* ── end main column ──────────────────────────── */}

            {/* ── Sidebar ──────────────────────────────────── */}
            <div className="col-md-4 pl-md-5 sticky-sidebar">
              <div className="sidebar-widget latest-tpl-4">
                <h5 className="spanborder widget-title text-[1.118em] leading-none mb-[1.8rem]">
                  <span className="pb-2">Popular Articles</span>
                </h5>
                <ol>
                  {popularArticles.map((article, i) => (
                    <li key={article.id} className="d-flex mb-[1.2em]">
                      <div className="post-count text-[1.7em] leading-none">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <div className="post-content">
                        <h5 className="entry-title mb-1 text-[1.118em] leading-[1.35em]">
                          <a href="#" onClick={(e) => handleClick(e, article.id)}>
                            {article.title}
                          </a>
                        </h5>
                        <div className="entry-meta align-items-center text-xs">
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
