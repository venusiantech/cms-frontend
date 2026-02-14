'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import Comments from './Comments';
import type { TemplateAArticle } from '@/templates/templateA/types';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface SingleSection1Props {
  article: TemplateAArticle & { content?: string };
  relatedArticles: TemplateAArticle[];
  onBack: () => void;
  onArticleClick: (id: string) => void;
  assetsPath?: string;
}

function renderMarkdownContent(content: string, articleTitle: string) {
  const clean = content.replace(/```markdown\n?/g, '').replace(/```\n?/g, '').trim();
  const lines = clean.split('\n');
  let startIndex = 0;
  if (lines[0]?.startsWith('# ')) {
    const firstH = lines[0].substring(2).trim();
    if (
      firstH.toLowerCase().includes(articleTitle.toLowerCase().substring(0, 20)) ||
      articleTitle.toLowerCase().includes(firstH.toLowerCase().substring(0, 20))
    ) {
      startIndex = 1;
    }
  }
  return lines.slice(startIndex).map((line, idx) => {
    if (line.trim() === '```' || line.trim() === '```markdown') return null;
    if (line.startsWith('# ')) {
      return <h1 key={idx} className="mb-4 mt-4">{line.substring(2)}</h1>;
    }
    if (line.startsWith('## ')) {
      return <h2 key={idx} className="mb-3 mt-4">{line.substring(3)}</h2>;
    }
    if (line.startsWith('### ')) {
      return <h3 key={idx} className="mb-2 mt-3">{line.substring(4)}</h3>;
    }
    if (line.startsWith('#### ')) {
      return <h4 key={idx} className="mb-2 mt-3">{line.substring(5)}</h4>;
    }
    if (line.trim() === '') {
      return <div key={idx} className="h-3" />;
    }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      return <li key={idx} className="ml-4 mb-2 text-justify" style={{ listStyle: 'disc' }}>{line.substring(2)}</li>;
    }
    if (line.startsWith('1. ') || /^\d+\.\s/.test(line)) {
      return <li key={idx} className="ml-4 mb-2 list-decimal text-justify">{line.replace(/^\d+\.\s/, '')}</li>;
    }
    return <p key={idx} className="mb-4 text-justify">{line}</p>;
  }).filter(Boolean);
}

export default function Section1({ article, relatedArticles, onBack, onArticleClick, assetsPath = '/templateA/assets' }: SingleSection1Props) {
  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    onArticleClick(id);
  };

  const bodyContent = article.content
    ? renderMarkdownContent(article.content, article.title)
    : article.excerpt
      ? [<p key="excerpt" className="mb-4">{article.excerpt}</p>]
      : [];

  return (
    <>
      <div className="container">
        <Link href="/" className="btn btn-green mb-4" style={{ display: 'inline-block', textDecoration: 'none' }}>
          ← Back to Home
        </Link>
        <div className="entry-header">
          <div className="mb-5">
            <h1 className="entry-title m_b_2rem">{article.title}</h1>
            <div className="entry-meta align-items-center">
              <span className="author-avatar d-inline-block me-2">
                <Image
                  src={`${assetsPath}/images/author-avata-2.jpg`}
                  alt="author avatar"
                  width={50}
                  height={50}
                  unoptimized
                />
              </span>
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
        {article.image && (
          <figure className="image zoom mb-5 featured-image">
            <Image
              className="lazy img-fluid responsive-image"
              src={article.image}
              alt={article.title}
              width={1240}
              height={700}
              unoptimized={article.image.startsWith('http')}
              style={{ maxHeight: 400, objectFit: 'cover' }}
            />
          </figure>
        )}
        <article className="entry-wraper mb-5">
          <div className="entry-left-col">
            <div className="social-sticky">
              <a href="#"><i className="icon-facebook" /></a>
              <a href="#"><i className="icon-heart" /></a>
              <a href="#"><i className="icon-paper-plane" /></a>
            </div>
          </div>
          {article.excerpt && (
            <div className="excerpt mb-4">
              <p className="text-justify">{article.excerpt}</p>
            </div>
          )}
          <div className="entry-main-content dropcap text-justify">
            {bodyContent}
          </div>
          <div className="entry-bottom">
            <div className="tags-wrap heading">
              <span className="tags">
                <a href="#" rel="tag">Article</a>
              </span>
            </div>
          </div>
          <div className="box box-author m_b_2rem">
            <div className="post-author row-flex">
              <div className="author-img">
                <Image
                  alt="author avatar"
                  src={`${assetsPath}/images/author-avata-1.jpg`}
                  className="avatar"
                  width={120}
                  height={120}
                  unoptimized
                />
              </div>
              <div className="author-content">
                <div className="top-author">
                  <h5 className="heading-font">{article.author}</h5>
                </div>
                <p className="d-none d-md-block">Author bio.</p>
              </div>
            </div>
          </div>
        </article>
        {/* {relatedArticles.length > 0 && (
          <div className="related-posts mb-5">
            <h4 className="spanborder text-center">
              <span>Related Posts</span>
            </h4>
            <div className="swiper-container">
              <Swiper
                modules={[Autoplay, Navigation, Pagination]}
                spaceBetween={30}
                slidesPerView={3}
                navigation={false}
                pagination={{ clickable: true }}
                loop={relatedArticles.length >= 3}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                breakpoints={{
                  320: { slidesPerView: 1, spaceBetween: 20 },
                  640: { slidesPerView: 2, spaceBetween: 20 },
                  768: { slidesPerView: 3, spaceBetween: 30 },
                }}
                className="related-posts-slider"
              >
                {relatedArticles.map((post) => (
                  <SwiperSlide key={post.id}>
                    <article className="col-12">
                      <div className="mb-3 d-flex row">
                        <figure className="col-md-5">
                          <a href="#" onClick={(e) => handleClick(e, post.id)}>
                            <Image
                              className="lazy"
                              src={post.image || ''}
                              alt={post.title}
                              width={180}
                              height={180}
                              unoptimized={post.image?.startsWith('http')}
                            />
                          </a>
                        </figure>
                        <div className="entry-content col-md-7 pl-md-0">
                          <h5 className="entry-title mb-3">
                            <a href="#" onClick={(e) => handleClick(e, post.id)}>{post.title}</a>
                          </h5>
                          <div className="entry-meta align-items-center">
                            <span>{post.author}</span> in <span>{post.category}</span>
                            <br />
                            <span>{post.date}</span>
                            <span className="middotDivider" />
                            <span className="readingTime" title={post.readTime}>{post.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        )} */}
        {/* <Comments /> */}
      </div>
      <style jsx>{`
        .responsive-image {
          height: 400px;
          object-fit: cover;
        }
        .featured-image {
          max-height: 400px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        @media (min-width: 768px) {
          .responsive-image {
            height: 700px;
          }
          .featured-image {
            max-height: 700px;
          }
        }
        :global(.swiper-container) {
          padding-bottom: 50px;
        }
        :global(.swiper-pagination) {
          bottom: 0;
        }
      `}</style>
    </>
  );
}
