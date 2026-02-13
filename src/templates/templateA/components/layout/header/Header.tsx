"use client";
import Link from "next/link";
import { useState } from "react";
import Image from 'next/image';

interface HeaderProps {
  scroll?: boolean;
  siteName?: string;
  assetsPath?: string;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  twitterUrl?: string | null;
}

export default function Header({ scroll, siteName = 'Site', assetsPath = '/templateA/assets', instagramUrl, facebookUrl, twitterUrl }: HeaderProps) {
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
      <header id="header" className="d-lg-block d-none py-4">
        <div className="container">
          <div className="align-items-center w-100">
            <h1 className="logo float-start navbar-brand">
              <Link href="/" className="logo">
                {siteName}
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
                <ul className="top-menu heading navbar-nav w-100 d-lg-flex align-items-center">
                  <li>
                    <a href="/contact" className="btn">
                      Contact
                    </a>
                  </li>
                </ul>

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
        {/* <nav id="main-menu" className={`stick d-lg-block d-none ${scroll ? "scroll-to-fixed-fixed top-0 position-fixed w-100" : ""}`}>
          <div className="container">
            <div className="menu-primary">
              <ul className="d-flex justify-content-between">
                <li className="current-menu-item">
                  <Link href="/">Home</Link>
                </li>
                <li className="menu-item-has-children">
                  <Link href="/categories">Categories</Link>
                  <ul className="sub-menu">
                    <li>
                      <Link href="/categories">Politics</Link>
                    </li>
                    <li>
                      <Link href="/archive">Health</Link>
                    </li>
                    <li>
                      <Link href="/categories">Design</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link href="/typography">Typography</Link>
                </li>
                <li>
                  <Link href="/categories">Politics</Link>
                </li>
                <li>
                  <Link href="/categories">Health</Link>
                </li>
                <li>
                  <Link href="/categories">Design</Link>
                </li>
                <li>
                  <Link href="/categories">Startups</Link>
                </li>
                <li>
                  <Link href="/categories">Culture</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
                <li className="menu-item-has-children">
                  <Link href="#">More...</Link>
                  <ul className="sub-menu">
                    <li>
                      <Link href="/search">Search</Link>
                    </li>
                    <li>
                      <Link href="/author">Author</Link>
                    </li>
                    <li>
                      <Link href="/404">404</Link>
                    </li>
                  </ul>
                </li>
              </ul>
              <span />
            </div>
          </div>
        </nav> */}
      </header>
    </>
  );
}
