'use client';

import { useState } from 'react';
import Image from 'next/image';
import Pagination from '@/templates/templateA/components/elements/Pagination';
import type { TemplateAMostRecent } from '@/templates/templateA/types';

interface Section4Props {
  mostRecent: TemplateAMostRecent;
  onArticleClick: (id: string) => void;
}

export default function Section4({ mostRecent, onArticleClick }: Section4Props) {
  const [currentSidePage, setCurrentSidePage] = useState(1);
  const itemsPerPage = 4;
  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    onArticleClick(id);
  };

  const startIndex = (currentSidePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSideArticles = mostRecent.sideArticles.slice(startIndex, endIndex);
  const totalSidePages = Math.max(1, Math.ceil(mostRecent.sideArticles.length / itemsPerPage));

  return (
    <>
      <div className="content-widget">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <h2 className="spanborder h4">
                <span>{mostRecent.title}</span>
              </h2>
              {mostRecent.mainArticles.map((article) => (
                <article key={article.id} className="row justify-content-between mb-5 mr-0">
                  <div className="col-md-9">
                    <div className="align-self-center">
                      {article.tag && <div className="capsSubtle mb-2">{article.tag}</div>}
                      <h3 className="entry-title mb-3">
                        <a href="#" onClick={(e) => handleClick(e, article.id)}>{article.title}</a>
                      </h3>
                      <div className="entry-excerpt">
                        <p>{article.excerpt}</p>
                      </div>
                      <div className="entry-meta align-items-center">
                        <span>{article.author}</span> in <span>{article.category}</span>
                        <br />
                        <span>{article.date}</span>
                        <span className="middotDivider" />
                        <span className="readingTime" title={article.readTime}>
                          {article.readTime}
                        </span>
                        <span className="svgIcon svgIcon--star">
                          <svg className="svgIcon-use" width={15} height={15}>
                            <path d="M7.438 2.324c.034-.099.09-.099.123 0l1.2 3.53a.29.29 0 0 0 .26.19h3.884c.11 0 .127.049.038.111L9.8 8.327a.271.271 0 0 0-.099.291l1.2 3.53c.034.1-.011.131-.098.069l-3.142-2.18a.303.303 0 0 0-.32 0l-3.145 2.182c-.087.06-.132.03-.099-.068l1.2-3.53a.271.271 0 0 0-.098-.292L2.056 6.146c-.087-.06-.071-.112.038-.112h3.884a.29.29 0 0 0 .26-.19l1.2-3.52z" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-md-3 bgcover"
                    style={{
                      backgroundImage: article.image ? `url(${article.image})` : undefined,
                    }}
                  />
                </article>
              ))}
              <div className="row justify-content-between">
                <div className="divider-2" />
                <div className="row">
                  {currentSideArticles.map((article) => (
                    <article key={article.id} className="col-md-6 mb-4">
                      <div className="mb-3 d-flex row">
                        <figure className="col-md-5">
                          <a href="#" onClick={(e) => handleClick(e, article.id)}>
                            <Image
                              className="lazy"
                              src={article.image || ''}
                              alt={article.title}
                              width={190}
                              height={166}
                              unoptimized={article.image?.startsWith('http')}
                            />
                          </a>
                        </figure>
                        <div className="entry-content col-md-7 pl-md-0">
                          <h5 className="entry-title mb-3">
                            <a href="#" onClick={(e) => handleClick(e, article.id)}>{article.title}</a>
                          </h5>
                          <div className="entry-meta align-items-center">
                            <span>{article.author}</span> in <span>{article.category}</span>
                            <br />
                            <span>{article.date}</span>
                            <span className="middotDivider" />
                            <span className="readingTime" title={article.readTime}>
                              {article.readTime}
                            </span>
                            <span className="svgIcon svgIcon--star">
                              <svg className="svgIcon-use" width={15} height={15}>
                                <path d="M7.438 2.324c.034-.099.09-.099.123 0l1.2 3.53a.29.29 0 0 0 .26.19h3.884c.11 0 .127.049.038.111L9.8 8.327a.271.271 0 0 0-.099.291l1.2 3.53c.034.1-.011.131-.098.069l-3.142-2.18a.303.303 0 0 0-.32 0l-3.145 2.182c-.087.06-.132.03-.099-.068l1.2-3.53a.271.271 0 0 0-.098-.292L2.056 6.146c-.087-.06-.071-.112.038-.112h3.884a.29.29 0 0 0 .26-.19l1.2-3.52z" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                <div className="col-12">
                  <Pagination
                    currentPage={currentSidePage}
                    totalPages={totalSidePages}
                    onPageChange={setCurrentSidePage}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-4 pl-md-5 sticky-sidebar">
              <div className="sidebar-widget latest-tpl-4">
                <h4 className="spanborder">
                  <span>{mostRecent.popular.title}</span>
                </h4>
                <ol>
                  {mostRecent.popular.articles.map((article) => (
                    <li key={article.id} className="d-flex">
                      <div className="post-count">{article.number}</div>
                      <div className="post-content">
                        <h5 className="entry-title mb-3">
                          <a href="#" onClick={(e) => handleClick(e, article.id)}>{article.title}</a>
                        </h5>
                        <div className="entry-meta align-items-center">
                          <span>{article.author}</span> in <span>{article.category}</span>
                          <br />
                          <span>{article.date}</span>
                          <span className="middotDivider" />
                          <span className="readingTime" title={article.readTime}>
                            {article.readTime}
                          </span>
                          <span className="svgIcon svgIcon--star">
                            <svg className="svgIcon-use" width={15} height={15}>
                              <path d="M7.438 2.324c.034-.099.09-.099.123 0l1.2 3.53a.29.29 0 0 0 .26.19h3.884c.11 0 .127.049.038.111L9.8 8.327a.271.271 0 0 0-.099.291l1.2 3.53c.034.1-.011.131-.098.069l-3.142-2.18a.303.303 0 0 0-.32 0l-3.145 2.182c-.087.06-.132.03-.099-.068l1.2-3.53a.271.271 0 0 0-.098-.292L2.056 6.146c-.087-.06-.071-.112.038-.112h3.884a.29.29 0 0 0 .26-.19l1.2-3.52z" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
          {mostRecent.ad && (
            <>
              <div className="content-widget">
                <div className="container">
                  <div className="sidebar-widget ads">
                    <a href={mostRecent.ad.link}>
                      <Image
                        src={mostRecent.ad.image}
                        alt="ads"
                        width={600}
                        height={71}
                        unoptimized
                      />
                    </a>
                  </div>
                  <div className="hr" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
