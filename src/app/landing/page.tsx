'use client';

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
    { id: "about", label: "About" },
    { id: "how-it-works", label: "How It Works" },
    { id: "pricing", label: "Pricing" },
    { id: "faq", label: "FAQ" },
    { id: "contact", label: "Contact" },
] as const;

const FAQ_ITEMS = [
    {
        question: "What exactly do I get for free?",
        answer:
            "You get a complete professional website for one domain including: custom design, AI-generated content (5-7 pages), SEO optimization, mobile responsiveness, SSL security, and 1 year of hosting - completely free. No credit card required to start.",
    },
    {
        question: "How long does it take to set up my website?",
        answer:
            "Most websites are ready in 5-10 minutes. Our AI analyzes your domain, generates relevant content, creates a professional design, and sets up hosting automatically. You can review and customize before going live.",
    },
    {
        question: "Do I need technical skills or coding knowledge?",
        answer:
            "Not at all! FASTOFY is designed for everyone. Just sign up with your email, add your domain name, and we handle everything else. No coding, no design skills, no technical knowledge needed.",
    },
    {
        question: "Can I customize my website after it's created?",
        answer:
            "Yes! You can edit content, change colors, upload images, and modify layouts through our easy-to-use dashboard. Make it truly yours with simple point-and-click customization.",
    },
    {
        question: "What happens after the first year of free hosting?",
        answer:
            "After your first year, you can continue with our affordable hosting plans starting at $9.99/month, or you can export your website and host it anywhere you like. You always own your content and design.",
    },
    {
        question: "Can I use FASTOFY for any type of website?",
        answer:
            "Yes! FASTOFY works great for business websites, portfolios, blogs, landing pages, personal websites, e-commerce showcases, and more. Our AI adapts the design and content to match your domain's purpose.",
    },
] as const;

// Reusable icon SVGs (Lucide-style, 28x28)
const ICON_GLOBE = (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe text-[rgb(218,255,1)]" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />
    </svg>
);
const ICON_TRENDING_UP = (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up text-[rgb(218,255,1)]" aria-hidden="true">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
    </svg>
);
const ICON_CHART = (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chart-column text-[rgb(218,255,1)]" aria-hidden="true">
        <path d="M3 3v16a2 2 0 0 0 2 2h16" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" />
    </svg>
);
const ICON_LINK = (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-link text-[rgb(218,255,1)]" aria-hidden="true">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
);
const ICON_SPARKLES = (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles text-[rgb(218,255,1)]" aria-hidden="true">
        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
        <path d="M20 3v4" /><path d="M22 5h-4" /><path d="M4 17v2" /><path d="M5 18H3" />
    </svg>
);
const ICON_ROCKET = (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rocket text-[rgb(218,255,1)]" aria-hidden="true">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
);
const ICON_COINS = (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-coins text-[rgb(218,255,1)]" aria-hidden="true">
        <circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18" /><path d="M7 6h1v4" /><path d="m16.71 13.88.7.71-2.82 2.82" />
    </svg>
);
const ICON_CALENDAR = (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar text-[rgb(218,255,1)]" aria-hidden="true">
        <path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" />
    </svg>
);
const ICON_DOLLAR = (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dollar-sign text-[rgb(218,255,1)]" aria-hidden="true">
        <line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
);
const ICON_ARROW_RIGHT = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right text-[rgb(218,255,1)]" aria-hidden="true">
        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
);

const ABOUT_CARDS = [
    { title: "Small Businesses", description: "Get your business online instantly with a professional website that showcases your products and services.", icon: ICON_GLOBE },
    { title: "Entrepreneurs & Freelancers", description: "Build your personal brand or launch your startup with a website that looks professional from day one.", icon: ICON_TRENDING_UP },
    { title: "Domain Owners", description: "Activate your unused domains with content-rich websites that build value and generate opportunities.", icon: ICON_CHART },
] as const;

const HOW_IT_WORKS_STEPS = [
    { step: 1, title: "Sign Up & Connect Domain", description: "Create your account and add your domain. Point your DNS and we'll handle the technical setup.", icon: ICON_LINK },
    { step: 2, title: "AI Designs Your Website", description: "Our AI analyzes your domain and creates a professional website with relevant, engaging content.", icon: ICON_SPARKLES },
    { step: 3, title: "Review & Customize", description: "Preview your website, make any adjustments, and customize it to match your vision.", icon: ICON_ROCKET },
    { step: 4, title: "Go Live Instantly", description: "Publish with one click. Your professional website is live and ready to attract visitors.", icon: ICON_COINS },
] as const;

const FEATURE_CARDS = [
    { title: "AI-Powered Design", description: "Get a professionally designed website tailored to your domain's purpose with beautiful layouts and modern styling.", icon: ICON_CALENDAR },
    { title: "One-Click Launch", description: "Launch your complete website with a single click. No complex setup, no technical hurdles - just instant deployment.", icon: ICON_ROCKET },
    { title: "Dynamic Content System", description: "Automatically generate high-quality content using high-traffic, relevant keywords. Scheduled updates keep search engines engaged, helping your website rank faster — all managed effortlessly.", icon: ICON_TRENDING_UP },
    { title: "Advanced OnPage SEO", description: "Every page includes optimized meta tags, keywords, headings, alt texts, and schema markup for maximum search visibility.", icon: ICON_TRENDING_UP },
    { title: "Smart Backlinking", description: "Automatic internal linking structure plus strategic external backlinks to boost domain authority and SEO performance.", icon: ICON_LINK },
    { title: "Customer Engagement", description: "Engage visitors instantly with a built-in live chat widget that answers questions in real time and turns browsers into customers. Capture leads effortlessly using customizable forms and high-converting popups.", icon: ICON_CHART },
    { title: "Ad Networks & Monetization", description: "Seamlessly integrate Amazon affiliate links and product showcases while leveraging pre-configured Google AdSense placements to generate additional passive income streams.", icon: ICON_DOLLAR },
    { title: "Traffic Analytics Dashboard", description: "Comprehensive analytics showing visitor behavior, traffic sources, popular pages, and conversion metrics in real-time.", icon: ICON_CHART },
    { title: "Mobile Responsive Design", description: "All websites automatically adapt to any screen size - desktop, tablet, and mobile for perfect viewing everywhere.", icon: ICON_GLOBE },
] as const;

export default function LandingPage() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    const handleNavClick = (sectionId: string) => (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
        e.preventDefault();
        const el = document.getElementById(sectionId);
        if (el) {
            const headerOffset = 80; // approximate fixed header height in px
            const rect = el.getBoundingClientRect();
            const scrollTop = window.scrollY || window.pageYOffset;
            const targetY = rect.top + scrollTop - headerOffset;
            window.scrollTo({ top: targetY, behavior: "smooth" });
        }
        setIsMobileOpen(false);
    };

    return (
        <div className="min-h-screen bg-[rgb(17,17,19)] text-white">
            <noscript>You need to enable JavaScript to run this app.</noscript>
            <div id="root">
                <div className="min-h-screen bg-[rgb(17,17,19)] text-white">
                    <header className="fixed top-0 right-0 left-0 z-50 backdrop-blur-md">
                        <nav className="container mx-auto px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <img
                                        src="/logo/fastofy.png"
                                        alt="Fastofy Logo"
                                        className="w-18 h-20"
                                    />
                                    <span className="text-2xl tracking-tight">
                                        <span className="text-white">FASTOFY</span>
                                    </span>
                                </div>
                                <div className="hidden items-center gap-8 md:flex">
                                    {NAV_LINKS.map((link) => (
                                        <a
                                            key={link.id}
                                            href={`#${link.id}`}
                                            onClick={handleNavClick(link.id)}
                                            className="font-medium text-[rgb(218,218,218)] transition-colors duration-200 hover:text-white"
                                        >
                                            {link.label}
                                        </a>
                                    ))}
                                </div>
                                <div className="hidden md:block">
                                    <Link href="/dashboard">
                                        <button className="rounded-xl bg-[rgb(218,255,1)] px-6 py-3 font-semibold text-[rgb(17,17,19)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[rgb(166,190,21)] hover:shadow-lg hover:shadow-[rgba(218,255,1,0.3)]">
                                            Dashboard
                                        </button>
                                    </Link>
                                </div>
                                <button
                                    className="p-2 text-white md:hidden"
                                    onClick={() => setIsMobileOpen((prev) => !prev)}
                                    aria-label="Toggle navigation"
                                    aria-expanded={isMobileOpen}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-menu" aria-hidden="true">
                                        <path d="M4 12h16"></path>
                                        <path d="M4 18h16"></path>
                                        <path d="M4 6h16"></path>
                                    </svg>
                                </button>
                            </div>
                            {/* Mobile nav menu */}
                            {isMobileOpen && (
                                <div className="mt-4 flex flex-col gap-4 md:hidden">
                                    {NAV_LINKS.map((link) => (
                                        <button
                                            key={link.id}
                                            type="button"
                                            onClick={handleNavClick(link.id)}
                                            className="text-left font-medium text-[rgb(218,218,218)] transition-colors duration-200 hover:text-white"
                                        >
                                            {link.label}
                                        </button>
                                    ))}
                                    <Link href="/dashboard">
                                        <button className="mt-2 w-full rounded-xl bg-[rgb(218,255,1)] px-6 py-3 font-semibold text-[rgb(17,17,19)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[rgb(166,190,21)] hover:shadow-lg hover:shadow-[rgba(218,255,1,0.3)]">
                                            Get Free Website
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </nav>
                    </header>
                    <section
                        aria-label="Notifications alt+T"
                        tabIndex={-1}
                        aria-live="polite"
                        aria-relevant="additions text"
                        aria-atomic="false"
                    ></section>
                    <section className="relative overflow-hidden py-32">
                        <div
                            className="absolute inset-0 z-0"
                            style={{
                                backgroundImage:
                                    'url("https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/9f/ae/ce/4c/86/v1_E10/E105QDD1.jpeg?w=800&cf_fit=scale-down&q=85&format=auto&s=b7eccccc7a000ac8f9008530b2210f69e21973da9acfae8d64c29ddb8a00a379")',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center center',
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-[rgb(17,17,19)]/95 via-[rgb(17,17,19)]/90 to-[rgb(17,17,19)]"></div>
                        </div>
                        <div className="relative z-10 container mx-auto px-6">
                            <div className="mx-auto max-w-4xl text-center">
                                {/* <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[rgba(218,255,1,0.3)] bg-[rgba(218,255,1,0.1)] px-4 py-2"><span className="text-sm font-semibold text-[rgb(218,255,1)]">🚀 New: AI-Powered Content Engine 2.0</span></div> */}
                                <h1 className="mt-12 mb-6 text-3xl leading-tight font-bold md:text-4xl lg:text-5xl">Launch Your Professional Website <span className="mt-2 block text-[rgb(218,255,1)]">In Minutes, Not Months</span></h1>
                                <p className="mx-auto mb-10 max-w-3xl text-md md:text-xl leading-relaxed text-[rgb(218,218,218)]">Own a domain? Instantly launch your free, AI-powered website—no coding needed.</p>
                                <div className="mb-12 grid grid-cols-2 gap-6 md:grid-cols-4">
                                    <div className="rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgb(26,28,30)] p-6 transition-all duration-300 hover:border-[rgb(218,255,1)]">
                                        <div className="mb-1 text-2xl md:text-3xl font-bold text-[rgb(218,255,1)]">50,000+</div>
                                        <div className="text-sm text-[rgb(161,161,170)]">Websites Launched</div>
                                    </div>
                                    <div className="rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgb(26,28,30)] p-6 transition-all duration-300 hover:border-[rgb(218,255,1)]">
                                        <div className="mb-1 text-2xl md:text-3xl font-bold text-[rgb(218,255,1)]">120+</div>
                                        <div className="text-sm text-[rgb(161,161,170)]">Countries Worldwide</div>
                                    </div>
                                    <div className="rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgb(26,28,30)] p-6 transition-all duration-300 hover:border-[rgb(218,255,1)]">
                                        <div className="mb-1 text-2xl md:text-3xl font-bold text-[rgb(218,255,1)]">99.9%</div>
                                        <div className="text-sm text-[rgb(161,161,170)]">Uptime Guarantee</div>
                                    </div>
                                    <div className="rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgb(26,28,30)] p-6 transition-all duration-300 hover:border-[rgb(218,255,1)]">
                                        <div className="mb-1 text-2xl md:text-3xl font-bold text-[rgb(218,255,1)]">10 Min</div>
                                        <div className="text-sm text-[rgb(161,161,170)]">Average Setup Time</div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                                    <Link href="/dashboard">
                                        <button className="group flex items-center gap-2 rounded-xl bg-[rgb(218,255,1)] px-8 py-4 text-lg font-semibold text-[rgb(17,17,19)] transition-all duration-200 hover:-translate-y-1 hover:bg-[rgb(166,190,21)] hover:shadow-xl hover:shadow-[rgba(218,255,1,0.3)]">
                                            Get Your Free Website<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-arrow-right transition-transform group-hover:translate-x-1" aria-hidden="true">
                                                <path d="M5 12h14"></path>
                                                <path d="m12 5 7 7-7 7"></path>
                                            </svg></button>
                                    </Link>
                                    {/* <button className="flex items-center gap-2 rounded-xl border-2 border-[rgb(63,63,63)] bg-transparent px-8 py-4 text-lg font-semibold text-white transition-all duration-200 hover:-translate-y-1 hover:border-[rgb(218,255,1)] hover:bg-[rgba(218,255,1,0.1)] hover:text-[rgb(218,255,1)]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-play" aria-hidden="true"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>Watch Demo
                                    </button> */}
                                </div>
                            </div>
                        </div>
                    </section>
                    <section id="about" className="bg-[rgb(26,28,30)] py-20">
                        <div className="container mx-auto px-6">
                            <div className="mb-16 max-w-6xl mx-auto text-center">
                                <h2 className="mb-4 text-4xl font-bold md:text-5xl">About</h2>
                                <p className="mb-8 text-lg leading-relaxed text-[rgb(218,218,218)]">FASTOFY turns any domain into a professional, SEO-ready website in minutes—powered by AI, zero tech skills needed, with built-in chat, leads, content, and monetization.</p>
                            </div>
                            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
                                {ABOUT_CARDS.map((card) => (
                                    <div key={card.title} className="rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgb(17,17,19)] p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[rgb(218,255,1)]">
                                        <div className="mb-4 flex items-center">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[rgba(218,255,1,0.1)] mr-4">
                                                {card.icon}
                                            </div>
                                            <h3 className="text-xl font-semibold">{card.title}</h3>
                                        </div>
                                        <p className="text-[rgb(161,161,170)]">{card.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                    <section id="how-it-works" className="py-20">
                        <div className="container mx-auto px-6">
                            <div className="mb-16 text-center">
                                <h2 className="mb-4 text-4xl font-bold md:text-5xl">How It Works</h2>
                                <p className="mx-auto max-w-2xl text-lg text-[rgb(218,218,218)]">From domain to live website in 4 simple steps</p>
                            </div>
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                                {HOW_IT_WORKS_STEPS.map((item, index) => (
                                    <div key={item.step} className="relative">
                                        <div className="h-full rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgb(26,28,30)] p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[rgb(218,255,1)]">
                                            <div className="absolute -top-4 -left-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[rgb(218,255,1)] text-xl font-bold text-[rgb(17,17,19)]">{item.step}</div>
                                            <div className="mt-4 mb-4 flex items-center gap-4">
                                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[rgba(218,255,1,0.1)]">
                                                    {item.icon}
                                                </div>
                                                <h3 className="text-md font-semibold">{item.title}</h3>
                                            </div>
                                            <p className="text-[rgb(161,161,170)]">{item.description}</p>
                                        </div>
                                        {index < HOW_IT_WORKS_STEPS.length - 1 && (
                                            <div className="absolute top-1/2 -right-4 hidden -translate-y-1/2 transform lg:block">
                                                {ICON_ARROW_RIGHT}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                    <section id="features" className="bg-[rgb(26,28,30)] py-20">
                        <div className="container mx-auto px-6">
                            <div className="mb-16 text-center">
                                <h2 className="mb-4 text-4xl font-bold md:text-5xl">Powerful Features</h2>
                                <p className="mx-auto max-w-2xl text-lg text-[rgb(218,218,218)]">Everything you need for a professional online presence</p>
                            </div>
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {FEATURE_CARDS.map((card) => (
                                    <div key={card.title} className="group relative overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgb(17,17,19)] p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[rgb(218,255,1)]">
                                        <div className="absolute top-0 right-0 left-0 h-0.5 bg-[rgb(218,255,1)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                        <div className="mb-4 flex items-center gap-4">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[rgba(218,255,1,0.1)]">
                                                {card.icon}
                                            </div>
                                            <h3 className="text-xl font-semibold">{card.title}</h3>
                                        </div>
                                        <p className="text-[rgb(161,161,170)]">{card.description}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-16 rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgb(17,17,19)] p-12">
                                <h3 className="mb-8 text-center text-2xl font-bold">Plus Many More Features</h3>
                                <div className="grid grid-cols-1 gap-6 text-center md:grid-cols-2 lg:grid-cols-4">
                                    <div>
                                        <div className="mb-2 text-lg font-bold text-[rgb(218,255,1)]">✓ SSL Security</div>
                                        <p className="text-sm text-[rgb(161,161,170)]">HTTPS encryption included</p>
                                    </div>
                                    <div>
                                        <div className="mb-2 text-lg font-bold text-[rgb(218,255,1)]">✓ Fast Loading</div>
                                        <p className="text-sm text-[rgb(161,161,170)]">Optimized for speed</p>
                                    </div>
                                    <div>
                                        <div className="mb-2 text-lg font-bold text-[rgb(218,255,1)]">✓ Auto Backups</div>
                                        <p className="text-sm text-[rgb(161,161,170)]">Daily automated backups</p>
                                    </div>
                                    <div>
                                        <div className="mb-2 text-lg font-bold text-[rgb(218,255,1)]">✓ 24/7 Uptime</div>
                                        <p className="text-sm text-[rgb(161,161,170)]">Reliable hosting</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* <section id="samples" className="py-20">
                        <div className="container mx-auto px-6">
                            <div className="mb-16 text-center">
                                <h2 className="mb-4 text-4xl font-bold md:text-5xl">Sample Success Stories</h2>
                                <p className="mx-auto max-w-2xl text-lg text-[rgb(218,218,218)]">Real domains powered by Fastofy.com generating real revenue</p>
                            </div>
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                                <div className="overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgb(26,28,30)] transition-all duration-300 hover:-translate-y-2 hover:border-[rgb(218,255,1)]">
                                    <div className="h-48 overflow-hidden"><img alt="techgadgetreviews.com" className="h-full w-full object-cover transition-transform duration-500 hover:scale-110" src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31" /></div>
                                    <div className="p-6">
                                        <div className="mb-2 flex items-center gap-2">
                                            <h3 className="text-lg font-semibold">techgadgetreviews.com</h3>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-external-link text-[rgb(218,255,1)]" aria-hidden="true">
                                                <path d="M15 3h6v6"></path>
                                                <path d="M10 14 21 3"></path>
                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                            </svg>
                                        </div>
                                        <p className="mb-4 text-sm text-[rgb(161,161,170)]">Technology</p>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm"><span className="text-[rgb(161,161,170)]">Monthly Visitors</span><span className="font-semibold text-white">45,000</span></div>
                                            <div className="flex justify-between text-sm"><span className="text-[rgb(161,161,170)]">Monthly Revenue</span><span className="font-semibold text-[rgb(218,255,1)]">$2,340</span></div>
                                            <div className="flex justify-between text-sm"><span className="text-[rgb(161,161,170)]">Content Posts</span><span className="font-semibold text-white">156</span></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgb(26,28,30)] transition-all duration-300 hover:-translate-y-2 hover:border-[rgb(218,255,1)]">
                                    <div className="h-48 overflow-hidden"><img alt="healthylivingguide.net" className="h-full w-full object-cover transition-transform duration-500 hover:scale-110" src="https://images.unsplash.com/photo-1507919909716-c8262e491cde" /></div>
                                    <div className="p-6">
                                        <div className="mb-2 flex items-center gap-2">
                                            <h3 className="text-lg font-semibold">healthylivingguide.net</h3>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-external-link text-[rgb(218,255,1)]" aria-hidden="true">
                                                <path d="M15 3h6v6"></path>
                                                <path d="M10 14 21 3"></path>
                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                            </svg>
                                        </div>
                                        <p className="mb-4 text-sm text-[rgb(161,161,170)]">Health &amp; Wellness</p>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm"><span className="text-[rgb(161,161,170)]">Monthly Visitors</span><span className="font-semibold text-white">38,000</span></div>
                                            <div className="flex justify-between text-sm"><span className="text-[rgb(161,161,170)]">Monthly Revenue</span><span className="font-semibold text-[rgb(218,255,1)]">$1,890</span></div>
                                            <div className="flex justify-between text-sm"><span className="text-[rgb(161,161,170)]">Content Posts</span><span className="font-semibold text-white">142</span></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgb(26,28,30)] transition-all duration-300 hover:-translate-y-2 hover:border-[rgb(218,255,1)]">
                                    <div className="h-48 overflow-hidden"><img alt="financialsmartips.com" className="h-full w-full object-cover transition-transform duration-500 hover:scale-110" src="https://images.unsplash.com/photo-1633307057722-a4740ba0c5d0" /></div>
                                    <div className="p-6">
                                        <div className="mb-2 flex items-center gap-2">
                                            <h3 className="text-lg font-semibold">financialsmartips.com</h3>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-external-link text-[rgb(218,255,1)]" aria-hidden="true">
                                                <path d="M15 3h6v6"></path>
                                                <path d="M10 14 21 3"></path>
                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                            </svg>
                                        </div>
                                        <p className="mb-4 text-sm text-[rgb(161,161,170)]">Finance</p>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm"><span className="text-[rgb(161,161,170)]">Monthly Visitors</span><span className="font-semibold text-white">52,000</span></div>
                                            <div className="flex justify-between text-sm"><span className="text-[rgb(161,161,170)]">Monthly Revenue</span><span className="font-semibold text-[rgb(218,255,1)]">$3,120</span></div>
                                            <div className="flex justify-between text-sm"><span className="text-[rgb(161,161,170)]">Content Posts</span><span className="font-semibold text-white">189</span></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgb(26,28,30)] transition-all duration-300 hover:-translate-y-2 hover:border-[rgb(218,255,1)]">
                                    <div className="h-48 overflow-hidden"><img alt="homeimprovementpro.org" className="h-full w-full object-cover transition-transform duration-500 hover:scale-110" src="https://images.unsplash.com/photo-1686061594225-3e92c0cd51b0" /></div>
                                    <div className="p-6">
                                        <div className="mb-2 flex items-center gap-2">
                                            <h3 className="text-lg font-semibold">homeimprovementpro.org</h3>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-external-link text-[rgb(218,255,1)]" aria-hidden="true">
                                                <path d="M15 3h6v6"></path>
                                                <path d="M10 14 21 3"></path>
                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                            </svg>
                                        </div>
                                        <p className="mb-4 text-sm text-[rgb(161,161,170)]">Home &amp; Garden</p>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm"><span className="text-[rgb(161,161,170)]">Monthly Visitors</span><span className="font-semibold text-white">41,000</span></div>
                                            <div className="flex justify-between text-sm"><span className="text-[rgb(161,161,170)]">Monthly Revenue</span><span className="font-semibold text-[rgb(218,255,1)]">$2,050</span></div>
                                            <div className="flex justify-between text-sm"><span className="text-[rgb(161,161,170)]">Content Posts</span><span className="font-semibold text-white">167</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section> */}
                    <section id="demo" className="bg-[rgb(26,28,30)] py-20">
                        <div className="container mx-auto px-6">
                            <div className="mb-12 text-center">
                                <h2 className="mb-4 text-4xl font-bold md:text-5xl">See It In Action</h2>
                                <p className="mx-auto max-w-2xl text-lg text-[rgb(218,218,218)]">Watch how Fastofy.com transforms idle domains in minutes</p>
                            </div>
                            <div className="mx-auto max-w-5xl">
                                <div className="group flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgb(17,17,19)] transition-all duration-300 hover:border-[rgb(218,255,1)]">
                                    <div className="text-center">
                                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[rgb(218,255,1)] transition-transform duration-300 group-hover:scale-110">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-play ml-1 text-[rgb(17,17,19)]" aria-hidden="true"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>
                                        </div>
                                        <p className="text-lg text-[rgb(218,218,218)]">Click to watch demo video</p>
                                        <p className="mt-2 text-sm text-[rgb(161,161,170)]">(Video placeholder - Coming soon)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section id="pricing" className="py-20">
                        <div className="container mx-auto px-6">
                            <div className="mb-16 text-center">
                                <h2 className="mb-4 text-4xl font-bold md:text-5xl">Simple, Transparent Pricing</h2>
                                <p className="mx-auto max-w-2xl text-lg text-[rgb(218,218,218)]">Choose the plan that fits your domain portfolio</p>
                            </div>
                            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
                                <div className="relative rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgb(26,28,30)] p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[rgb(218,255,1)]">
                                    <h3 className="mb-2 text-2xl font-bold">Starter</h3>
                                    <p className="mb-6 text-[rgb(161,161,170)]">Perfect for launching your first website</p>
                                    <div className="mb-6"><span className="text-5xl font-bold text-[rgb(218,255,1)]">Free</span></div>
                                    <ul className="mb-8 space-y-3">
                                        <li className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-check mt-0.5 flex-shrink-0 text-[rgb(218,255,1)]" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-[rgb(218,218,218)]">1 domain with free hosting (1 year)</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-check mt-0.5 flex-shrink-0 text-[rgb(218,255,1)]" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-[rgb(218,218,218)]">AI-generated website design</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-check mt-0.5 flex-shrink-0 text-[rgb(218,255,1)]" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-[rgb(218,218,218)]">5-7 pages of content</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-check mt-0.5 flex-shrink-0 text-[rgb(218,255,1)]" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-[rgb(218,218,218)]">OnPage SEO optimization</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-check mt-0.5 flex-shrink-0 text-[rgb(218,255,1)]" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-[rgb(218,218,218)]">Mobile responsive design</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-check mt-0.5 flex-shrink-0 text-[rgb(218,255,1)]" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-[rgb(218,218,218)]">SSL security included</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-check mt-0.5 flex-shrink-0 text-[rgb(218,255,1)]" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-[rgb(218,218,218)]">Live chat widget</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-check mt-0.5 flex-shrink-0 text-[rgb(218,255,1)]" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-[rgb(218,218,218)]">Basic analytics dashboard</span>
                                        </li>
                                    </ul>
                                    <button className="w-full rounded-xl border-2 border-[rgb(63,63,63)] bg-transparent py-3 font-semibold text-white transition-all duration-200 hover:-translate-y-1 hover:border-[rgb(218,255,1)] hover:bg-[rgba(218,255,1,0.1)] hover:text-[rgb(218,255,1)]">Get Started</button>
                                </div>
                                <div className="relative rounded-2xl border border-[rgb(218,255,1)] bg-[rgb(26,28,30)] p-8 ring-2 ring-[rgba(218,255,1,0.3)] transition-all duration-300 hover:-translate-y-2 hover:border-[rgb(218,255,1)]">
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform rounded-full bg-[rgb(218,255,1)] px-4 py-1 text-sm font-semibold text-[rgb(17,17,19)]">Most Popular</div>
                                    <h3 className="mb-2 text-2xl font-bold">Professional</h3>
                                    <p className="mb-6 text-[rgb(161,161,170)]">Best for growing your online presence</p>
                                    <div className="mb-6"><span className="text-5xl font-bold text-[rgb(218,255,1)]">$49</span><span className="text-[rgb(161,161,170)]">/month</span></div>
                                    <ul className="mb-8 space-y-3">
                                        <li className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-check mt-0.5 flex-shrink-0 text-[rgb(218,255,1)]" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-[rgb(218,218,218)]">Up to 5 domains</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-check mt-0.5 flex-shrink-0 text-[rgb(218,255,1)]" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-[rgb(218,218,218)]">Drip content scheduling (50 posts/month)</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-check mt-0.5 flex-shrink-0 text-[rgb(218,255,1)]" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-[rgb(218,218,218)]">Advanced SEO with backlinking</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-check mt-0.5 flex-shrink-0 text-[rgb(218,255,1)]" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-[rgb(218,218,218)]">Lead generation forms &amp; popups</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-check mt-0.5 flex-shrink-0 text-[rgb(218,255,1)]" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-[rgb(218,218,218)]">Live chat with automation</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-check mt-0.5 flex-shrink-0 text-[rgb(218,255,1)]" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-[rgb(218,218,218)]">Google AdSense integration</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-check mt-0.5 flex-shrink-0 text-[rgb(218,255,1)]" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-[rgb(218,218,218)]">Amazon Associates support</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-check mt-0.5 flex-shrink-0 text-[rgb(218,255,1)]" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-[rgb(218,218,218)]">Advanced traffic analytics</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-check mt-0.5 flex-shrink-0 text-[rgb(218,255,1)]" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-[rgb(218,218,218)]">Priority email support</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-check mt-0.5 flex-shrink-0 text-[rgb(218,255,1)]" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-[rgb(218,218,218)]">Custom domain mapping</span>
                                        </li>
                                    </ul>
                                    <button className="w-full rounded-xl bg-[rgb(218,255,1)] py-3 font-semibold text-[rgb(17,17,19)] transition-all duration-200 hover:-translate-y-1 hover:bg-[rgb(166,190,21)] hover:shadow-lg hover:shadow-[rgba(218,255,1,0.3)]">Get Started</button>
                                </div>
                                <div className="relative rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgb(26,28,30)] p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[rgb(218,255,1)]">
                                    <h3 className="mb-2 text-2xl font-bold">Enterprise</h3>
                                    <p className="mb-6 text-[rgb(161,161,170)]">For serious businesses and agencies</p>
                                    <div className="mb-6"><span className="text-5xl font-bold text-[rgb(218,255,1)]">$149</span><span className="text-[rgb(161,161,170)]">/month</span></div>
                                    <ul className="mb-8 space-y-3">
                                        <li className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-check mt-0.5 flex-shrink-0 text-[rgb(218,255,1)]" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-[rgb(218,218,218)]">Unlimited domains</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-check mt-0.5 flex-shrink-0 text-[rgb(218,255,1)]" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-[rgb(218,218,218)]">Unlimited drip content</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-check mt-0.5 flex-shrink-0 text-[rgb(218,255,1)]" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-[rgb(218,218,218)]">Premium SEO optimization</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-check mt-0.5 flex-shrink-0 text-[rgb(218,255,1)]" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-[rgb(218,218,218)]">Internal/External backlinking strategy</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-check mt-0.5 flex-shrink-0 text-[rgb(218,255,1)]" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-[rgb(218,218,218)]">Advanced lead generation suite</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-check mt-0.5 flex-shrink-0 text-[rgb(218,255,1)]" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-[rgb(218,218,218)]">Multi-channel chat integration</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-check mt-0.5 flex-shrink-0 text-[rgb(218,255,1)]" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-[rgb(218,218,218)]">Full monetization tools (AdSense + Amazon)</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-check mt-0.5 flex-shrink-0 text-[rgb(218,255,1)]" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-[rgb(218,218,218)]">White-label analytics dashboard</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-check mt-0.5 flex-shrink-0 text-[rgb(218,255,1)]" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-[rgb(218,218,218)]">API access for integrations</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-check mt-0.5 flex-shrink-0 text-[rgb(218,255,1)]" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-[rgb(218,218,218)]">Dedicated account manager</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-check mt-0.5 flex-shrink-0 text-[rgb(218,255,1)]" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-[rgb(218,218,218)]">24/7 priority support</span>
                                        </li>
                                    </ul>
                                    <button className="w-full rounded-xl border-2 border-[rgb(63,63,63)] bg-transparent py-3 font-semibold text-white transition-all duration-200 hover:-translate-y-1 hover:border-[rgb(218,255,1)] hover:bg-[rgba(218,255,1,0.1)] hover:text-[rgb(218,255,1)]">Get Started</button>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section id="testimonials" className="bg-[rgb(26,28,30)] py-20">
                        <div className="container mx-auto px-6">
                            <div className="mb-16 text-center">
                                <h2 className="mb-4 text-4xl font-bold md:text-5xl">What Our Customers Say</h2>
                                <p className="mx-auto max-w-2xl text-lg text-[rgb(218,218,218)]">Join thousands of satisfied domain owners</p>
                            </div>
                            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
                                <div className="rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgb(17,17,19)] p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[rgb(218,255,1)]">
                                    <div className="mb-4 flex gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-star fill-[rgb(218,255,1)] text-[rgb(218,255,1)]" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-star fill-[rgb(218,255,1)] text-[rgb(218,255,1)]" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-star fill-[rgb(218,255,1)] text-[rgb(218,255,1)]" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-star fill-[rgb(218,255,1)] text-[rgb(218,255,1)]" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-star fill-[rgb(218,255,1)] text-[rgb(218,255,1)]" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
                                    </div>
                                    <p className="mb-6 leading-relaxed text-[rgb(218,218,218)]">"I needed a website for my consulting business but didn't have time to learn web design. FASTOFY gave me a professional site in under 10 minutes. Clients love it!"</p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgb(218,255,1)] font-bold text-[rgb(17,17,19)]">MR</div>
                                        <div>
                                            <div className="font-semibold">Michael Rodriguez</div>
                                            <div className="text-sm text-[rgb(161,161,170)]">Small Business Owner</div>
                                            <div className="text-sm text-[rgb(161,161,170)]">Rodriguez Consulting</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgb(17,17,19)] p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[rgb(218,255,1)]">
                                    <div className="mb-4 flex gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-star fill-[rgb(218,255,1)] text-[rgb(218,255,1)]" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-star fill-[rgb(218,255,1)] text-[rgb(218,255,1)]" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-star fill-[rgb(218,255,1)] text-[rgb(218,255,1)]" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-star fill-[rgb(218,255,1)] text-[rgb(218,255,1)]" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-star fill-[rgb(218,255,1)] text-[rgb(218,255,1)]" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
                                    </div>
                                    <p className="mb-6 leading-relaxed text-[rgb(218,218,218)]">"As a designer, I'm picky about websites. FASTOFY exceeded my expectations - clean design, fast loading, and the content was spot-on for my portfolio."</p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgb(218,255,1)] font-bold text-[rgb(17,17,19)]">SC</div>
                                        <div>
                                            <div className="font-semibold">Sarah Chen</div>
                                            <div className="text-sm text-[rgb(161,161,170)]">Freelance Designer</div>
                                            <div className="text-sm text-[rgb(161,161,170)]">Chen Creative Studio</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgb(17,17,19)] p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[rgb(218,255,1)]">
                                    <div className="mb-4 flex gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-star fill-[rgb(218,255,1)] text-[rgb(218,255,1)]" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-star fill-[rgb(218,255,1)] text-[rgb(218,255,1)]" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-star fill-[rgb(218,255,1)] text-[rgb(218,255,1)]" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-star fill-[rgb(218,255,1)] text-[rgb(218,255,1)]" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-star fill-[rgb(218,255,1)] text-[rgb(218,255,1)]" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
                                    </div>
                                    <p className="mb-6 leading-relaxed text-[rgb(218,218,218)]">"I had a domain sitting unused for 2 years. FASTOFY turned it into a beautiful product showcase site. Now I'm getting inquiries weekly!"</p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgb(218,255,1)] font-bold text-[rgb(17,17,19)]">DT</div>
                                        <div>
                                            <div className="font-semibold">David Thompson</div>
                                            <div className="text-sm text-[rgb(161,161,170)]">E-commerce Entrepreneur</div>
                                            <div className="text-sm text-[rgb(161,161,170)]">ThompsonTech Store</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgb(17,17,19)] p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[rgb(218,255,1)]">
                                    <div className="mb-4 flex gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-star fill-[rgb(218,255,1)] text-[rgb(218,255,1)]" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-star fill-[rgb(218,255,1)] text-[rgb(218,255,1)]" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-star fill-[rgb(218,255,1)] text-[rgb(218,255,1)]" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-star fill-[rgb(218,255,1)] text-[rgb(218,255,1)]" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-star fill-[rgb(218,255,1)] text-[rgb(218,255,1)]" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
                                    </div>
                                    <p className="mb-6 leading-relaxed text-[rgb(218,218,218)]">"Setting up my blog was incredibly simple. The AI-generated content gave me a perfect starting point. I just tweaked a few things and went live!"</p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgb(218,255,1)] font-bold text-[rgb(17,17,19)]">PS</div>
                                        <div>
                                            <div className="font-semibold">Priya Sharma</div>
                                            <div className="text-sm text-[rgb(161,161,170)]">Content Creator</div>
                                            <div className="text-sm text-[rgb(161,161,170)]">Sharma Writes</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section id="faq" className="py-20">
                        <div className="container mx-auto px-6">
                            <div className="mb-16 text-center">
                                <h2 className="mb-4 text-4xl font-bold md:text-5xl">Frequently Asked Questions</h2>
                                <p className="mx-auto max-w-2xl text-lg text-[rgb(218,218,218)]">
                                    Everything you need to know about FASTOFY.com
                                </p>
                            </div>
                            <div className="mx-auto max-w-3xl space-y-4">
                                {FAQ_ITEMS.map((item, index) => {
                                    const isOpen = openFaqIndex === index;
                                    return (
                                        <div
                                            key={item.question}
                                            className="overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgb(26,28,30)] transition-all duration-300 hover:border-[rgb(218,255,1)]"
                                        >
                                            <button
                                                type="button"
                                                className="flex w-full items-center justify-between p-6 text-left"
                                                onClick={() =>
                                                    setOpenFaqIndex((prev) => (prev === index ? null : index))
                                                }
                                            >
                                                <span className="pr-4 text-lg font-semibold">{item.question}</span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className={`lucide lucide-chevron-down flex-shrink-0 text-[rgb(218,255,1)] transition-transform duration-300 ${
                                                        isOpen ? "rotate-180" : ""
                                                    }`}
                                                    aria-hidden="true"
                                                >
                                                    <path d="m6 9 6 6 6-6"></path>
                                                </svg>
                                            </button>
                                            <div
                                                className={`overflow-hidden transition-all duration-300 ${
                                                    isOpen ? "max-h-64" : "max-h-0"
                                                }`}
                                            >
                                                <div className="px-6 pb-6 leading-relaxed text-[rgb(218,218,218)]">
                                                    {item.answer}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                    <section className="bg-[rgb(26,28,30)] py-20">
                        <div className="container mx-auto px-6">
                            <div className="mx-auto max-w-4xl rounded-2xl border border-[rgba(218,255,1,0.3)] bg-gradient-to-r from-[rgb(17,17,19)] to-[rgb(26,28,30)] p-12 text-center">
                                <h2 className="mb-4 text-3xl font-bold md:text-4xl">Stay Updated</h2>
                                <p className="mb-8 text-lg text-[rgb(218,218,218)]">
                                    Get the latest tips on domain monetization and AI content strategies
                                </p>
                                <form className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row">
                                    <input
                                        placeholder="Enter your email"
                                        required
                                        className="flex-1 rounded-xl border-2 border-[rgb(63,63,63)] bg-[rgb(17,17,19)] px-6 py-3 text-white placeholder-[rgb(161,161,170)] transition-all focus:border-[rgb(218,255,1)] focus:shadow-[0_0_0_4px_rgba(218,255,1,0.1)] focus:outline-none"
                                        type="email"
                                        value=""
                                    />
                                    <button
                                        type="submit"
                                        className="rounded-xl bg-[rgb(218,255,1)] px-8 py-3 font-semibold text-[rgb(17,17,19)] transition-all duration-200 hover:-translate-y-1 hover:bg-[rgb(166,190,21)] hover:shadow-lg hover:shadow-[rgba(218,255,1,0.3)]"
                                    >
                                        Subscribe
                                    </button>
                                </form>
                            </div>
                        </div>
                    </section>
                    {/* <section id="signup" className="py-20">
                        <div className="container mx-auto px-6">
                            <div className="mx-auto max-w-2xl rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgb(26,28,30)] p-12">
                                <div className="mb-8 text-center">
                                    <h2 className="mb-4 text-3xl font-bold md:text-4xl">Get Started Free</h2>
                                    <p className="text-lg text-[rgb(218,218,218)]">
                                        Sign up now and get{' '}
                                        <span className="font-semibold text-[rgb(218,255,1)]">
                                            FREE website design + hosting for one domain
                                        </span>
                                    </p>
                                    <p className="mt-3 text-sm text-[rgb(161,161,170)]">
                                        Professional website • AI-generated content • SEO optimized • Live in minutes
                                    </p>
                                </div>
                                <form className="space-y-4">
                                    <input
                                        placeholder="Enter your email address"
                                        required
                                        className="w-full rounded-xl border-2 border-[rgb(63,63,63)] bg-[rgb(17,17,19)] px-6 py-4 text-white placeholder-[rgb(161,161,170)] transition-all focus:border-[rgb(218,255,1)] focus:shadow-[0_0_0_4px_rgba(218,255,1,0.1)] focus:outline-none"
                                        type="email"
                                        value=""
                                    />
                                    <button
                                        type="submit"
                                        className="w-full rounded-xl bg-[rgb(218,255,1)] px-8 py-4 text-lg font-semibold text-[rgb(17,17,19)] transition-all duration-200 hover:-translate-y-1 hover:bg-[rgb(166,190,21)] hover:shadow-xl hover:shadow-[rgba(218,255,1,0.3)]"
                                    >
                                        Claim Your Free Website
                                    </button>
                                </form>
                                <p className="mt-6 text-center text-sm text-[rgb(161,161,170)]">No credit card required. Launch your website in minutes.</p>
                            </div>
                        </div>
                    </section> */}
                    <section id="contact" className="bg-[rgb(26,28,30)] py-20">
                        <div className="container mx-auto px-6">
                            <div className="mx-auto max-w-2xl">
                                <div className="mb-12 text-center">
                                    <h2 className="mb-4 text-4xl font-bold md:text-5xl">Get In Touch</h2>
                                    <p className="text-lg text-[rgb(218,218,218)]">Have questions? We'd love to hear from you.</p>
                                </div>
                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <input
                                            placeholder="Your Name"
                                            required
                                            className="rounded-xl border-2 border-[rgb(63,63,63)] bg-[rgb(17,17,19)] px-6 py-4 text-white placeholder-[rgb(161,161,170)] transition-all focus:border-[rgb(218,255,1)] focus:shadow-[0_0_0_4px_rgba(218,255,1,0.1)] focus:outline-none"
                                            type="text"
                                            value=""
                                        />
                                        <input
                                            placeholder="Your Email"
                                            required
                                            className="rounded-xl border-2 border-[rgb(63,63,63)] bg-[rgb(17,17,19)] px-6 py-4 text-white placeholder-[rgb(161,161,170)] transition-all focus:border-[rgb(218,255,1)] focus:shadow-[0_0_0_4px_rgba(218,255,1,0.1)] focus:outline-none"
                                            type="email"
                                            value=""
                                        />
                                    </div>
                                    <input
                                        placeholder="Company (Optional)"
                                        className="w-full rounded-xl border-2 border-[rgb(63,63,63)] bg-[rgb(17,17,19)] px-6 py-4 text-white placeholder-[rgb(161,161,170)] transition-all focus:border-[rgb(218,255,1)] focus:shadow-[0_0_0_4px_rgba(218,255,1,0.1)] focus:outline-none"
                                        type="text"
                                        value=""
                                    />
                                    <textarea
                                        placeholder="Your Message"
                                        required
                                        rows={6}
                                        className="w-full resize-none rounded-xl border-2 border-[rgb(63,63,63)] bg-[rgb(17,17,19)] px-6 py-4 text-white placeholder-[rgb(161,161,170)] transition-all focus:border-[rgb(218,255,1)] focus:shadow-[0_0_0_4px_rgba(218,255,1,0.1)] focus:outline-none"
                                    ></textarea>
                                    <button
                                        type="submit"
                                        className="w-full rounded-xl bg-[rgb(218,255,1)] px-8 py-4 text-lg font-semibold text-[rgb(17,17,19)] transition-all duration-200 hover:-translate-y-1 hover:bg-[rgb(166,190,21)] hover:shadow-xl hover:shadow-[rgba(218,255,1,0.3)]"
                                    >
                                        Send Message
                                    </button>
                                </form>
                            </div>
                        </div>
                    </section>
                    <footer className="mt-32 border-t border-[rgba(255,255,255,0.1)] bg-[rgb(26,28,30)]">
                        <div className="container mx-auto px-6 py-16">
                            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                                <div className="lg:col-span-1">
                                    <div className="flex items-center">
                                        <span className="text-2xl font-bold tracking-tight"><span className="text-white">FASTOFY</span><span className="text-[rgb(218,255,1)]">.com</span></span>
                                    </div>
                                    <p className="mt-4 text-sm leading-relaxed text-[rgb(161,161,170)]">Transform your idle domains into profitable blog portals with AI-powered content and automated monetization.</p>
                                    <div className="mt-6 flex gap-3">
                                        <a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgb(38,40,42)] text-[rgb(161,161,170)] transition-all duration-200 hover:-translate-y-1 hover:bg-[rgb(218,255,1)] hover:text-[rgb(17,17,19)]"
                                        ><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-twitter" aria-hidden="true"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg></a
                                        ><a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgb(38,40,42)] text-[rgb(161,161,170)] transition-all duration-200 hover:-translate-y-1 hover:bg-[rgb(218,255,1)] hover:text-[rgb(17,17,19)]"
                                        ><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-linkedin" aria-hidden="true">
                                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                                <rect width="4" height="12" x="2" y="9"></rect>
                                                <circle cx="4" cy="4" r="2"></circle></svg></a
                                        ><a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgb(38,40,42)] text-[rgb(161,161,170)] transition-all duration-200 hover:-translate-y-1 hover:bg-[rgb(218,255,1)] hover:text-[rgb(17,17,19)]"
                                        ><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-github" aria-hidden="true">
                                                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                                                <path d="M9 18c-4.51 2-5-2-7-2"></path></svg></a
                                        ><a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgb(38,40,42)] text-[rgb(161,161,170)] transition-all duration-200 hover:-translate-y-1 hover:bg-[rgb(218,255,1)] hover:text-[rgb(17,17,19)]"
                                        ><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-mail" aria-hidden="true">
                                                <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                                                <rect x="2" y="4" width="20" height="16" rx="2"></rect></svg
                                            ></a>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="mb-4 text-lg font-semibold text-white">Product</h3>
                                    <ul className="space-y-3">
                                        <li><button className="text-sm text-[rgb(161,161,170)] transition-colors duration-200 hover:text-[rgb(218,255,1)]">Features</button></li>
                                        <li><button className="text-sm text-[rgb(161,161,170)] transition-colors duration-200 hover:text-[rgb(218,255,1)]">Pricing</button></li>
                                        <li><button className="text-sm text-[rgb(161,161,170)] transition-colors duration-200 hover:text-[rgb(218,255,1)]">Sample Websites</button></li>
                                        <li><button className="text-sm text-[rgb(161,161,170)] transition-colors duration-200 hover:text-[rgb(218,255,1)]">Testimonials</button></li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="mb-4 text-lg font-semibold text-white">Company</h3>
                                    <ul className="space-y-3">
                                        <li><button className="text-sm text-[rgb(161,161,170)] transition-colors duration-200 hover:text-[rgb(218,255,1)]">About Us</button></li>
                                        <li><button className="text-sm text-[rgb(161,161,170)] transition-colors duration-200 hover:text-[rgb(218,255,1)]">Contact</button></li>
                                        <li><a href="#" className="text-sm text-[rgb(161,161,170)] transition-colors duration-200 hover:text-[rgb(218,255,1)]">Blog</a></li>
                                        <li><a href="#" className="text-sm text-[rgb(161,161,170)] transition-colors duration-200 hover:text-[rgb(218,255,1)]">Careers</a></li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="mb-4 text-lg font-semibold text-white">Support</h3>
                                    <ul className="space-y-3">
                                        <li><button className="text-sm text-[rgb(161,161,170)] transition-colors duration-200 hover:text-[rgb(218,255,1)]">FAQ</button></li>
                                        <li><a href="#" className="text-sm text-[rgb(161,161,170)] transition-colors duration-200 hover:text-[rgb(218,255,1)]">Documentation</a></li>
                                        <li><a href="#" className="text-sm text-[rgb(161,161,170)] transition-colors duration-200 hover:text-[rgb(218,255,1)]">Privacy Policy</a></li>
                                        <li><a href="#" className="text-sm text-[rgb(161,161,170)] transition-colors duration-200 hover:text-[rgb(218,255,1)]">Terms of Service</a></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-12 border-t border-[rgba(255,255,255,0.1)] pt-8">
                                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                                    <p className="text-sm text-[rgb(161,161,170)]">© {new Date().getFullYear()} FASTOFY.com. All rights reserved.</p>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}

