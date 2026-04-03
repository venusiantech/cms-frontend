"use client";
import Link from "next/link";
import { useState } from "react";
import Image from 'next/image';

interface HeaderProps {
  scroll?: boolean;
  siteName?: string;
  logoUrl?: string | null;
  logoDisplayMode?: string | null;
  assetsPath?: string;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  twitterUrl?: string | null;
  onContactClick?: () => void;
  navCategories?: { name: string; count: number }[];
  selectedCategory?: string | null;
  onCategoryChange?: (cat: string | null) => void;
}

export default function Header({ scroll, siteName = 'Site', logoUrl, logoDisplayMode = 'logo_only', assetsPath = '/templateA/assets', instagramUrl, facebookUrl, twitterUrl, onContactClick, navCategories = [], selectedCategory, onCategoryChange }: HeaderProps) {
  const [isSearch, setIsSearch] = useState<number | null>(null);

  const handleSearch = (key: number) => {
    setIsSearch((prevState) => (prevState === key ? null : key));
  };

  // Dark/Light
  const [isDark, setDark] = useState<boolean>(false);
  const handleDark = (): void => {
    setDark(!isDark);
    !isDark ? document.body.classList.add("dark-mode") : document.body.classList.remove("dark-mode");
  };
  return (
    <>
      <header id="header" className="d-lg-block d-none">
        <div className="container">
          <div className="align-items-center w-100">
            <h1 className="logo float-start navbar-brand">
              <Link href="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                {logoUrl && logoDisplayMode !== 'text_only' && (
                  <Image
                    src={logoUrl}
                    alt={siteName}
                    width={160}
                    height={50}
                    unoptimized
                    style={{ objectFit: 'contain', maxHeight: '50px', width: 'auto' }}
                  />
                )}
                {(logoDisplayMode === 'text_only' || logoDisplayMode === 'both' || !logoUrl) && (
                  <span>{siteName}</span>
                )}
              </Link>
            </h1>
            <div className="header-right float-end w-50">
              <div className="d-inline-flex float-end text-end align-items-center">
                <Link href="#" className="dark-light-toggle" onClick={handleDark}>
                  <i className="icon-adjust" />
                </Link>
                {(facebookUrl || instagramUrl || twitterUrl) && (
                  <ul className="social-network heading navbar-nav d-lg-flex align-items-center">
                    {facebookUrl && (
                      <li>
                        <a href={facebookUrl} target="_blank" rel="noopener noreferrer">
                          <i className="icon-facebook" />
                        </a>
                      </li>
                    )}
                    {instagramUrl && (
                      <li>
                        <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
                          <i className="icon-instagram" />
                        </a>
                      </li>
                    )}
                    {twitterUrl && (
                      <li>
                        <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
                          <i className="icon-twitter" />
                        </a>
                      </li>
                    )}
                  </ul>
                )}
                {onContactClick && (
                  <ul className="top-menu heading navbar-nav w-100 d-lg-flex align-items-center">
                    <li>
                      <a onClick={onContactClick} className="btn" style={{ background: 'none', border: 'none', padding: 0 }}>
                        Contact
                      </a>
                    </li>
                  </ul>
                )}

              </div>
              <form action="/search" method="get" className={`search-form d-lg-flex float-end ${isSearch == 1 ? "open-search" : ""}`}>
                <a href="#" className="searh-toggle" onClick={() => handleSearch(1)}>
                  <i className="icon-search" />
                </a>
                <input type="text" className="search_field" placeholder="Search..." name="q" />
              </form>
            </div>
          </div>
          <div className="clearfix" />
        </div>
        <nav id="main-menu" className={`stick d-lg-block d-none ${scroll ? "scroll-to-fixed-fixed top-0 position-fixed w-100" : ""}`}>
          <div className="container">
            <div className="menu-primary">
              <ul className="d-flex justify-content-center mr-auto" style={{ gap: '2rem' }}>
                {/* Home — clicking when a category is active resets to "All" */}
                <li className={!selectedCategory ? 'current-menu-item' : ''}>
                  <Link
                    href="/"
                    onClick={(e) => {
                      if (onCategoryChange) {
                        e.preventDefault();
                        onCategoryChange(null);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                  >
                    Latest
                  </Link>
                </li>

                {/* Up to 4 real category links */}
                {navCategories.slice(0, 4).map((cat) => (
                  <li key={cat.name} className={selectedCategory === cat.name ? 'current-menu-item' : ''}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (onCategoryChange) onCategoryChange(cat.name);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {cat.name}
                    </a>
                  </li>
                ))}

                {/* "More" link to full categories page when there are >4 categories */}
                {navCategories.length > 4 && (
                  <li>
                    <Link href="/categories">More…</Link>
                  </li>
                )}

                {/* Fallback "Categories" link when no CMS categories exist yet */}
                {navCategories.length === 0 && (
                  <li>
                    <Link href="/categories">Categories</Link>
                  </li>
                )}
              </ul>
              <span />
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
