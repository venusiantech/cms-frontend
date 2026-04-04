'use client';

import React, { Fragment } from 'react';
import { HiArrowLeft } from 'react-icons/hi';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
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

// ─── Markdown renderer helpers ───────────────────────────────────────────────

function linkifyText(text: string): (string | JSX.Element)[] {
  const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match;

  while ((match = mdLinkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.substring(lastIndex, match.index));
    parts.push(
      <a key={match.index} href={match[2]} target="_blank" rel="noopener noreferrer">
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) parts.push(text.substring(lastIndex));

  if (parts.length === 0) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) =>
      urlRegex.test(part)
        ? <a key={i} href={part} target="_blank" rel="noopener noreferrer">{part}</a>
        : part
    );
  }

  return parts;
}

function parseTableRow(line: string): string[] {
  const cells = line.split('|').map((s) => s.trim());
  if (cells[0] === '') cells.shift();
  if (cells[cells.length - 1] === '') cells.pop();
  return cells;
}

function isTableSeparatorRow(cells: string[]): boolean {
  return cells.length > 0 && cells.every((c) => /^[-:\s]+$/.test(c));
}

function formatCellContent(text: string, keyPrefix: string): (string | JSX.Element)[] {
  return text.split(/(\*\*[^*]+\*\*)/g).flatMap((part, i) =>
    part.match(/^\*\*.*\*\*$/)
      ? [<strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>]
      : [<Fragment key={`${keyPrefix}-${i}`}>{linkifyText(part)}</Fragment>]
  );
}

/** Inline formatting: bold, italic, inline code */
function formatInline(text: string, keyPrefix: string): (string | JSX.Element)[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.flatMap((part, i) => {
    if (part.match(/^\*\*.*\*\*$/)) return [<strong key={`${keyPrefix}-b-${i}`}>{part.slice(2, -2)}</strong>];
    if (part.match(/^\*.*\*$/))     return [<em key={`${keyPrefix}-i-${i}`}>{part.slice(1, -1)}</em>];
    if (part.match(/^`.*`$/))       return [<code key={`${keyPrefix}-c-${i}`}>{part.slice(1, -1)}</code>];
    return linkifyText(part).map((p, j) =>
      typeof p === 'string' ? p : <Fragment key={`${keyPrefix}-l-${i}-${j}`}>{p}</Fragment>
    );
  });
}

function renderMarkdownContent(content: string, articleTitle: string, onSubscribe?: () => void) {
  const clean = content.replace(/```markdown\n?/g, '').replace(/```\n?/g, '').trim();
  const lines = clean.split('\n');

  // Skip duplicate H1 title at the top
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

  const result: (JSX.Element | null)[] = [];
  let keyIdx = 0;
  const slice = lines.slice(startIndex);

  for (let i = 0; i < slice.length; i++) {
    const line = slice[i];


    if (line.trim() === '```' || line.trim() === '```markdown') continue;
    if (line.trim() === '') {
      result.push(<div key={keyIdx++} className="h-3" />);
      continue;
    }

    // Tables
    if (line.trim().startsWith('|')) {
      const tableRows: string[][] = [];
      let j = i;
      while (j < slice.length && slice[j].trim().startsWith('|')) {
        tableRows.push(parseTableRow(slice[j]));
        j++;
      }
      if (tableRows.length >= 1) {
        const isSep = tableRows.length > 1 && isTableSeparatorRow(tableRows[1]);
        const headerRow = tableRows[0];
        const bodyRows = isSep ? tableRows.slice(2) : tableRows.slice(1);
        result.push(
          <div key={keyIdx++} className="mt-4 mb-2 overflow-x-auto">
            <table className="table table-bordered w-full border-collapse">
              <thead>
                <tr className="bg-[#f8f9fa]">
                  {headerRow.map((cell, c) => (
                    <th key={c} className="border border-[#dee2e6] px-3 py-2 text-left">
                      {formatCellContent(cell, `th-${keyIdx}-${c}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, r) => (
                  <tr key={r} className={r % 2 === 0 ? 'bg-white' : 'bg-[#f8f9fa]'}>
                    {row.map((cell, c) => (
                      <td key={c} className="border border-[#dee2e6] px-3 py-2">
                        {formatCellContent(cell, `td-${keyIdx}-${r}-${c}`)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        i = j - 1;
        continue;
      }
    }

    // Headings
    if (line.startsWith('# '))      { result.push(<h1 key={keyIdx++} className="mb-4 mt-4">{formatInline(line.substring(2), `h1-${keyIdx}`)}</h1>); continue; }
    if (line.startsWith('## '))     { result.push(<h2 key={keyIdx++} className="mb-3 mt-4">{formatInline(line.substring(3), `h2-${keyIdx}`)}</h2>); continue; }
    if (line.startsWith('### '))    { result.push(<h3 key={keyIdx++} className="mb-2 mt-3">{formatInline(line.substring(4), `h3-${keyIdx}`)}</h3>); continue; }
    if (line.startsWith('#### '))   { result.push(<h4 key={keyIdx++} className="mb-2 mt-3">{formatInline(line.substring(5), `h4-${keyIdx}`)}</h4>); continue; }

    // Blockquote
    if (line.startsWith('> ')) {
      result.push(<blockquote key={keyIdx++}><p>{formatInline(line.substring(2), `bq-${keyIdx}`)}</p></blockquote>);
      continue;
    }

    // Horizontal rule
    if (/^[-*_]{3,}\s*$/.test(line.trim())) {
      result.push(<hr key={keyIdx++} className="section-divider" />);
      continue;
    }

    // Unordered list
    if (line.startsWith('- ') || line.startsWith('* ')) {
      result.push(<li key={keyIdx++} className="ml-4 mb-2 text-justify list-disc">{formatInline(line.substring(2), `ul-${keyIdx}`)}</li>);
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      result.push(<li key={keyIdx++} className="ml-4 mb-2 list-decimal text-justify">{formatInline(line.replace(/^\d+\.\s/, ''), `ol-${keyIdx}`)}</li>);
      continue;
    }

    // Paragraph
    result.push(<p key={keyIdx++} className="mb-4 text-justify">{formatInline(line, `p-${keyIdx}`)}</p>);
  }

  return result.filter(Boolean);
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Section1({
  article,
  relatedArticles,
  onBack,
  onArticleClick,
  assetsPath = '/templateA/assets',
}: SingleSection1Props) {
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
        {/* ── Back button ────────────────────────────────── */}
        <a
          href="/"
          className="inline-block no-underline mb-4"
          onClick={(e) => { e.preventDefault(); onBack(); }}
        >
          <div className="flex items-center">
            <HiArrowLeft className="mr-1.5 align-middle" />
            <span>Back</span>
          </div>
        </a>

        {/* ── Article header ─────────────────────────────── */}
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
              <span className="readingTime" title={article.readTime}>{article.readTime}</span>
              <span className="svgIcon svgIcon--star">
                <svg className="svgIcon-use" width={15} height={15}>
                  <path d="M7.438 2.324c.034-.099.09-.099.123 0l1.2 3.53a.29.29 0 0 0 .26.19h3.884c.11 0 .127.049.038.111L9.8 8.327a.271.271 0 0 0-.099.291l1.2 3.53c.034.1-.011.131-.098.069l-3.142-2.18a.303.303 0 0 0-.32 0l-3.145 2.182c-.087.06-.132.03-.099-.068l1.2-3.53a.271.271 0 0 0-.098-.292L2.056 6.146c-.087-.06-.071-.112.038-.112h3.884a.29.29 0 0 0 .26-.19l1.2-3.52z" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        {/* ── Featured image ─────────────────────────────── */}
        {article.image && (
          <figure className="image zoom mb-5 featured-image">
            <Image
              className="lazy img-fluid responsive-image object-cover w-full"
              src={article.image}
              alt={article.title}
              width={1240}
              height={700}
              unoptimized={article.image.startsWith('http')}
            />
          </figure>
        )}

        {/* ── Article body ───────────────────────────────── */}
        <article className="entry-wraper mb-5">
          {/* Excerpt */}
          {article.excerpt && (
            <div className="excerpt mb-4">
              <p className="text-justify">{article.excerpt}</p>
            </div>
          )}

          {/* Main content (newsletter box is injected mid-article) */}
          <div className="entry-main-content dropcap text-justify">
            {bodyContent}
          </div>

          {/* Tags */}
          <div className="entry-bottom">
            <div className="tags-wrap heading">
              <span className="tags">
                <a href="#" rel="tag">{article.category}</a>
                <a href="#" rel="tag">{article.author}</a>
              </span>
            </div>
          </div>

          {/* Author box */}
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
                <p className="d-none d-md-block">
                  Written by {article.author}. Explore more articles on this site.
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* ── Related posts slider ───────────────────────── */}
        {relatedArticles.length > 0 && (
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
                              className="lazy object-cover h-[120px]"
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
                            <span className="svgIcon svgIcon--star">
                              <svg className="svgIcon-use" width={15} height={15}>
                                <path d="M7.438 2.324c.034-.099.09-.099.123 0l1.2 3.53a.29.29 0 0 0 .26.19h3.884c.11 0 .127.049.038.111L9.8 8.327a.271.271 0 0 0-.099.291l1.2 3.53c.034.1-.011.131-.098.069l-3.142-2.18a.303.303 0 0 0-.32 0l-3.145 2.182c-.087.06-.132.03-.099-.068l1.2-3.53a.271.271 0 0 0-.098-.292L2.056 6.146c-.087-.06-.071-.112.038-.112h3.884a.29.29 0 0 0 .26-.19l1.2-3.52z" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        )}

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
          .responsive-image { height: 700px; }
          .featured-image { max-height: 700px; }
        }
        :global(.swiper-container) { padding-bottom: 50px; }
        :global(.swiper-pagination) { bottom: 0; }
        :global(.swiper-button-prev),
        :global(.swiper-button-next) { color: var(--primary); }
      `}</style>
    </>
  );
}
