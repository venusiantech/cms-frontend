'use client';

import Link from 'next/link';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '/#about',        label: 'About'        },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/#pricing',      label: 'Pricing'      },
  { href: '/#faq',          label: 'FAQ'           },
  { href: '/#contact',      label: 'Contact'      },
];

interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface LegalLayoutProps {
  title: string;
  effectiveDate: string;
  lastUpdated: string;
  intro: React.ReactNode;
  sections: Section[];
}

export default function LegalLayout({ title, effectiveDate, lastUpdated, intro, sections }: LegalLayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[rgb(17,17,19)] text-white">
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <header className="fixed top-0 right-0 left-0 z-50 backdrop-blur-md">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <img src="/logo/fastofy.png" alt="Fastofy Logo" className="w-18 h-20" />
              <span className="text-2xl tracking-tight">
                <span className="text-white">FASTOFY</span>
              </span>
            </Link>
            <div className="hidden items-center gap-8 md:flex">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="font-medium text-[rgb(218,218,218)] transition-colors duration-200 hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="hidden md:block">
              <Link href="/dashboard">
                <button className="rounded-xl bg-[rgb(218,255,1)] px-6 py-3 font-semibold text-[rgb(17,17,19)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[rgb(166,190,21)] hover:shadow-lg hover:shadow-[rgba(218,255,1,0.3)]">
                  Dashboard
                </button>
              </Link>
            </div>
            <button className="p-2 text-white md:hidden" onClick={() => setIsMobileOpen((p) => !p)} aria-label="Toggle navigation">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16"/><path d="M4 18h16"/><path d="M4 6h16"/></svg>
            </button>
          </div>
          {isMobileOpen && (
            <div className="mt-4 flex flex-col gap-4 md:hidden">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setIsMobileOpen(false)} className="font-medium text-[rgb(218,218,218)] hover:text-white">
                  {link.label}
                </Link>
              ))}
              <Link href="/dashboard">
                <button className="mt-2 w-full rounded-xl bg-[rgb(218,255,1)] px-6 py-3 font-semibold text-[rgb(17,17,19)]">Dashboard</button>
              </Link>
            </div>
          )}
        </nav>
      </header>

      {/* ── Hero banner ────────────────────────────────────────── */}
      <div className="pt-32 pb-12 bg-[rgb(26,28,30)] border-b border-white/5">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex items-center gap-2 text-sm text-[rgb(161,161,170)] mb-4">
            <Link href="/" className="hover:text-[rgb(218,255,1)] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[rgb(218,218,218)]">{title}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          <div className="flex flex-wrap gap-6 text-sm text-[rgb(161,161,170)]">
            <span>
              <span className="text-[rgb(218,255,1)] font-medium">Effective Date:</span> {effectiveDate}
            </span>
            <span>
              <span className="text-[rgb(218,255,1)] font-medium">Last Updated:</span> {lastUpdated}
            </span>
          </div>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────── */}
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12">

          {/* Sidebar TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-32">
              <p className="text-xs font-semibold text-[rgb(161,161,170)] uppercase tracking-widest mb-4">On this page</p>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block text-sm text-[rgb(161,161,170)] hover:text-[rgb(218,255,1)] transition-colors py-1 border-l-2 border-transparent hover:border-[rgb(218,255,1)] pl-3"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <article className="space-y-12">
            {/* Intro */}
            <div className="rounded-2xl border border-[rgba(218,255,1,0.2)] bg-[rgba(218,255,1,0.05)] p-6 text-[rgb(218,218,218)] leading-relaxed">
              {intro}
            </div>

            {/* Sections */}
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-32">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-1 h-6 bg-[rgb(218,255,1)] rounded-full inline-block flex-shrink-0" />
                  {section.title}
                </h2>
                <div className="text-[rgb(218,218,218)] leading-relaxed space-y-3">
                  {section.content}
                </div>
              </section>
            ))}
          </article>
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-[rgba(255,255,255,0.1)] bg-[rgb(26,28,30)]">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center">
                <img src="/logo/fastofy.png" alt="Fastofy Logo" className="w-18 h-20" />
                <span className="text-2xl tracking-tight text-white">FASTOFY</span>
              </div>
              <p className="text-sm text-[rgb(161,161,170)] mt-1">Operated by Venusian LLC, UAE</p>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[rgb(161,161,170)]">
              <Link href="/privacy-policy" className="hover:text-[rgb(218,255,1)] transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-[rgb(218,255,1)] transition-colors">Terms of Service</Link>
              <Link href="/refund-policy" className="hover:text-[rgb(218,255,1)] transition-colors">Refund Policy</Link>
              <Link href="/gdpr" className="hover:text-[rgb(218,255,1)] transition-colors">GDPR</Link>
              <Link href="/cookie-policy" className="hover:text-[rgb(218,255,1)] transition-colors">Cookie Policy</Link>
              <Link href="/affiliate-disclosure" className="hover:text-[rgb(218,255,1)] transition-colors">Affiliate Disclosure</Link>
              <Link href="/dpa" className="hover:text-[rgb(218,255,1)] transition-colors">DPA</Link>
              <a href="mailto:app@fastofy.com" className="hover:text-[rgb(218,255,1)] transition-colors">app@fastofy.com</a>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.08)]">
            <p className="text-sm text-[rgb(161,161,170)] text-center">© {new Date().getFullYear()} FASTOFY.com. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
