"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from 'next/image';

interface MobileMenuProps {
  isMobileMenu: boolean;
  handleMobileMenu: () => void;
  siteName?: string;
  assetsPath?: string;
}

export default function MobileMenu({ isMobileMenu, handleMobileMenu, siteName = 'Site', assetsPath = '/templateA/assets' }: MobileMenuProps) {
  const [isAccordion, setIsAccordion] = useState<number | null>(null);
  const pathname = usePathname();

  // Dark/Light
  const [isDark, setDark] = useState<boolean>(false);
  const handleDark = (): void => {
    setDark(!isDark);
    !isDark ? document.body.classList.add("dark-mode") : document.body.classList.remove("dark-mode");
  };

  const handleAccordion = (key: number) => {
    setIsAccordion((prevState) => (prevState === key ? null : key));
  };

  useEffect(() => {
    if (isMobileMenu) {
      handleMobileMenu();
    }
  }, [pathname]);

  return (
    <>
      {/*Mobile navigation*/}
      <div className="sticky-header fixed d-lg-none d-md-block">
        <div className="text-end">
          <div className="container mobile-menu-fixed pe-5">
            <h1 className="logo-small navbar-brand">
              <Link href="/" className="logo">
                {siteName.charAt(0)}
              </Link>
            </h1>
            <Link href="#" className="dark-light-toggle mt-05" onClick={handleDark}>
              <i className="icon-adjust" />
            </Link>
            <ul className="social-network heading navbar-nav d-lg-flex align-items-center">
              <li>
                <Link href="#">
                  <i className="icon-facebook" />
                </Link>
              </li>
              <li>
                <Link href="#">
                  <i className="icon-instagram" />
                </Link>
              </li>
            </ul>
            <Link href="#" className={`menu-toggle-icon ${isMobileMenu ? "act" : ""}`} onClick={handleMobileMenu}>
              <span className="lines" />
            </Link>
          </div>
        </div>
        <div className={`mobi-menu ${isMobileMenu ? "act" : ""}`}>
          <div className="mobi-menu__logo">
            <h1 className="logo navbar-brand">
              <Link href="/" className="logo">
                {siteName}
              </Link>
            </h1>
          </div>
          <form action="#" method="get" className="menu-search-form d-lg-flex">
            <input type="text" className="search_field" placeholder="Search..." defaultValue="" name="s" />
          </form>
          <nav>
            <ul>
              <li className="current-menu-item">
                <Link href="/">Home</Link>
              </li>
              <li className={`menu-item-has-children ${isAccordion == 1 ? "open-submenu" : ""}`}>
                <Link href="#" onClick={() => handleAccordion(1)}>
                  Categories
                </Link>
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
                <span className="sub-menu-toggle" onClick={() => handleAccordion(1)}></span>
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
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
