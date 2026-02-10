"use client";
import { useEffect, useState } from "react";
import BackToTop from "../elements/BackToTop";
import Footer from "./footer/Footer";
import Header from "./header/Header";
import MobileMenu from "./MobileMenu";


interface LayoutProps {
  children?: React.ReactNode;
  classLisst?: string;
  siteName?: string;
  assetsPath?: string;
}

export default function Layout({ classLisst, children, siteName = 'Site', assetsPath = '/templateA/assets' }: LayoutProps) {
  const [scroll, setScroll] = useState<boolean>(false);
  // Mobile Menu
  const [isMobileMenu, setMobileMenu] = useState<boolean>(false);
  const handleMobileMenu = (): void => {
    setMobileMenu(!isMobileMenu);
    !isMobileMenu ? document.body.classList.add("mobile-menu-active") : document.body.classList.remove("mobile-menu-active");
  };

  useEffect(() => {
    const handleScroll = (): void => {
      const scrollCheck: boolean = window.scrollY > 100;
      if (scrollCheck !== scroll) {
        setScroll(scrollCheck);
      }
    };

    document.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [scroll]);

  return (
    <>
      <div className={classLisst}>
        <MobileMenu isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} siteName={siteName} assetsPath={assetsPath} />
        <div id="wrapper">
          <Header scroll={scroll} siteName={siteName} assetsPath={assetsPath} />

          <main id="content">
            {children}
          </main>

          <Footer siteName={siteName} />

          <BackToTop />
        </div>
      </div>
    </>
  );
}
