'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import type { TemplateAFeatured, TemplateATrending } from '@/templates/templateA/types';

interface Section1Props {
  featured: TemplateAFeatured;
  trending: TemplateATrending;
  onArticleClick: (id: string) => void;
  selectedCategory?: string | null;
}

const sectionVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.2, ease: 'easeIn' as const } },
};

const titleVariants = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0,  transition: { duration: 0.3, ease: 'easeOut' as const } },
  exit:    { opacity: 0, x: 10,  transition: { duration: 0.15, ease: 'easeIn' as const } },
};

export default function Section1({ featured, trending, onArticleClick, selectedCategory }: Section1Props) {
  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    onArticleClick(id);
  };

  // Unique key drives AnimatePresence to animate when category changes
  const contentKey = selectedCategory ?? '__all__';

  return (
    <>
      <div className="section-featured featured-style-1 mb-5">
        <div className="container">
          <div className="row">
            <div className="col-sm-12 col-md-9 col-xl-9">

              {/* Animated section title */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.h2
                  key={`title-${contentKey}`}
                  className="spanborder h4"
                  variants={titleVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <span>{featured.title}</span>
                </motion.h2>
              </AnimatePresence>

              {/* Animated blog content */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`content-${contentKey}`}
                  className="row"
                  variants={sectionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <div className="col-sm-12 col-md-6">
                    <article className="first mb-3">
                      <figure>
                        <a href="#" onClick={(e) => handleClick(e, featured.mainArticle.id)}>
                          <Image
                            className="lazy"
                            src={featured.mainArticle.image || ''}
                            alt={featured.mainArticle.title}
                            width={404}
                            height={227}
                            unoptimized={featured.mainArticle.image?.startsWith('http')}
                          />
                        </a>
                      </figure>
                      <h3
                        className="entry-title mb-3 cursor-pointer"
                        onClick={(e) => handleClick(e, featured.mainArticle.id)}
                      >
                        {featured.mainArticle.title}
                      </h3>
                      <div className="entry-excerpt">
                        <p className="text-justify">{featured.mainArticle.excerpt}</p>
                      </div>
                      <div className="entry-meta align-items-center">
                        <span>{featured.mainArticle.author}</span> in <span>{featured.mainArticle.category}</span>
                        <br />
                        <span>{featured.mainArticle.date}</span>
                        <span className="middotDivider" />
                        <span className="readingTime" title={featured.mainArticle.readTime}>
                          {featured.mainArticle.readTime}
                        </span>
                        <span className="svgIcon svgIcon--star">
                          <svg className="svgIcon-use" width={15} height={15}>
                            <path d="M7.438 2.324c.034-.099.09-.099.123 0l1.2 3.53a.29.29 0 0 0 .26.19h3.884c.11 0 .127.049.038.111L9.8 8.327a.271.271 0 0 0-.099.291l1.2 3.53c.034.1-.011.131-.098.069l-3.142-2.18a.303.303 0 0 0-.32 0l-3.145 2.182c-.087.06-.132.03-.099-.068l1.2-3.53a.271.271 0 0 0-.098-.292L2.056 6.146c-.087-.06-.071-.112.038-.112h3.884a.29.29 0 0 0 .26-.19l1.2-3.52z" />
                          </svg>
                        </span>
                      </div>
                    </article>
                    <a className="btn btn-green d-inline-block mb-4 mb-md-0" href="#">
                      {selectedCategory ? `All ${selectedCategory}` : 'All Featured'}
                    </a>
                  </div>
                  <div className="col-sm-12 col-md-6">
                    {featured.sideArticles.map((article) => (
                      <article key={article.id}>
                        <div className="mb-3 d-flex row">
                          <figure className="col-4 col-md-4">
                            <a href="#" onClick={(e) => handleClick(e, article.id)}>
                              <Image
                                className="lazy"
                                src={article.image || ''}
                                alt={article.title}
                                width={190}
                                height={165}
                                unoptimized={article.image?.startsWith('http')}
                              />
                            </a>
                          </figure>
                          <div className="entry-content col-8 col-md-8 pl-md-0">
                            {article.tag && (
                              <div className="capsSubtle mb-2">{article.tag}</div>
                            )}
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
                </motion.div>
              </AnimatePresence>

            </div>
            <div className="col-sm-12 col-md-3 col-xl-3">
              <div className="sidebar-widget latest-tpl-4">
                <h4 className="spanborder">
                  <span>{trending.title}</span>
                </h4>
                <ol>
                  {trending.articles.map((article) => (
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
                <a className="link-green" href="#">
                  See all trending
                  <svg className="svgIcon-use" width={19} height={19}>
                    <path d="M7.6 5.138L12.03 9.5 7.6 13.862l-.554-.554L10.854 9.5 7.046 5.692" fillRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
